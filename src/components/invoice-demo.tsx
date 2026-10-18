"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle, FileCheck2, FileText, Play, RotateCcw, ScanSearch, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics-events";

type StepStatus = "idle" | "running" | "done";

const STEPS = [
  { num: "01", icon: FileText, label: "EINLESEN", detail: "Rechnungsdaten aus dem Musterdokument erfassen", ms: 650 },
  { num: "02", icon: ScanSearch, label: "PRÜFHINWEISE", detail: "Pflichtfelder, Abweichungen und mögliche Duplikate markieren", ms: 850 },
  { num: "03", icon: FileCheck2, label: "EXPORTENTWURF", detail: "DATEV-Daten zur Prüfung vorbereiten", ms: 600 },
  { num: "04", icon: ShieldCheck, label: "FREIGABEPUNKT ERREICHT", detail: "Ein Mensch prüft vor Import, Buchung oder Zahlung", ms: 650 },
];

const RESULT_ROWS = [
  { label: "RECHNUNGSNUMMER", value: "RE-2026-09-0847" },
  { label: "LIEFERANT", value: "Schmidt GmbH & Co. KG" },
  { label: "RECHNUNGSDATUM", value: "15.09.2026" },
  { label: "BRUTTOBETRAG", value: "5.097,96 €" },
  { label: "PRÜFHINWEIS", value: "IBAN geändert", warning: true },
  { label: "DUPLIKATPRÜFUNG", value: "keine Übereinstimmung" },
  { label: "STATUS", value: "Freigabe erforderlich", warning: true },
];

export function InvoiceDemo() {
  const [stepStatus, setStepStatus] = useState<StepStatus[]>(STEPS.map(() => "idle"));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const mountedRef = useRef(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  async function runAnalysis() {
    if (running) return;
    setRunning(true);
    setDone(false);
    setStepStatus(STEPS.map(() => "idle"));
    trackEvent("demo_start");

    for (let i = 0; i < STEPS.length; i += 1) {
      if (!mountedRef.current) return;
      setStepStatus((current) => current.map((status, index) => index === i ? "running" : status));
      await new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : STEPS[i].ms));
      if (!mountedRef.current) return;
      setStepStatus((current) => current.map((status, index) => index === i ? "done" : status));
    }

    if (!mountedRef.current) return;
    setDone(true);
    setRunning(false);
    trackEvent("demo_complete");
  }

  function reset() {
    setStepStatus(STEPS.map(() => "idle"));
    setDone(false);
    setRunning(false);
  }

  const runningStep = stepStatus.findIndex((status) => status === "running");
  const statusMessage = done
    ? "Prüfvorschau abgeschlossen. Menschliche Freigabe ist erforderlich."
    : runningStep >= 0
      ? `Prüfschritt ${runningStep + 1} von ${STEPS.length}: ${STEPS[runningStep].label}.`
      : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <p className="sr-only" role="status">{statusMessage}</p>
      <div className="space-y-4">
        <div className="p-5" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)" }}>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center" style={{ backgroundColor: "var(--blue-glow)", border: "1px solid var(--blue-line)" }}>
              <FileText className="h-6 w-6" style={{ color: "var(--blue)" }} aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold" style={{ fontFamily: "var(--f-mono)", color: "var(--tx-0)", fontSize: "0.875rem" }}>
                Musterrechnung_Schmidt.pdf
              </p>
              <p className="label-mono mt-1">Fiktive Beispieldaten · keine echte Kundenrechnung</p>
            </div>
          </div>
          <div className="p-4 space-y-2 text-xs" style={{ backgroundColor: "var(--bg-3)", border: "1px solid var(--bd)", fontFamily: "var(--f-mono)", color: "var(--tx-2)" }}>
            <div className="flex justify-between gap-4"><span>Schmidt GmbH &amp; Co. KG</span><span>RECHNUNG</span></div>
            <div className="flex justify-between gap-4"><span>Industriestr. 42, Stuttgart</span><span>RE-2026-09-0847</span></div>
            <div className="my-2 h-px" style={{ backgroundColor: "var(--bd)" }} />
            <div className="flex justify-between gap-4"><span>Werkzeuglieferung</span><span>4.284,00 €</span></div>
            <div className="flex justify-between gap-4"><span>USt. 19 %</span><span>813,96 €</span></div>
            <div className="my-2 h-px" style={{ backgroundColor: "var(--bd)" }} />
            <div className="flex justify-between gap-4"><span>Gesamt</span><span style={{ color: "var(--tx-1)" }}>5.097,96 €</span></div>
          </div>
        </div>

        {!running && !done ? (
          <button onClick={runAnalysis} className="btn-violet flex w-full items-center justify-center gap-2 py-3">
            <Play className="h-4 w-4" aria-hidden="true" /> Prüfvorschau starten
          </button>
        ) : done ? (
          <button onClick={reset} className="btn-ghost flex w-full items-center justify-center gap-2 py-3">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Vorschau zurücksetzen
          </button>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 py-3 text-xs" style={{ fontFamily: "var(--f-mono)", color: "var(--blue)", border: "1px solid var(--blue-line)", backgroundColor: "var(--blue-glow)" }}>
            <span className="spin" aria-hidden="true" style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--blue)", borderTopColor: "transparent" }} />
            Prüfschritte werden simuliert …
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-5" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)" }}>
          <p className="label-mono mb-5">Vorgesehener Ablauf</p>
          <div>
            {STEPS.map((step, index) => {
              const status = stepStatus[index];
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex gap-4 items-start pb-5 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ border: `1px solid ${status === "done" ? "var(--ok-line)" : status === "running" ? "var(--blue-line)" : "var(--bd-hi)"}`, backgroundColor: status === "done" ? "var(--ok-glow)" : status === "running" ? "var(--blue-glow)" : "var(--bg-3)" }}>
                    {status === "done" ? <CheckCircle className="h-5 w-5" style={{ color: "var(--ok)" }} aria-hidden="true" /> : status === "running" ? <span className="spin" aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--blue)", borderTopColor: "transparent" }} /> : <Icon className="h-5 w-5" style={{ color: "var(--tx-2)" }} aria-hidden="true" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="label-mono" style={{ color: status === "done" ? "var(--ok)" : status === "running" ? "var(--blue-mid)" : "var(--tx-2)" }}>{step.num}</span>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.8125rem", fontWeight: 600, color: status === "running" ? "var(--tx-0)" : "var(--tx-1)" }}>{step.label}</span>
                    </div>
                    <p className="mt-1" style={{ fontSize: "0.8125rem", color: "var(--tx-2)", lineHeight: 1.45 }}>{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)", borderLeft: "3px solid var(--blue)" }}>
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--bd)" }}>
                <span className="label-mono">Prüfergebnis · Musterdaten</span>
                <span className="chip chip-cyan">Vorschau</span>
              </div>
              <div className="p-5 space-y-3">
                {RESULT_ROWS.map((row, index) => (
                  <motion.div key={row.label} initial={reduceMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.05 }} className="flex justify-between gap-4">
                    <span className="label-mono shrink-0">{row.label}</span>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.8125rem", color: row.warning ? "var(--blue-mid)" : "var(--tx-0)", textAlign: "right" }}>{row.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
