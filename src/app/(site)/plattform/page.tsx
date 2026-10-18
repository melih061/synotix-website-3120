import type { Metadata } from "next";
import Link from "next/link";
import {
  Database, Workflow, FileSearch, ShieldCheck, Send,
  Server, Boxes, Cpu, Lock, GitBranch, Scale, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plattform — Synotix",
  alternates: { canonical: "/plattform" },
  description:
    "Technischer Hintergrund von Synotix: Datenzugriff, Prüflogik, menschliche Freigaben und begrenzter Betrieb passend zum einzelnen Kundenprozess.",
};

const PIPELINE = [
  { icon: Database, n: "01", t: "Eingang", d: "Eine vereinbarte Datenquelle mit geprüftem Format und geregeltem Zugriff." },
  { icon: Workflow, n: "02", t: "Verarbeitung", d: "Auslesen und Aufbereiten innerhalb des vereinbarten Dokumentenprozesses." },
  { icon: FileSearch, n: "03", t: "Prüfhilfen", d: "Abweichungen und unsichere Ergebnisse für die fachliche Prüfung sichtbar machen." },
  { icon: ShieldCheck, n: "04", t: "Freigabe", d: "Die verantwortliche Person entscheidet vor wesentlichen Folgeschritten." },
  { icon: Send, n: "05", t: "Übergabe", d: "Eine zentrale Integration mit vereinbarten Kontrollen und Fehlerwegen." },
];

const STACK = [
  { icon: Server, t: "Hosting", d: "Betriebsumgebung und Anbieter werden passend zu Datenwegen, Anforderungen und Kosten ausgewählt." },
  { icon: Workflow, t: "Ablaufsteuerung", d: "n8n oder LangGraph können einzelne Schritte verbinden, wenn der Prozess es erfordert." },
  { icon: Database, t: "Datenhaltung", d: "PostgreSQL kann strukturierte Daten und vereinbarte Protokolle speichern." },
  { icon: Boxes, t: "Bereitstellung", d: "Docker kann die benötigten Komponenten in einer definierten Umgebung zusammenfassen." },
  { icon: Cpu, t: "Modelle", d: "Modellauswahl und Datenübertragung müssen je Kundenkonfiguration geprüft werden." },
  { icon: Lock, t: "Zugriffsschutz", d: "Berechtigungen und technische Schutzmaßnahmen werden für den vereinbarten Prozess festgelegt." },
];

const PRINZIP = [
  { icon: Scale, t: "Konfiguration prüfen", d: "Datenschutz und Sicherheit ergeben sich aus dem konkreten Datenfluss und den beteiligten Diensten." },
  { icon: GitBranch, t: "Aus Bedarf erweitern", d: "Gemeinsame Bausteine entstehen erst, wenn mehrere bezahlte Prozesse sie tatsächlich benötigen." },
  { icon: Lock, t: "Verantwortung festlegen", d: "Betriebsgrenzen, Pflege, Kosten und Zuständigkeiten gehören ausdrücklich in den Auftrag." },
];

export default function Plattform() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <span className="eyebrow">Technischer Hintergrund</span>
          <h1 className="page-h1">
            Technik, die <span className="dim">dem Prozess dient.</span>
          </h1>
          <p className="page-lead">
            Die gezeigten Bausteine erläutern unsere technische Arbeitsweise. Im ersten Auftrag
            zählt ein begrenzter Arbeitsprozess. Eine umfassende Kundenplattform ist ein späteres
            Zielbild, das bezahlte Nachfrage, Wiederholbarkeit und passende Betriebskapazität voraussetzt.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <span className="ar">→</span></Link>
            <Link className="btn btn-line btn-pill" href="/dienstleistungen/infrastruktur">Technische Grundlage</Link>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="s-light">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Beispielhafter Prozessaufbau</span>
            <h2>Vom Dokument <span className="dim">zur kontrollierten Übergabe.</span></h2>
            <p>Welche Schritte und Kontrollen gebraucht werden, legt die Prozessanalyse fest.</p>
          </div>
          <div className="flow">
            {PIPELINE.map(({ icon: Icon, n, t, d }, i) => (
              <div key={t} className="flow-step">
                <div className="uc-cell">
                  <span className="uc-ico"><Icon size={18} /></span>
                  <span className="n">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
                {i < PIPELINE.length - 1 && <span className="flow-arrow" aria-hidden><ArrowRight size={18} /></span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="s-dark">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Mögliche Liefermittel</span>
            <h2>Passende Bausteine, <span className="dim">bewusst ausgewählt.</span></h2>
          </div>
          <div className="cgrid cols-3">
            {STACK.map(({ icon: Icon, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prinzip */}
      <section className="s-dark-2">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Warum so gebaut</span>
            <h2>Klarer Umfang, <span className="dim">klare Verantwortung.</span></h2>
          </div>
          <div className="cgrid cols-3">
            {PRINZIP.map(({ icon: Icon, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
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
            Welchen Prozess möchten Sie zuerst verbessern?
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href="/kontakt">Erstgespräch vereinbaren <ArrowRight size={16} /></Link>
            <Link className="btn btn-line btn-pill" href="/dienstleistungen">Dienstleistungen</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
