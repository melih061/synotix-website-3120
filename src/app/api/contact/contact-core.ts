import { getSupabaseServerClient } from "../../../lib/supabase-server.ts";
import { ANLIEGEN, BRANCHE_MAX, MITARBEITENDE } from "../../../lib/erstgespraech.ts";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = 5;
const GLOBAL_REQUEST_LIMIT = 300;
const GLOBAL_DELIVERY_LIMIT = 30;
const WINDOW_MS = 60_000;
const MAX_RATE_LIMIT_KEYS = 10_000;

type ContactData = {
  name: string;
  email: string;
  company: string;
  message: string;
  anliegen: string;
  branche: string;
  mitarbeitende: string;
};

type ContactEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
  CONTACT_TRUST_PROXY_HEADERS?: string;
};

type HandlerDependencies = {
  env?: ContactEnvironment;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
};

type ErrorCode =
  | "CONTACT_UNAVAILABLE"
  | "DELIVERY_FAILED"
  | "INVALID_JSON"
  | "INVALID_SUBMISSION"
  | "ORIGIN_NOT_ALLOWED"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "VALIDATION_FAILED";

function errorResponse(status: number, code: ErrorCode, error: string) {
  return Response.json({ ok: false, code, error }, { status });
}

class MemoryRateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxKeys: number;

  constructor(limit: number, windowMs: number, maxKeys = MAX_RATE_LIMIT_KEYS) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxKeys = maxKeys;
  }

  isLimited(key: string, now: number) {
    const current = this.hits.get(key);

    if (!current || now >= current.resetAt) {
      if (!current && this.hits.size >= this.maxKeys) {
        const oldestKey = this.hits.keys().next().value as string | undefined;
        if (oldestKey) this.hits.delete(oldestKey);
      }

      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return false;
    }

    if (current.count >= this.limit) return true;

    current.count += 1;
    return false;
  }
}

function clientKey(headers: Headers, trustProxyHeaders: boolean) {
  if (!trustProxyHeaders) return null;

  const forwarded = headers.get("x-forwarded-for")
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const candidate = forwarded?.at(-1) || headers.get("x-real-ip")?.trim() || "unknown";
  return candidate.slice(0, 128);
}

async function readBodyWithLimit(request: Request, maxBytes: number) {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

function hasAllowedOrigin(request: Request, configuredOrigins?: string) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestUrl = new URL(request.url);
  const allowed = new Set([
    "https://www.synotix.de",
    ...(configuredOrigins ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  ]);

  if (["localhost", "127.0.0.1", "::1"].includes(requestUrl.hostname)) {
    allowed.add(requestUrl.origin);
  }

  return allowed.has(origin);
}

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}

function validatePayload(value: unknown):
  | { ok: true; data: ContactData }
  | { ok: false; code: ErrorCode; error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Die Formulardaten sind ungültig." };
  }

  const body = value as Record<string, unknown>;
  const website = asTrimmedString(body.website);
  if (website) {
    return { ok: false, code: "INVALID_SUBMISSION", error: "Die Anfrage konnte nicht verarbeitet werden." };
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const company = body.company == null ? "" : asTrimmedString(body.company);
  const message = asTrimmedString(body.message);
  // Optionale Erstgespräch-Felder: leer erlaubt, sonst nur bekannte Werte.
  const anliegen = body.anliegen == null ? "" : asTrimmedString(body.anliegen);
  const branche = body.branche == null ? "" : asTrimmedString(body.branche);
  const mitarbeitende = body.mitarbeitende == null ? "" : asTrimmedString(body.mitarbeitende);

  if (name === null || email === null || company === null || message === null
    || anliegen === null || branche === null || mitarbeitende === null) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Die Formulardaten sind ungültig." };
  }
  if (name.length < 2 || name.length > 120) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Bitte geben Sie einen Namen mit 2 bis 120 Zeichen ein." };
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  }
  if (company.length > 160) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Der Unternehmensname darf höchstens 160 Zeichen lang sein." };
  }
  if (message.length < 20 || message.length > 4000) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Die Nachricht muss zwischen 20 und 4.000 Zeichen lang sein." };
  }

  if (anliegen && !(ANLIEGEN as readonly string[]).includes(anliegen)) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Bitte wählen Sie ein Anliegen aus der Liste." };
  }
  if (mitarbeitende && !(MITARBEITENDE as readonly string[]).includes(mitarbeitende)) {
    return { ok: false, code: "VALIDATION_FAILED", error: "Bitte wählen Sie eine Betriebsgröße aus der Liste." };
  }
  if (branche.length > BRANCHE_MAX) {
    return { ok: false, code: "VALIDATION_FAILED", error: `Die Branche darf höchstens ${BRANCHE_MAX} Zeichen lang sein.` };
  }

  return { ok: true, data: { name, email, company, message, anliegen, branche, mitarbeitende } };
}

/** Erstgespräch-Angaben vor die Nachricht stellen; Tabellenschema bleibt unverändert. */
function withDetails({ message, anliegen, branche, mitarbeitende }: ContactData): string {
  const lines = [
    anliegen && `Anliegen: ${anliegen}`,
    branche && `Branche: ${branche}`,
    mitarbeitende && `Mitarbeitende: ${mitarbeitende}`,
  ].filter(Boolean);
  return lines.length ? `${lines.join("\n")}\n\n${message}` : message;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

export function createContactHandler(dependencies: HandlerDependencies = {}) {
  const limiter = new MemoryRateLimiter(RATE_LIMIT, WINDOW_MS);
  const requestLimiter = new MemoryRateLimiter(GLOBAL_REQUEST_LIMIT, WINDOW_MS, 1);
  const deliveryLimiter = new MemoryRateLimiter(GLOBAL_DELIVERY_LIMIT, WINDOW_MS, 1);
  const env = dependencies.env ?? process.env;
  const fetcher = dependencies.fetch ?? globalThis.fetch;
  const now = dependencies.now ?? Date.now;

  return async function handleContactRequest(request: Request) {
    try {
      if (!hasAllowedOrigin(request, env.CONTACT_ALLOWED_ORIGINS)) {
        return errorResponse(403, "ORIGIN_NOT_ALLOWED", "Diese Anfrage ist von der aktuellen Herkunft nicht erlaubt.");
      }

      const requestTime = now();
      const trustProxyHeaders = env.CONTACT_TRUST_PROXY_HEADERS?.trim().toLowerCase() === "true";
      const requestClientKey = clientKey(request.headers, trustProxyHeaders);
      if (requestLimiter.isLimited("global", requestTime)) {
        return errorResponse(429, "RATE_LIMITED", "Zu viele Anfragen. Bitte warten Sie einen Moment.");
      }
      if (requestClientKey && limiter.isLimited(requestClientKey, requestTime)) {
        return errorResponse(429, "RATE_LIMITED", "Zu viele Anfragen. Bitte warten Sie einen Moment.");
      }

      const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
      if (contentType !== "application/json") {
        return errorResponse(415, "UNSUPPORTED_MEDIA_TYPE", "Das Kontaktformular erwartet JSON-Daten.");
      }

      const declaredLength = Number(request.headers.get("content-length") ?? 0);
      if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
        return errorResponse(413, "PAYLOAD_TOO_LARGE", "Die Anfrage ist zu groß.");
      }

      const rawBody = await readBodyWithLimit(request, MAX_BODY_BYTES);
      if (rawBody === null) {
        return errorResponse(413, "PAYLOAD_TOO_LARGE", "Die Anfrage ist zu groß.");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawBody);
      } catch {
        return errorResponse(400, "INVALID_JSON", "Die Anfrage enthält kein gültiges JSON.");
      }

      const validated = validatePayload(parsed);
      if (!validated.ok) {
        return errorResponse(422, validated.code, validated.error);
      }

      const apiKey = env.RESEND_API_KEY?.trim();
      const to = env.CONTACT_TO_EMAIL?.trim();
      const from = env.CONTACT_FROM_EMAIL?.trim();
      if (!apiKey || !to || !from) {
        return errorResponse(
          503,
          "CONTACT_UNAVAILABLE",
          "Das Kontaktformular ist vorübergehend nicht verfügbar. Bitte schreiben Sie an kontakt@synotix.de.",
        );
      }

      if (deliveryLimiter.isLimited("delivery", now())) {
        return errorResponse(429, "RATE_LIMITED", "Zu viele Anfragen. Bitte warten Sie einen Moment.");
      }

      const { name, email, company } = validated.data;
      const message = withDetails(validated.data);

      try {
        const supabase = getSupabaseServerClient();
        if (supabase) {
          const { error: insertError } = await supabase
            .from("contact_submissions")
            .insert({ name, email, company: company || null, message });
          if (insertError) {
            console.error("[contact] Supabase insert fehlgeschlagen", insertError.message);
          }
        }
      } catch (supabaseException) {
        console.error("[contact] Supabase nicht erreichbar", supabaseException);
      }

      const html = `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Unternehmen:</strong> ${escapeHtml(company) || "–"}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Erstgespräch – Angaben und Ablauf:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

      let deliveryResponse: Response;
      try {
        deliveryResponse = await fetcher("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: email,
            subject: `Kontakt: ${name}${company ? ` · ${company}` : ""}`,
            html,
          }),
        });
      } catch {
        return errorResponse(502, "DELIVERY_FAILED", "Der Versand ist fehlgeschlagen. Bitte schreiben Sie an kontakt@synotix.de.");
      }

      if (!deliveryResponse.ok) {
        console.error("[contact] E-Mail-Dienst nicht verfügbar", { status: deliveryResponse.status });
        return errorResponse(502, "DELIVERY_FAILED", "Der Versand ist fehlgeschlagen. Bitte schreiben Sie an kontakt@synotix.de.");
      }

      return Response.json({ ok: true });
    } catch {
      return errorResponse(500, "SERVER_ERROR", "Die Anfrage konnte nicht verarbeitet werden.");
    }
  };
}
