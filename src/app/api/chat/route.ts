import OpenAI from "openai";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Du bist ein ausdrücklich fiktiver Wissens-Assistent in einer Synotix-Demonstration.
Der Beispielbetrieb Müller Maschinenbau und alle Beispiele sind erfunden, keine Referenzkunden.
Erkläre auf Deutsch, wie ein Assistent Fragen aus freigegebenen Dokumenten beantworten könnte.
Du hast KEINEN Zugriff auf ERP, Bestellungen, Lagerbestände, Kundendaten oder externe Werkzeuge.
Behaupte niemals, etwas abgefragt, geprüft, versendet oder verändert zu haben.
Erfinde keine Bestände, Preise, Liefertermine, Zertifizierungen, Audits oder Datenschutzbelege.
Bei konkreten betrieblichen Fragen: fehlende Quelle nennen und menschliche Prüfung empfehlen.
Synotix ist eine KI-Beratung für den Mittelstand: zuerst eine bezahlte Prozessanalyse, danach nach Bedarf
eine maßgeschneiderte Lösung, eine Schulung oder ein Digitalisierungsschritt, jeweils als eigener Auftrag.
DataSynth ist eine Beispiellösung zur betreuten Rechnungsprüfung, technisch getestet, nicht produktiv freigegeben.
Nenne niemals Preise oder Kosten von Synotix; verweise dafür auf das Erstgespräch.
Vor DATEV-Import, Buchung und Zahlung entscheidet ein Mensch. Wissensbausteine nur bei bezahltem Bedarf.
Keine garantierten Einsparungen, Verfügbarkeiten, Lieferfristen oder pauschalen Datenschutzversprechen.
Maximal 3–4 Sätze. Kennzeichne Antworten als Demonstration ohne Live-Systemzugriff.`;

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 1000;

// Simple in-memory rate limit: max requests per IP within a sliding window.
// Protects against cost-spam when deployed publicly (demo.synotix.de).
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup to keep the map small
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

function err(msg: string, status: number) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  // Mistral (EU) statt OpenAI: Eingaben öffentlicher Besucher bleiben bei einem EU-Anbieter.
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return err("API nicht konfiguriert.", 500);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return err("Zu viele Anfragen. Bitte einen Moment warten.", 429);
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Ungültiges JSON.", 400);
  }

  if (!body || typeof body !== "object" || !("messages" in body)) {
    return err("Fehlende Pflichtfelder.", 400);
  }

  const raw = (body as { messages: unknown }).messages;

  if (!Array.isArray(raw) || raw.length === 0) {
    return err("messages muss ein nicht-leeres Array sein.", 400);
  }

  // Validate each message: only user/assistant roles, cap content length
  type SafeMessage = { role: "user" | "assistant"; content: string };
  const messages: SafeMessage[] = [];

  for (const m of raw) {
    if (!m || typeof m !== "object") return err("Ungültiges Nachrichtenformat.", 400);
    const { role, content } = m as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return err("Ungültige Rolle.", 400);
    if (typeof content !== "string") return err("content muss ein String sein.", 400);
    messages.push({ role, content: content.slice(0, MAX_CONTENT_LENGTH) });
  }

  // Keep only the last N messages to limit token usage
  const trimmed = messages.slice(-MAX_MESSAGES);

  // Mistral ist OpenAI-kompatibel; feste Modellversion statt "-latest".
  const openai = new OpenAI({ apiKey, baseURL: "https://api.mistral.ai/v1" });
  const model = process.env.MISTRAL_MODEL || "mistral-small-2603";

  let stream: Awaited<ReturnType<typeof openai.chat.completions.create>>;
  try {
    stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
      max_tokens: 300,
      temperature: 0.7,
    });
  } catch {
    return err("KI-Service momentan nicht verfügbar.", 503);
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch {
        // Stream error mid-flight — close cleanly
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
