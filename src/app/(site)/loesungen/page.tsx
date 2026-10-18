import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3, AlertTriangle, FileSearch, Database, BookOpen, Mail, Workflow, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Lösungen: maßgeschneiderte KI für den Mittelstand — Synotix",
  description:
    "Beispiele maßgeschneiderter KI-Lösungen nach einer Prozessanalyse: DataSynth für die betreute Rechnungsprüfung, weitere Lösungen nach Bedarf. Freigabe durch Menschen.",
  alternates: { canonical: "/loesungen" },
};

const FUNKTION = [
  { n: "01", icon: BarChart3, t: "Rechnungseingang verstehen", d: "Volumen, Eingangskanal und heutige Bearbeitungszeit gemeinsam aufnehmen." },
  { n: "02", icon: AlertTriangle, t: "Prüfhilfen vorbereiten", d: "Ausgelesene Angaben, Auffälligkeiten und mögliche Duplikate zur fachlichen Prüfung bereitstellen." },
  { n: "03", icon: FileSearch, t: "Menschlich freigeben", d: "Die verantwortliche Person prüft Ergebnisse vor Import, Buchung oder Zahlung." },
  { n: "04", icon: Database, t: "Übergabe abstimmen", d: "DATEV-Vorbereitung und Testimport mit dem Steuerberater für den konkreten Betrieb klären." },
];

/* Weitere Beispiele: nur „möglich nach Analyse“, kein fertiges Produkt. */
const MOEGLICH = [
  { n: "02", icon: BookOpen, t: "Firmenwissen finden", d: "Fragen zu freigegebenen Dokumenten beantworten, mit nachvollziehbaren Fundstellen.", href: "/produkte/wissens-agent" },
  { n: "03", icon: Mail, t: "E-Mails vorbereiten", d: "Nachrichten einordnen und Antwortentwürfe zur menschlichen Freigabe vorbereiten.", href: "/agenten/email-analyse" },
  { n: "04", icon: Workflow, t: "Systeme verbinden", d: "Daten zwischen E-Mail, Excel und ERP dort übertragen, wo heute kopiert wird.", href: "/produkte/prozessautomatisierung" },
  { n: "05", icon: AlertTriangle, t: "Abweichungen erkennen", d: "Auffällige Werte in Prozessdaten markieren, beurteilt durch Ihr Fachteam.", href: "/agenten/anomalie-erkennung" },
];

const SCHRITTE = [
  { n: "01", t: "Bezahlte Prozessanalyse", d: "Ablauf, Daten, Systeme und Verantwortliche aufnehmen; Ausgangskennzahl und Empfehlung nach Bedarf." },
  { n: "02", t: "Abgegrenzte Umsetzung", d: "Ein Prozess, ein Festpreisauftrag, Abnahmekriterien und menschliche Freigaben." },
  { n: "03", t: "Begrenzte Begleitung", d: "Qualität, Fehler und Kosten nach Abnahme innerhalb klarer Pflege- und Änderungsgrenzen begleiten." },
];

export default function Loesungen() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Lösungen</span>
          <h1 className="page-h1">
            Maßgeschneiderte KI-Lösungen, <span className="dim">nach der Analyse.</span>
          </h1>
          <p className="page-lead">
            Was wir bauen, ergibt sich aus der Prozessanalyse, nicht aus einem Katalog. Die folgenden
            Beispiele zeigen, was entstehen kann. DataSynth ist technisch vorbereitet; alle weiteren
            Lösungen sind möglich, wenn die Analyse den Bedarf belegt.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <span className="ar">→</span></Link>
            <Link className="btn btn-line btn-pill" href="/dienstleistungen">So arbeiten wir</Link>
          </div>
        </div>
      </section>

      <section id="funktion" className="s-light" style={{ scrollMarginTop: 90 }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Beispiel 01 · technisch vorbereitet</span>
            <h2>Betreute Rechnungsprüfung <span className="dim">mit DataSynth.</span></h2>
          </div>
          <div className="cgrid">
            {FUNKTION.map(({ n, icon: Icon, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
                <span className="n">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/produkte/datensynth">Beispiellösung DataSynth ansehen <span className="ar">→</span></Link>
            <Link className="btn btn-line btn-pill" href="/demo">Demo mit Beispieldaten</Link>
          </div>
        </div>
      </section>

      <section id="moeglich" className="s-dark" style={{ scrollMarginTop: 90 }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Weitere Beispiele · möglich nach Analyse</span>
            <h2>Was außerdem entstehen kann, <span className="dim">wenn der Bedarf belegt ist.</span></h2>
          </div>
          <div className="cgrid">
            {MOEGLICH.map(({ n, icon: Icon, t, d, href }) => (
              <Link key={t} href={href} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
                <span className="n">{n} · möglich nach Analyse</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="s-dark-2">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">So funktioniert es</span>
            <h2>Von der Analyse zur <span className="dim">begrenzten Begleitung.</span></h2>
          </div>
          <div className="cgrid cols-3">
            {SCHRITTE.map(({ n, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="n">{n} — Schritt</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-light">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "0 auto", maxWidth: "22ch", lineHeight: 1.05 }}>
            Welcher Ablauf kostet Sie am meisten Zeit?
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="btn btn-line btn-pill" href="/branchen">Branchen ansehen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
