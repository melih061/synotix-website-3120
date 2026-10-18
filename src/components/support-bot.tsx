"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, User, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Guten Tag! Dieses technische Beispiel verwendet die fiktive Müller Maschinenbau GmbH. Fragen Sie mich zu den Beispielprodukten oder Abläufen. Meine Antworten sind Demo-Inhalte und keine verbindlichen Auskünfte.",
};

const SUGGESTED = [
  "Wie lange ist die Lieferzeit für MX-400?",
  "Wie bestelle ich ein Sonderwerkzeug?",
  "Meine Lieferung fehlt — was tun?",
  "Welche Zertifizierungen habt ihr?",
  "Wie funktioniert eine Reklamation?",
];

const CONTEXT_TAGS = [
  "Beispielprodukte", "Beispielkonditionen", "Beispielabläufe",
];

export function SupportBot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Abort any in-flight request when the component unmounts (e.g. tab switch)
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    // Nur den Chat-Container scrollen, NICHT die Seite (scrollIntoView würde
    // alle Scroll-Vorfahren inkl. window bewegen → Seite springt nach unten).
    // Außerdem nur, wenn der Nutzer ohnehin unten ist — sonst reißt es ihn beim
    // Hochscrollen während des Streamings zurück.
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  async function handleSend(text?: string) {
    const message = (text || input).trim();
    if (!message || isStreaming) return;

    setInput("");
    setApiError(null);

    const userMessage: Message = { role: "user", content: message };
    // Cap history to last 20 messages to control token cost
    const newMessages = [...messages, userMessage].slice(-20);
    setMessages(newMessages);
    setIsStreaming(true);

    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantPlaceholder]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        // Don't expose raw API error details to the user
        throw new Error("Der KI-Service ist momentan nicht erreichbar. Bitte versuchen Sie es später.");
      }

      if (!response.body) {
        throw new Error("Keine Streaming-Antwort erhalten.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch (err) {
      // Ignore aborts (user navigated away) — not a real error
      if (err instanceof DOMException && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Verbindungsfehler";
      setApiError(msg);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  const showSuggested = messages.length <= 2 && !isStreaming;

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed" style={{ color: "var(--tx-1)" }}>
        Ein möglicher Wissensbaustein bei konkretem Kundenbedarf. Der Chat verwendet fiktive Unternehmensinformationen und kann falsche Antworten geben. Bitte geben Sie ausschließlich erfundene Testdaten ein; Ihre Eingabe wird an den Chat-Dienst gesendet.
      </p>
      {/* Context banner */}
      <div
        className="px-5 py-3 flex flex-wrap items-center gap-2"
        style={{ backgroundColor: "var(--bg-3)", border: "1px solid var(--bd)" }}
      >
        <span className="label-mono mr-2">Fiktiver Kontext:</span>
        {CONTEXT_TAGS.map(tag => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>

      {/* Chat window */}
      <div
        className="relative overflow-hidden"
        style={{ border: "1px solid var(--bd-hi)", backgroundColor: "var(--bg-1)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 border-b px-6 py-4"
          style={{ borderColor: "var(--bd)", backgroundColor: "var(--bg-2)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center"
              style={{ backgroundColor: "var(--violet-glow)", border: "1px solid var(--violet-line)" }}
            >
              <Bot className="h-5 w-5" style={{ color: "var(--violet)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--tx-0)", fontFamily: "var(--f-body)" }}>
                Müller Maschinenbau – Demo
              </p>
              <p className="text-xs flex items-center gap-2" style={{ color: "var(--tx-2)", fontFamily: "var(--f-mono)" }}>
                <span className="live-dot" />
                {isStreaming ? "Antwortet..." : "Technisches Chat-Beispiel"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip chip-violet hidden sm:inline-flex">by SYNOTIX</span>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="overflow-y-auto p-6"
          style={{ backgroundColor: "var(--bg-0)", minHeight: 320, maxHeight: 400 }}
        >
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: msg.role === "assistant" ? "var(--violet-glow)" : "var(--bg-3)",
                    border: `1px solid ${msg.role === "assistant" ? "var(--violet-line)" : "var(--bd-hi)"}`,
                  }}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="h-4 w-4" style={{ color: "var(--violet)" }} />
                  ) : (
                    <User className="h-4 w-4" style={{ color: "var(--tx-1)" }} />
                  )}
                </div>
                <div
                  className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
                  style={{
                    backgroundColor: msg.role === "assistant" ? "var(--bg-2)" : "var(--violet-glow)",
                    border: `1px solid ${msg.role === "assistant" ? "var(--bd)" : "var(--violet-line)"}`,
                    color: "var(--tx-0)",
                    fontFamily: "var(--f-body)",
                  }}
                >
                  {msg.content}
                  {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                    <span className="cursor-blink" style={{ color: "var(--violet-mid)", marginLeft: 1 }}>▌</span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing dots (while request in flight but no content yet) */}
            {isStreaming && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center"
                  style={{ backgroundColor: "var(--violet-glow)", border: "1px solid var(--violet-line)" }}
                >
                  <Bot className="h-4 w-4" style={{ color: "var(--violet)" }} />
                </div>
                <div className="px-4 py-3" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd)" }}>
                  <div className="flex gap-1">
                    {[0, 150, 300].map(delay => (
                      <span key={delay} className="h-1.5 w-1.5 animate-bounce inline-block"
                        style={{ backgroundColor: "var(--violet-mid)", animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested questions */}
        <AnimatePresence>
          {showSuggested && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 border-t px-6 py-4"
              style={{ borderColor: "var(--bd)", backgroundColor: "var(--bg-2)" }}
            >
              {SUGGESTED.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors"
                  style={{
                    color: "var(--tx-1)", border: "1px solid var(--bd-hi)",
                    backgroundColor: "var(--bg-1)", fontFamily: "var(--f-body)", cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--violet-line)";
                    (e.currentTarget as HTMLElement).style.color = "var(--tx-0)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--bd-hi)";
                    (e.currentTarget as HTMLElement).style.color = "var(--tx-1)";
                  }}
                >
                  <Sparkles className="h-3 w-3" style={{ color: "var(--violet-mid)" }} />
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {apiError && (
          <div
            className="px-6 py-3 text-xs"
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              borderTop: "1px solid rgba(239,68,68,0.3)",
              color: "var(--err)",
              fontFamily: "var(--f-mono)",
            }}
          >
            ⚠ {apiError}
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4" style={{ borderColor: "var(--bd)", backgroundColor: "var(--bg-2)" }}>
          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Stellen Sie eine Frage..."
              aria-label="Frage mit fiktiven Testdaten"
              disabled={isStreaming}
              className="min-w-0 flex-1 px-4 py-2.5 text-sm focus:outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-1)", color: "var(--tx-0)",
                border: "1px solid var(--bd-hi)", fontFamily: "var(--f-body)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--violet)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--bd-hi)")}
            />
            <button
              type="submit"
              aria-label="Frage senden"
              disabled={!input.trim() || isStreaming}
              className="btn-violet flex h-10 w-10 shrink-0 items-center justify-center"
              style={{ opacity: (!input.trim() || isStreaming) ? 0.4 : 1, cursor: (!input.trim() || isStreaming) ? "not-allowed" : "pointer" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Customer-specific operating scope */}
      <p
        className="text-xs text-center"
        style={{ fontFamily: "var(--f-mono)", color: "var(--tx-2)", letterSpacing: "0.04em" }}
      >
        Für einen Kundeneinsatz werden Datenzugriff, Quellen, Freigaben und Betriebsgrenzen gesondert vereinbart.
      </p>
    </div>
  );
}
