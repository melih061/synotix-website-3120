import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PRODUKTE, STATUS_META } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Beispiellösungen — Synotix",
  description:
    "Beispiellösungen von Synotix: DataSynth für die betreute Rechnungsprüfung, Wissenssuche und prozessbezogene Umsetzung. Was entsteht, ergibt sich aus der Prozessanalyse.",
  alternates: { canonical: "/produkte" },
};

const PRINZIP = [
  { t: "Klar begrenzt", d: "Ein Arbeitsprozess, ein Festpreisauftrag und ein vereinbartes Ergebnis." },
  { t: "Kontrolliert", d: "Wichtige Entscheidungen bleiben bei Menschen. Datenwege und Zugriffe werden für den konkreten Einsatz geprüft." },
  { t: "Messbar", d: "Ausgangslage und Abnahmekriterien werden vor der Umsetzung gemeinsam festgelegt." },
];

export default function ProdukteHub() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Beispiellösungen</span>
          <h1 className="page-h1">
            Beispiellösungen, <span className="dim">kein Pflichtprodukt.</span>
          </h1>
          <p className="page-lead">
            Hier zeigen wir Lösungen, die nach einer Prozessanalyse entstehen können. Sie müssen keine
            davon nehmen: Was wir für Ihren Betrieb umsetzen, ergibt sich aus der Analyse. DataSynth
            ist technisch vorbereitet; weitere Bausteine folgen belegtem Kundenbedarf.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <span className="ar">→</span></Link>
            <Link className="btn btn-line btn-pill" href="/dienstleistungen">So arbeiten wir</Link>
          </div>
        </div>
      </section>

      <section className="s-light">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Beispiele &amp; Perspektiven</span>
            <h2>Was nach einer Analyse <span className="dim">entstehen kann.</span></h2>
          </div>
          <div className="cgrid cols-2">
            {PRODUKTE.map(({ slug, icon: Icon, title, titleDim, card, status }) => (
              <Link key={slug} href={`/produkte/${slug}`} className={`hub-card${slug === "datensynth" ? " hub-card-featured" : ""}`}>
                <span className="uc-ico"><Icon size={18} /></span>
                {status && (
                  <span className={`status-badge is-${status}`} style={{ display: "flex", marginBottom: 12 }}>
                    {STATUS_META[status].label}
                  </span>
                )}
                {slug === "datensynth" && <span className="eyebrow">Beispiellösung · DataSynth</span>}
                <h3>{title.replace(/,$/, "")} {titleDim}</h3>
                <p>{card}</p>
                <span className="hub-arrow">Beispiel ansehen <ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="s-dark">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Das Prinzip</span>
            <h2>Ein Auftrag mit <span className="dim">klaren Grenzen.</span></h2>
          </div>
          <div className="cgrid cols-3">
            {PRINZIP.map(({ t, d }) => (
              <div key={t} className="uc-cell">
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-soft">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "0 auto", maxWidth: "22ch", lineHeight: 1.05 }}>
            Welcher Ablauf soll leichter werden?
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="btn btn-line btn-pill" href="/demo">Beispielablauf ansehen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
