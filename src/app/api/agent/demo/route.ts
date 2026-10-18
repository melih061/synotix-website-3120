import { NextRequest } from "next/server";

// Proxy zur internen REA-Demo (site-agent). Der Browser spricht nur mit dieser
// Origin; damit bleibt die CSP bei connect-src 'self'.
const AGENT_URL = process.env.SITE_AGENT_URL;
const BELEG_ID = /^[a-z0-9-]{1,32}$/;

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
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

export async function GET() {
  if (!AGENT_URL) return err("Demo nicht verfügbar.", 503);
  try {
    const res = await fetch(`${AGENT_URL}/demo/belege`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) return err("Demo nicht verfügbar.", 503);
    return new Response(await res.text(), { headers: { "Content-Type": "application/json" } });
  } catch {
    return err("Demo nicht verfügbar.", 503);
  }
}

export async function POST(request: NextRequest) {
  if (!AGENT_URL) return err("Demo nicht verfügbar.", 503);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) return err("Zu viele Anfragen. Bitte einen Moment warten.", 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Ungültiges JSON.", 400);
  }
  const belegId = (body as { beleg_id?: unknown } | null)?.beleg_id;
  if (typeof belegId !== "string" || !BELEG_ID.test(belegId)) return err("Ungültiger Beleg.", 400);

  let upstream: Response;
  try {
    upstream = await fetch(`${AGENT_URL}/demo/lauf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beleg_id: belegId }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return err("Demo nicht verfügbar.", 503);
  }
  if (!upstream.ok || !upstream.body) {
    return err(upstream.status === 429 ? "Gerade viele Demos gleichzeitig." : "Demo nicht verfügbar.", upstream.status === 429 ? 429 : 503);
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
