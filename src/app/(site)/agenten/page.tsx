import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AGENTEN } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Technische Beispiele für KI-Bausteine — Synotix",
  description:
    "Technische Beispiele für mögliche KI-Bausteine. Ob ein Baustein sinnvoll ist, klärt bei Synotix immer zuerst eine bezahlte Prozessanalyse.",
  alternates: { canonical: "/agenten" },
};

const PRINZIP = [
  { t: "Bedarfsabhängig", d: "Weitere Bausteine entstehen aus einem konkreten, bezahlten Prozessauftrag." },
  { t: "Geprüft", d: "Daten, Schnittstellen und fachliche Testfälle bestimmen, ob ein Einsatz sinnvoll ist." },
  { t: "Kontrolliert", d: "Vorschläge werden geprüft. Entscheidungen mit wesentlichen Folgen bleiben bei Menschen." },
];

export default function AgentenHub() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Agenten</span>
          <h1 className="page-h1">
            Technische Bausteine <span className="dim">verständlich erklärt.</span>
          </h1>
          <p className="page-lead">
            Diese Beispiele zeigen mögliche Einsatzweisen von KI. Sie sind kein Katalog sofort
            verfügbarer Produkte. Am Anfang steht immer eine Prozessanalyse; Bausteine werden nur
            bei konkretem, bezahltem Bedarf entwickelt.
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
            <span className="eyebrow">Technische Beispiele</span>
            <h2>Mögliche Funktionen, <span className="dim">konkrete Voraussetzungen.</span></h2>
          </div>
          <div className="cgrid cols-2">
            {AGENTEN.map(({ slug, icon: Icon, title, titleDim, card }) => (
              <Link key={slug} href={`/agenten/${slug}`} className="hub-card">
                <span className="uc-ico"><Icon size={18} /></span>
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
            <h2>Der Bedarf bestimmt <span className="dim">die Umsetzung.</span></h2>
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
            Mit welchem Dokumentenprozess beginnen wir?
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <ArrowRight size={16} /></Link>
            <Link className="btn btn-line btn-pill" href="/dienstleistungen/ki-agenten">Unser Vorgehen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
