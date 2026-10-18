import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BRANCHEN } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Branchen: KI-Beratung für Mittelstand und Industrie — Synotix",
  description:
    "KI-Beratung für den Mittelstand mit 10–75 Mitarbeitenden, mit Schwerpunkt Industrie: Produktion, Maschinenbau, Zulieferer, Logistik. Andere Branchen sind willkommen.",
  alternates: { canonical: "/branchen" },
};

export default function BranchenHub() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Branchen</span>
          <h1 className="page-h1">
            Für den Mittelstand, <span className="dim">mit Schwerpunkt Industrie.</span>
          </h1>
          <p className="page-lead">
            Wir beraten deutsche Betriebe mit etwa 10–75 Mitarbeitenden, wenig interner IT und
            wiederkehrenden Abläufen über E-Mail, Excel, Dokumente und ERP. Am besten kennen wir
            Industrie und Zulieferer: Produktion, Maschinenbau, Logistik und Qualitätssicherung.
            Betriebe aus Handel, Logistik oder Dienstleistung sind ebenso willkommen.
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
            <span className="eyebrow">Schwerpunkt Industrie</span>
            <h2>Wo wir uns <span className="dim">besonders gut auskennen.</span></h2>
          </div>
          <div className="cgrid cols-2">
            {BRANCHEN.map(({ slug, icon: Icon, title, titleDim, card }) => (
              <Link key={slug} href={`/branchen/${slug}`} className="hub-card">
                <span className="uc-ico"><Icon size={18} /></span>
                <h3>{title.replace(/,$/, "")} {titleDim}</h3>
                <p>{card}</p>
                <span className="hub-arrow">Branche ansehen <ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="s-dark">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "0 auto", maxWidth: "24ch", lineHeight: 1.05 }}>
            Ihre Branche ist nicht dabei?
          </h2>
          <p style={{ color: "var(--fg-soft)", fontSize: 18, maxWidth: "52ch", margin: "18px auto 0", lineHeight: 1.6 }}>
            Entscheidend ist nicht die Branche, sondern ein wiederkehrender Ablauf, zugängliche Daten
            und eine verantwortliche Person. Ob das passt, klären wir im Erstgespräch.
          </p>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="btn btn-line btn-pill" href="/dienstleistungen">Leistungen ansehen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
