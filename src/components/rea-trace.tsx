"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, CheckCircle, Play, RotateCcw, ShieldCheck, UserCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics-events";
import { InvoiceDemo } from "./invoice-demo";

type Beleg = { id: string; titel: string; lieferant: string };
type Schritt = { phase: string; knoten: string; status: string; kurztext: string };
type Befund = { regel: string; schwere: "ok" | "hinweis"; text: string };
type Ergebnis = {
  beleg: { label: string; wert: string }[];
  befunde: Befund[];
  buchung: Record<string, string>;
  empfehlung: string;
  entscheidung: string;
  hinweis: string;
};

const PHASEN = [
  { id: "reasoning", label: "REASONING", detail: "Absicht erkennen, Plan festlegen" },
  { id: "execution", label: "EXECUTION", detail: "Einlesen, Prüfregeln, Buchungsentwurf" },
  { id: "action", label: "ACTION", detail: "Vorschlag am Freigabepunkt" },
] as const;

const KNOTEN_LABEL: Record<string, string> = {
  waechter_eingang: "Wächter · Eingang",
  lotse: "Lotse",
  einlesen: "Einlesen",
  pruefen: "Prüfregeln",
  buchungsentwurf: "Buchungsentwurf",
  waechter_ausgang: "Wächter · Ausgang",
  freigabepunkt: "Freigabepunkt",
};

export function ReaTrace() {
  const [belege, setBelege] = useState<Beleg[] | null>(null);
  const [nichtVerfuegbar, setNichtVerfuegbar] = useState(false);
  const [auswahl, setAuswahl] = useState<string>("");
  const [schritte, setSchritte] = useState<Schritt[]>([]);
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");
  const [entscheidung, setEntscheidung] = useState<"" | "frei" | "zurueck">("");
  const abortRef = useRef<AbortController | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let aktiv = true;
    fetch("/api/agent/demo")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { belege: Beleg[] };
        if (!aktiv) return;
        setBelege(data.belege);
        setAuswahl(data.belege[0]?.id ?? "");
      })
      .catch(() => aktiv && setNichtVerfuegbar(true));
    return () => {
      aktiv = false;
      abortRef.current?.abort();
    };
  }, []);

  // Ohne laufenden site-agent bleibt die bisherige, rein clientseitige Demo sichtbar.
  if (nichtVerfuegbar) return <InvoiceDemo />;

  function zuruecksetzen() {
    abortRef.current?.abort();
    setSchritte([]);
    setErgebnis(null);
    setFehler("");
    setEntscheidung("");
    setLaeuft(false);
  }

  async function starten() {
    if (laeuft || !auswahl) return;
    zuruecksetzen();
    setLaeuft(true);
    trackEvent("demo_start");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/agent/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beleg_id: auswahl }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        setFehler(res.status === 429 ? "Gerade viele Anfragen. Bitte kurz warten." : "Demo momentan nicht verfügbar.");
        setLaeuft(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let puffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        puffer += decoder.decode(value, { stream: true });
        const bloecke = puffer.split("\n\n");
        puffer = bloecke.pop() ?? "";
        for (const block of bloecke) {
          if (!block.startsWith("data: ")) continue;
          const ev = JSON.parse(block.slice(6));
          if (ev.typ === "schritt") setSchritte((alt) => [...alt, ev as Schritt]);
          else if (ev.typ === "ergebnis") setErgebnis(ev as Ergebnis);
        }
      }
      trackEvent("demo_complete");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setFehler("Verbindung unterbrochen.");
    } finally {
      if (!controller.signal.aborted) setLaeuft(false);
    }
  }

  const aktivePhase = schritte.at(-1)?.phase;
  const erreicht = new Set(schritte.map((s) => s.phase));
  const blockiert = schritte.some((s) => s.status === "blockiert");
  const statusMeldung = ergebnis
    ? "Vorschlag liegt vor. Eine menschliche Entscheidung ist erforderlich."
    : schritte.length
      ? `${KNOTEN_LABEL[schritte.at(-1)!.knoten] ?? ""}: ${schritte.at(-1)!.kurztext}`
      : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <p className="sr-only" role="status">{statusMeldung}</p>

      {/* Links: Belegauswahl + REA-Phasen */}
      <div className="space-y-4">
        <fieldset className="p-5" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)" }}>
          <legend className="label-mono px-1">Beispielbeleg wählen · fiktive Daten</legend>
          <div className="mt-2 space-y-2">
            {(belege ?? []).map((b) => (
              <label key={b.id} className="flex cursor-pointer items-start gap-3 p-3" style={{ border: `1px solid ${auswahl === b.id ? "var(--blue-line)" : "var(--bd)"}`, backgroundColor: auswahl === b.id ? "var(--blue-glow)" : "var(--bg-3)" }}>
                <input type="radio" name="beleg" value={b.id} checked={auswahl === b.id} disabled={laeuft} onChange={() => { setAuswahl(b.id); zuruecksetzen(); }} className="mt-1" />
                <span>
                  <span className="block" style={{ fontFamily: "var(--f-mono)", fontSize: "0.8125rem", color: "var(--tx-0)" }}>{b.lieferant}</span>
                  <span className="block" style={{ fontSize: "0.8125rem", color: "var(--tx-2)" }}>{b.titel}</span>
                </span>
              </label>
            ))}
            {!belege && <p className="label-mono">Lade Beispielbelege …</p>}
          </div>
        </fieldset>

        {schritte.length === 0 || (!laeuft && !ergebnis && !blockiert) ? (
          <button onClick={starten} disabled={!auswahl || laeuft} className="btn-violet flex w-full items-center justify-center gap-2 py-3">
            <Play className="h-4 w-4" aria-hidden="true" /> Prüfung durchspielen
          </button>
        ) : laeuft ? (
          <div className="flex w-full items-center justify-center gap-2 py-3 text-xs" style={{ fontFamily: "var(--f-mono)", color: "var(--blue)", border: "1px solid var(--blue-line)", backgroundColor: "var(--blue-glow)" }}>
            <span className="spin" aria-hidden="true" style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--blue)", borderTopColor: "transparent" }} />
            Agenten arbeiten …
          </div>
        ) : (
          <button onClick={zuruecksetzen} className="btn-ghost flex w-full items-center justify-center gap-2 py-3">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Neu starten
          </button>
        )}
        {fehler && <p role="alert" className="label-mono" style={{ color: "var(--blue-mid)" }}>{fehler}</p>}

        <div className="p-5" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)" }}>
          <p className="label-mono mb-4">REA-Ablauf</p>
          <ol className="space-y-3">
            {PHASEN.map((p) => {
              const aktiv = laeuft && aktivePhase === p.id;
              const fertig = erreicht.has(p.id) && !aktiv;
              return (
                <li key={p.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center" style={{ border: `1px solid ${fertig ? "var(--ok-line)" : aktiv ? "var(--blue-line)" : "var(--bd-hi)"}`, backgroundColor: fertig ? "var(--ok-glow)" : aktiv ? "var(--blue-glow)" : "var(--bg-3)" }}>
                    {fertig ? <CheckCircle className="h-3.5 w-3.5" style={{ color: "var(--ok)" }} aria-hidden="true" /> : aktiv ? <span className="spin" aria-hidden="true" style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid var(--blue)", borderTopColor: "transparent" }} /> : null}
                  </span>
                  <span>
                    <span className="block" style={{ fontFamily: "var(--f-mono)", fontSize: "0.75rem", letterSpacing: "0.16em", color: aktiv || fertig ? "var(--tx-0)" : "var(--tx-2)" }}>{p.label}</span>
                    <span className="block" style={{ fontSize: "0.8125rem", color: "var(--tx-2)" }}>{p.detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Rechts: Live-Trace + Ergebnis */}
      <div className="space-y-4">
        <div className="p-5" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)" }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="label-mono">Live-Trace</p>
            <span className="chip chip-cyan">Demonstration · kein Systemzugriff</span>
          </div>
          {schritte.length === 0 ? (
            <p style={{ fontSize: "0.8125rem", color: "var(--tx-2)" }}>Beleg wählen und starten. Jeder Schritt der Agenten erscheint hier.</p>
          ) : (
            <ol className="space-y-2" aria-label="Schritte der Agenten">
              <AnimatePresence initial={false}>
                {schritte.map((s, i) => (
                  <motion.li key={`${s.knoten}-${i}`} initial={reduceMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3" style={{ fontFamily: "var(--f-mono)", fontSize: "0.75rem" }}>
                    <span className="shrink-0" style={{ width: "8.5rem", color: s.status === "blockiert" ? "var(--blue-mid)" : s.phase === "action" ? "var(--blue-mid)" : "var(--tx-1)" }}>
                      {KNOTEN_LABEL[s.knoten] ?? s.knoten}
                    </span>
                    <span style={{ color: "var(--tx-2)", lineHeight: 1.45 }}>{s.kurztext}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          )}
        </div>

        <AnimatePresence>
          {ergebnis && (
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)", borderLeft: "3px solid var(--blue)" }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--bd)" }}>
                <span className="label-mono">Vorschlag · {ergebnis.empfehlung}</span>
                <ShieldCheck className="h-4 w-4" style={{ color: "var(--blue)" }} aria-hidden="true" />
              </div>
              <div className="space-y-4 p-5">
                <dl className="space-y-1.5">
                  {ergebnis.beleg.map((z) => (
                    <div key={z.label} className="flex justify-between gap-4">
                      <dt className="label-mono">{z.label}</dt>
                      <dd style={{ fontFamily: "var(--f-mono)", fontSize: "0.8125rem", color: "var(--tx-0)", textAlign: "right" }}>{z.wert}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="space-y-1.5">
                  {ergebnis.befunde.map((b, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ fontSize: "0.8125rem", color: b.schwere === "hinweis" ? "var(--tx-0)" : "var(--tx-2)" }}>
                      {b.schwere === "hinweis"
                        ? <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--blue-mid)" }} aria-label="Hinweis" />
                        : <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--ok)" }} aria-label="In Ordnung" />}
                      {b.text}
                    </li>
                  ))}
                </ul>

                <div>
                  <p className="label-mono mb-2">Buchungsentwurf (DATEV-Stapel, nur Vorschau)</p>
                  <div className="overflow-x-auto" style={{ border: "1px solid var(--bd)" }}>
                    <table className="w-full text-left" style={{ fontFamily: "var(--f-mono)", fontSize: "0.6875rem" }}>
                      <tbody>
                        {Object.entries(ergebnis.buchung).map(([k, v]) => (
                          <tr key={k} style={{ borderBottom: "1px solid var(--bd)" }}>
                            <th scope="row" className="px-3 py-1.5 font-normal" style={{ color: "var(--tx-2)" }}>{k}</th>
                            <td className="px-3 py-1.5" style={{ color: "var(--tx-0)" }}>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4" style={{ border: "1px solid var(--blue-line)", backgroundColor: "var(--blue-glow)" }}>
                  <p className="flex items-center gap-2" style={{ fontSize: "0.875rem", color: "var(--tx-0)" }}>
                    <UserCheck className="h-4 w-4" aria-hidden="true" /> {ergebnis.entscheidung}
                  </p>
                  {entscheidung ? (
                    <p role="status" className="mt-3" style={{ fontSize: "0.8125rem", color: "var(--tx-1)" }}>
                      {entscheidung === "frei" ? "Freigegeben" : "Zurückgewiesen"} – in der Demo wird nichts gebucht, gespeichert oder versendet.
                    </p>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setEntscheidung("frei")} className="btn-violet px-4 py-2 text-xs">Freigeben</button>
                      <button onClick={() => setEntscheidung("zurueck")} className="btn-ghost px-4 py-2 text-xs">Zurückweisen</button>
                    </div>
                  )}
                </div>

                <p className="label-mono">{ergebnis.hinweis}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
