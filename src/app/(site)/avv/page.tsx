import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileCheck2, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "AVV / DSGVO — Synotix",
  alternates: { canonical: "/avv" },
  description: "Datenwege, Verantwortlichkeiten und erforderliche Vereinbarungen werden bei Synotix für den konkreten Kundenprozess geklärt.",
  robots: { index: true, follow: true },
};

const box: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: "var(--fg-soft)", maxWidth: "70ch" };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: "40px 0 12px", letterSpacing: "-.01em" };

const POINTS = [
  { icon: ShieldCheck, t: "Rollen & Vereinbarungen", d: "Für den konkreten Prozess klären wir Verantwortlichkeiten und welche Vereinbarungen zur Datenverarbeitung erforderlich sind, einschließlich eines möglichen Auftragsverarbeitungsvertrags (AVV)." },
  { icon: Server, t: "Datenwege & Dienstleister", d: "Speicherung, Modellaufrufe und beteiligte Anbieter werden pro Konfiguration betrachtet. Ein Hosting-Standort allein ist keine Aussage über den gesamten Datenfluss." },
  { icon: FileCheck2, t: "Schutzmaßnahmen & Nachweise", d: "Benötigte Zugriffsrechte, Protokolle und technische sowie organisatorische Maßnahmen werden anhand des Prozessumfangs geprüft und festgelegt." },
];

export default function Avv() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 64 }}>
          <span className="eyebrow">Datenverarbeitung im Projekt</span>
          <h1 className="page-h1" style={{ maxWidth: "20ch" }}>Datenwege &amp; Verantwortung</h1>
          <p className="page-lead">
            Welche Daten verarbeitet werden, wer darauf zugreift und welche Dienste beteiligt
            sind, hängt vom vereinbarten Arbeitsprozess ab. Diese Punkte werden vor einem
            Kundeneinsatz anhand der konkreten Konfiguration geklärt.
          </p>
        </div>
      </section>

      <section className="s-dark-2">
        <div className="wrap">
          <div className="cgrid cols-3">
            {POINTS.map(({ icon: Icon, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, ...box }}>
            <h2 style={h2}>Anforderungen gemeinsam klären</h2>
            <p>
              Bringen Sie Ihre Anforderungen an Datenzugriff, Verarbeitung und Dokumentation
              in das Prozessgespräch ein. Gemeinsam klären wir, welche Unterlagen und
              Prüfungen für den vereinbarten Einsatz benötigt werden.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <span className="ar">→</span></Link>
              <Link className="btn btn-line btn-pill" href="/datenschutz">Zur Datenschutzerklärung</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
