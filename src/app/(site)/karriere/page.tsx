import type { Metadata } from "next";
import Link from "next/link";
import { Home, Cpu, Rocket, HandHeart, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Karriere — Synotix",
  alternates: { canonical: "/karriere" },
  description:
    "Synotix wird von Melih aufgebaut. Ein späterer Teamaufbau folgt bezahltem Kundenbedarf, wiederholbaren Prozessen und gesicherter Lieferfähigkeit.",
};

const PERKS = [
  { icon: Home, t: "Direkte Zusammenarbeit", d: "Kurze Wege und klare Zuständigkeiten prägen die gewünschte Arbeitsweise." },
  { icon: Cpu, t: "Technik mit Zweck", d: "Werkzeuge werden danach ausgewählt, was der konkrete Kundenprozess braucht." },
  { icon: Rocket, t: "Messbarer Nutzen", d: "Ausgangslage, Qualität und Abnahmekriterien machen Ergebnisse überprüfbar." },
  { icon: HandHeart, t: "Verantwortung", d: "Sorgfältige Umsetzung, menschliche Freigaben und klare Betriebsgrenzen gehören zusammen." },
];

const AREAS = [
  { t: "Prozess & Umsetzung", context: "Mögliches späteres Kompetenzfeld", chips: ["Dokumente", "Schnittstellen", "Prüflogik"] },
  { t: "Qualität & Betrieb", context: "Mögliches späteres Kompetenzfeld", chips: ["Qualitätsprüfung", "Monitoring", "Dokumentation"] },
  { t: "Kundenzusammenarbeit", context: "Mögliches späteres Kompetenzfeld", chips: ["Industrie", "Prozessanalyse", "Abnahme"] },
];

export default function Karriere() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Karriere</span>
          <h1 className="page-h1">
            Mit Verantwortung <span className="dim">wachsen.</span>
          </h1>
          <p className="page-lead">
            Synotix wird derzeit von Melih als Solo-Gründer aufgebaut. Ein Team soll dort entstehen,
            wo bezahlte Kundennachfrage, wiederholbare Prozesse und verlässliche Auslastung
            die Grundlage dafür schaffen.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/kontakt">
              Kontakt aufnehmen <span className="ar">→</span>
            </Link>
            <Link className="btn btn-line btn-pill" href="/ueber-uns">Über Synotix</Link>
          </div>
        </div>
      </section>

      <section className="s-light">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Warum Synotix</span>
            <h2>Woran wir <span className="dim">arbeiten wollen.</span></h2>
          </div>
          <div className="cgrid">
            {PERKS.map(({ icon: Icon, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-dark">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 24 }}>
            <span className="eyebrow">Teamaufbau als Perspektive</span>
            <h2>Mögliche spätere <span className="dim">Kompetenzfelder.</span></h2>
          </div>
          <div>
            {AREAS.map((j) => (
              <Link key={j.t} className="job" href="/kontakt">
                <div>
                  <div className="jt">{j.t}</div>
                  <div className="jm">{j.context}</div>
                  <div className="jchips">
                    {j.chips.map((c) => <span key={c} className="jchip">{c}</span>)}
                  </div>
                </div>
                <span className="sn-arrow"><ArrowUpRight size={18} /></span>
              </Link>
            ))}
          </div>
          <p style={{ color: "var(--fg-soft)", fontSize: 15, marginTop: 28 }}>
            Diese Übersicht ist keine Stellenausschreibung. Konkrete Rollen und Rahmenbedingungen
            werden erst bei entsprechendem Bedarf festgelegt. Für einen fachlichen Austausch nutze den{" "}
            <Link href="/kontakt" style={{ color: "var(--glint)", fontWeight: 600 }}>Kontaktweg</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
