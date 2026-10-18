import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { DIENSTLEISTUNGEN } from "@/lib/catalog";
import { DATENSCHUTZ_AUSSAGE, LEISTUNGEN, LEISTUNGEN_HINWEIS, SCHRITTE } from "@/lib/angebot";

export const metadata: Metadata = {
  title: "Leistungen: KI-Beratung, Prozessanalyse, KI-Schulung — Synotix",
  description:
    "Vier Leistungen für den Mittelstand: Analyse & Strategie, maßgeschneiderte KI-Lösungen, Schulung & Enablement und Begleitung. Jede ein eigener Festpreisauftrag.",
  alternates: { canonical: "/dienstleistungen" },
};

const GRENZEN = [
  "Jede Leistung ist ein eigener Festpreisauftrag mit Abnahmekriterien, nie im Bündel.",
  "Am Anfang steht immer die bezahlte Analyse. Preise für Umsetzungen nennen wir danach.",
  "Zahlung, Buchung, Import oder Verträge gibt immer ein Mensch frei.",
  "Begleitung in vereinbarten Grenzen, ohne 24/7-Zusage und ohne unbegrenzte Änderungen.",
  "Keine Ersparniszusagen ohne gemessene Ausgangslage und keine Fördermittelzusagen.",
  DATENSCHUTZ_AUSSAGE,
];

export default function DienstleistungenHub() {
  const technik = DIENSTLEISTUNGEN.find((d) => d.slug === "infrastruktur");

  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Leistungen</span>
          <h1 className="page-h1">
            KI-Beratung und Umsetzung, <span className="dim">Schritt für Schritt.</span>
          </h1>
          <p className="page-lead">
            Wir analysieren zuerst einen Ablauf in Ihrem Betrieb. Danach empfehlen wir, was sich wirklich lohnt:
            eine maßgeschneiderte KI-Lösung, eine Schulung, einen Digitalisierungsschritt oder auch nichts.
            Sie entscheiden nach jeder Stufe, ob es weitergeht.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <span className="ar">→</span></Link>
            <Link className="btn btn-line btn-pill" href="#ablauf">Zum Ablauf</Link>
          </div>
        </div>
      </section>

      <section className="s-light">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Vier Leistungsbereiche</span>
            <h2>Ein Weg in vier Stufen, <span className="dim">jede ein eigener Auftrag.</span></h2>
          </div>
          <div className="cgrid cols-2">
            {LEISTUNGEN.map(({ n, slug, icon: Icon, t, kurz, punkte }) => (
              <Link key={slug} href={`/dienstleistungen/${slug}`} className="hub-card">
                <span className="uc-ico"><Icon size={18} /></span>
                <span className="n">{n}</span>
                <h3>{t}</h3>
                <p>{kurz}</p>
                <ul className="check-list" style={{ margin: "4px 0 18px" }}>
                  {punkte.map((p) => <li key={p}><Check size={16} aria-hidden="true" /> {p}</li>)}
                </ul>
                <span className="hub-arrow">{t} im Detail <ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 32, maxWidth: "70ch", color: "var(--ink-fg-soft)" }}>{LEISTUNGEN_HINWEIS}</p>
        </div>
      </section>

      <section id="ablauf" className="s-dark" style={{ scrollMarginTop: 90 }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Ablauf</span>
            <h2>So beginnt die Zusammenarbeit.</h2>
          </div>
          <div className="cgrid cols-3">
            {SCHRITTE.map((s, i) => (
              <div key={s.t} className="uc-cell">
                <span className="n">{String(i + 1).padStart(2, "0")} — {s.tag}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-dark-2">
        <div className="wrap two-col">
          <div className="sec-head">
            <span className="eyebrow">Grenzen</span>
            <h2>Was Sie von uns erwarten können, <span className="dim">und was nicht.</span></h2>
            {technik && (
              <p>
                Technik wie Hosting, Modelle und Schnittstellen wählen wir passend zum Prozess aus. Sie ist Teil
                einer Umsetzung, kein eigenes Produkt. <Link href="/dienstleistungen/infrastruktur">Mehr zur technischen Grundlage</Link>.
              </p>
            )}
          </div>
          <ul className="check-list">
            {GRENZEN.map((g) => <li key={g}><Check size={16} aria-hidden="true" /> {g}</li>)}
          </ul>
        </div>
      </section>

      <section className="s-soft">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "0 auto", maxWidth: "22ch", lineHeight: 1.05 }}>
            Womit sollen wir anfangen?
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="btn btn-line btn-pill" href="/loesungen">Beispiellösungen ansehen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
