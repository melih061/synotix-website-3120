"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { FileText, MessageSquare, Calculator, Shield, Server, Activity, Code2, ArrowRight } from "lucide-react";
import { ReaTrace } from "./rea-trace";
import { SupportBot } from "./support-bot";
import { MeasurementDemo } from "./measurement-demo";
import { DotSphere } from "./dot-sphere";

type Scenario = "invoice" | "chat" | "roi";

const SCENARIOS = [
  {
    id: "invoice" as Scenario,
    num: "01",
    icon: FileText,
    title: "Rechnungsanalyse",
    description: "Beispielrechnung auslesen, Prüfdaten vorbereiten und die Freigabe beim Menschen lassen.",
    metric: "Beispielablauf",
    metricColor: "teal",
  },
  {
    id: "chat" as Scenario,
    num: "02",
    icon: MessageSquare,
    title: "Wissens-Assistent",
    description: "Technisches Chat-Beispiel mit fiktivem Unternehmenswissen. Ein Baustein bei konkretem Bedarf.",
    metric: "Technisches Beispiel",
    metricColor: "violet",
  },
  {
    id: "roi" as Scenario,
    num: "03",
    icon: Calculator,
    title: "Nutzen gemeinsam messen",
    description: "Ausgangslage und Pilot vergleichen – einschließlich Prüfung und Nacharbeit.",
    metric: "Ihre Messwerte",
    metricColor: "cyan",
  },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "Menschliche Freigabe", variant: "chip-cyan" },
  { icon: Server, label: "Ein klarer Prozess", variant: "chip" },
  { icon: Activity, label: "Nutzen messen", variant: "chip-ok" },
  { icon: Code2, label: "Technische Beispiele", variant: "chip" },
];

export function DemoHub() {
  const [active, setActive] = useState<Scenario>("invoice");
  const reduceMotion = useReducedMotion();
  const demosRef = useRef<HTMLDivElement>(null);
  const scrollToDemos = () =>
    demosRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

  const ActiveComponent = {
    invoice: ReaTrace,
    chat: SupportBot,
    roi: MeasurementDemo,
  }[active];

  const activeScenario = SCENARIOS.find(s => s.id === active)!;

  return (
    <MotionConfig reducedMotion="user">
    <div style={{ backgroundColor: "var(--bg-0)", minHeight: "calc(100vh - 57px)" }}>

      {/* Trust bar */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 px-6 py-3"
        style={{ backgroundColor: "var(--bg-1)", borderBottom: "1px solid var(--bd)" }}
      >
        {TRUST_ITEMS.map(({ icon: Icon, label, variant }) => (
          <span key={label} className={`chip ${variant} gap-1.5`}>
            <Icon className="h-3 w-3" />
            {label}
          </span>
        ))}
      </div>

      {/* Hero — Celonis-Stil */}
      <section className="relative overflow-hidden" style={{ minHeight: "min(88vh, 760px)" }}>
        {/* Daten-Sphäre */}
        <DotSphere className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--bg-0), transparent)" }} />

        <div className="relative mx-auto max-w-6xl px-6 pt-24 sm:pt-28">
          <div className="max-w-3xl">
            <p className="label-mono" style={{ color: "var(--tx-1)", marginBottom: 18 }}>
              Beispiel für eine maßgeschneiderte Lösung · Musterdaten
            </p>
            {/* Zweifarbige Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h1-editorial"
            >
              <span style={{ color: "var(--tx-1)" }}>KI im Arbeitsablauf.</span>
              <br />
              Vorbereitung sehen. Kontrolle behalten.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <button onClick={scrollToDemos} className="sq-link">
                Demos entdecken
              </button>
            </motion.div>

            {/* Stat — mobile (Karte rechts ist nur ab md sichtbar) */}
            <div className="md:hidden mt-12 flex items-baseline gap-3">
              <span style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: "2.75rem", lineHeight: 1, letterSpacing: "-0.03em", color: "var(--blue)" }}>
                01
              </span>
              <span style={{ fontFamily: "var(--f-body)", fontSize: "0.9375rem", color: "var(--tx-1)" }}>
                klarer Prozess.<br />Messbarer Ausgangspunkt.
              </span>
            </div>
          </div>
        </div>

        {/* Schwebende Stat-Karte (Celonis-Akzent) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-6 bottom-10 hidden md:block w-64 p-6"
          style={{ backgroundColor: "var(--blue-dim)", color: "#FFFFFF", borderRadius: "var(--r-card)" }}
        >
          <div className="flex items-start gap-2">
            <span className="mt-1.5 flex shrink-0 gap-1" aria-hidden>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block h-2 w-2"
                  style={{ background: "#FFFFFF" }}
                  animate={{ opacity: reduceMotion ? 1 : [0, 0, 1, 1, 0] }}
                  transition={{
                    duration: 3.5,
                    times: [0, 0.06 + i * 0.12, 0.12 + i * 0.12, 0.9, 1],
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>
            <p style={{ fontFamily: "var(--f-body)", fontSize: "0.875rem", lineHeight: 1.4, color: "rgba(255,255,255,0.92)" }}>
              Erst verstehen, dann kontrolliert umsetzen und den Nutzen messen.
            </p>
          </div>
          <p style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: "3.25rem", lineHeight: 1, letterSpacing: "-0.03em", marginTop: "1.5rem" }}>
            Mit Ihnen.
          </p>
        </motion.div>
      </section>

      <div ref={demosRef} className="mx-auto max-w-6xl px-6 pt-20 pb-20 scroll-mt-16">
        {/* Scenario selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {SCENARIOS.map((scenario, i) => {
            const isActive = active === scenario.id;
            const Icon = scenario.icon;
            return (
              <motion.button
                key={scenario.id}
                onClick={() => setActive(scenario.id)}
                aria-pressed={isActive}
                aria-label={`${scenario.title} – ${scenario.metric}`}
                className="relative text-left p-6 transition-colors"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                style={{
                  backgroundColor: isActive ? "var(--bg-2)" : "var(--bg-1)",
                  border: `1px solid ${isActive ? "var(--bd-hi)" : "var(--bd)"}`,
                  cursor: "pointer",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Aktiv-Indikator — weiße, gleitende Linie */}
                {isActive && (
                  <motion.div
                    layoutId="active-bar"
                    className="absolute top-0 left-0 right-0"
                    style={{ height: "2px", backgroundColor: "#FFFFFF" }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.10)" : "var(--bg-3)",
                      border: `1px solid ${isActive ? "rgba(255,255,255,0.24)" : "var(--bd)"}`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: isActive ? "#FFFFFF" : "var(--tx-2)" }} />
                  </div>
                  <div>
                    <span className="label-mono" style={{ color: isActive ? "var(--tx-0)" : "var(--tx-2)" }}>
                      {scenario.num}
                    </span>
                    <p
                      className="mt-0.5"
                      style={{
                        fontFamily: "var(--f-display)", fontWeight: 600, fontSize: "1rem",
                        color: isActive ? "var(--tx-0)" : "var(--tx-1)",
                      }}
                    >
                      {scenario.title}
                    </p>
                  </div>
                </div>

                <p
                  className="text-sm mb-3 leading-relaxed"
                  style={{ color: "var(--tx-2)", fontFamily: "var(--f-body)" }}
                >
                  {scenario.description}
                </p>

                <span className={`chip chip-${scenario.metricColor}`}>
                  {scenario.metric}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active demo panel */}
        <div
          className="mb-4 flex flex-wrap items-center gap-3 px-1"
          style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "1rem" }}
        >
          <span
            style={{
              fontFamily: "var(--f-display)", fontWeight: 600, fontSize: "1.125rem",
              color: "var(--tx-0)",
            }}
          >
            {activeScenario.title}
          </span>
          <span className={`chip chip-${activeScenario.metricColor}`}>{activeScenario.metric}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Abschluss-CTA — dunkel & zentriert, konsistent mit den übrigen Seiten */}
      <section style={{ borderTop: "1px solid var(--bd)" }}>
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 mb-5" style={{ fontFamily: "var(--f-mono)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--tx-2)" }}>
              <span className="inline-block" style={{ width: 6, height: 6, borderRadius: 1, background: "var(--blue)" }} />
              Loslegen
            </span>
            <h2 style={{ fontFamily: "var(--f-display)", fontWeight: 800, fontSize: "clamp(2rem,4.4vw,3.25rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--tx-0)", maxWidth: "20ch", margin: "0 auto" }}>
              Welcher Prozess kostet Sie Zeit?
            </h2>
            <p className="mt-5 text-lg" style={{ fontFamily: "var(--f-body)", color: "var(--tx-1)", maxWidth: "44ch", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Jede Lösung entsteht nach einer bezahlten Prozessanalyse, genau für Ihren Ablauf. Umfang, Freigaben und Abnahmekriterien vereinbaren wir vor der Umsetzung.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/kontakt"
                className="btn-violet inline-flex items-center gap-1.5 px-7 py-3.5"
              >
                Erstgespräch vereinbaren <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dienstleistungen"
                className="inline-flex items-center gap-1.5 text-base font-semibold transition-opacity hover:opacity-70"
                style={{ color: "var(--blue)", fontFamily: "var(--f-body)" }}
              >
                Vorgehen kennenlernen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
    </MotionConfig>
  );
}
