import assert from "node:assert/strict";
import test from "node:test";
import { createContactHandler } from "./contact-core.ts";

const VALID_BODY = {
  name: "Erika Muster",
  email: "erika@example.de",
  company: "Musterteile GmbH",
  message: "Wir prüfen monatlich etwa 120 Lieferantenrechnungen manuell.",
  website: "",
};

const ENV = {
  RESEND_API_KEY: "test-key",
  CONTACT_TO_EMAIL: "kontakt@synotix.de",
  CONTACT_FROM_EMAIL: "Synotix Website <kontakt@synotix.de>",
};

function request(body: unknown = VALID_BODY, headers: Record<string, string> = {}) {
  return new Request("https://www.synotix.de/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://www.synotix.de",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function json(response: Response) {
  return response.json() as Promise<{ ok: boolean; code?: string }>;
}

test("returns success only after the delivery service accepts the message", async () => {
  let deliveryBody = "";
  const handler = createContactHandler({
    env: ENV,
    fetch: async (_input, init) => {
      deliveryBody = String(init?.body ?? "");
      return new Response(null, { status: 202 });
    },
  });

  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { ok: true });
  assert.match(deliveryBody, /Erika Muster/);
});

test("fails closed when delivery is not configured", async () => {
  const response = await createContactHandler({ env: {} })(request());
  assert.equal(response.status, 503);
  assert.equal((await json(response)).code, "CONTACT_UNAVAILABLE");
});

test("maps delivery failures to a stable error without exposing provider output", async () => {
  const handler = createContactHandler({ env: ENV, fetch: async () => new Response("provider details", { status: 500 }) });
  const response = await handler(request());
  assert.equal(response.status, 502);
  assert.equal((await json(response)).code, "DELIVERY_FAILED");
});

test("requires JSON content", async () => {
  const response = await createContactHandler({ env: ENV })(request("name=Erika", { "content-type": "text/plain" }));
  assert.equal(response.status, 415);
  assert.equal((await json(response)).code, "UNSUPPORTED_MEDIA_TYPE");
});

test("rejects payloads larger than 16 KB", async () => {
  const response = await createContactHandler({ env: ENV })(request({ ...VALID_BODY, message: "x".repeat(17_000) }));
  assert.equal(response.status, 413);
  assert.equal((await json(response)).code, "PAYLOAD_TOO_LARGE");
});

test("cancels an oversized streaming body before parsing it", async () => {
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      controller.enqueue(new Uint8Array(10_000));
    },
    cancel() {
      cancelled = true;
    },
  });
  const streamingRequest = new Request("https://www.synotix.de/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://www.synotix.de" },
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  const response = await createContactHandler({ env: ENV })(streamingRequest);
  assert.equal(response.status, 413);
  assert.equal((await json(response)).code, "PAYLOAD_TOO_LARGE");
  assert.equal(cancelled, true);
});

test("rejects invalid JSON", async () => {
  const response = await createContactHandler({ env: ENV })(request("{"));
  assert.equal(response.status, 400);
  assert.equal((await json(response)).code, "INVALID_JSON");
});

test("adds optional first-meeting details to the delivered message", async () => {
  let deliveryBody = "";
  const handler = createContactHandler({
    env: ENV,
    fetch: async (_input, init) => {
      deliveryBody = String(init?.body ?? "");
      return new Response(null, { status: 202 });
    },
  });

  const response = await handler(request({
    ...VALID_BODY, anliegen: "Schulung für mein Team", branche: "Metallverarbeitung", mitarbeitende: "26–75",
  }));
  assert.equal(response.status, 200);
  assert.match(deliveryBody, /Anliegen: Schulung für mein Team/);
  assert.match(deliveryBody, /Branche: Metallverarbeitung/);
  assert.match(deliveryBody, /Mitarbeitende: 26–75/);
});

test("rejects invalid field lengths and email addresses", async () => {
  const cases = [
    { ...VALID_BODY, name: "E" },
    { ...VALID_BODY, email: "nicht-gueltig" },
    { ...VALID_BODY, company: "x".repeat(161) },
    { ...VALID_BODY, message: "zu kurz" },
    { ...VALID_BODY, message: "x".repeat(4001) },
    { ...VALID_BODY, anliegen: "Etwas anderes" },
    { ...VALID_BODY, mitarbeitende: "5000" },
    { ...VALID_BODY, branche: "x".repeat(81) },
  ];

  for (const body of cases) {
    const response = await createContactHandler({ env: ENV })(request(body));
    assert.equal(response.status, 422);
    assert.equal((await json(response)).code, "VALIDATION_FAILED");
  }
});

test("does not report honeypot submissions as delivered", async () => {
  const response = await createContactHandler({ env: ENV })(request({ ...VALID_BODY, website: "spam.example" }));
  assert.equal(response.status, 422);
  assert.equal((await json(response)).code, "INVALID_SUBMISSION");
});

test("rejects cross-origin submissions", async () => {
  const response = await createContactHandler({ env: ENV })(request(VALID_BODY, { origin: "https://example.com" }));
  assert.equal(response.status, 403);
  assert.equal((await json(response)).code, "ORIGIN_NOT_ALLOWED");
});

test("rate-limits the sixth request within one minute", async () => {
  const handler = createContactHandler({
    env: { ...ENV, CONTACT_TRUST_PROXY_HEADERS: "true" },
    now: () => 1_000,
    fetch: async () => new Response(null, { status: 202 }),
  });

  for (let index = 0; index < 5; index += 1) {
    assert.equal((await handler(request(VALID_BODY, { "x-forwarded-for": "198.51.100.20" }))).status, 200);
  }

  const response = await handler(request(VALID_BODY, { "x-forwarded-for": "198.51.100.20" }));
  assert.equal(response.status, 429);
  assert.equal((await json(response)).code, "RATE_LIMITED");
});

test("ignores caller-supplied forwarding headers by default without sharing a five-request bucket", async () => {
  const handler = createContactHandler({
    env: ENV,
    now: () => 1_000,
    fetch: async () => new Response(null, { status: 202 }),
  });

  for (let index = 0; index < 6; index += 1) {
    const response = await handler(request(VALID_BODY, { "x-forwarded-for": `198.51.100.${index}` }));
    assert.equal(response.status, 200);
  }
});

test("caps aggregate delivery attempts even when trusted proxy keys vary", async () => {
  const handler = createContactHandler({
    env: { ...ENV, CONTACT_TRUST_PROXY_HEADERS: "true" },
    now: () => 1_000,
    fetch: async () => new Response(null, { status: 202 }),
  });

  for (let index = 0; index < 30; index += 1) {
    const response = await handler(request(VALID_BODY, { "x-forwarded-for": `198.51.100.${index}` }));
    assert.equal(response.status, 200);
  }

  const response = await handler(request(VALID_BODY, { "x-forwarded-for": "203.0.113.99" }));
  assert.equal(response.status, 429);
  assert.equal((await json(response)).code, "RATE_LIMITED");
});

test("invalid submissions do not consume the outbound delivery budget", async () => {
  const handler = createContactHandler({
    env: ENV,
    now: () => 1_000,
    fetch: async () => new Response(null, { status: 202 }),
  });

  for (let index = 0; index < 30; index += 1) {
    const response = await handler(request("{", { "x-forwarded-for": `198.51.100.${index}` }));
    assert.equal(response.status, 400);
  }

  assert.equal((await handler(request())).status, 200);
});
