import type { Metadata } from "next";
import Link from "next/link";
import { FileSearch, UserCheck, Gauge } from "lucide-react";
import "./about.css";

export const metadata: Metadata = {
  title: "Über uns — Synotix",
  alternates: { canonical: "/ueber-uns" },
  description:
    "Lernen Sie Synotix und Gründer Melih Dönmez kennen: KI-Beratung und Umsetzung für den Mittelstand, mit Schwerpunkt Industrie. Erst die Analyse, dann was Ihr Betrieb braucht.",
};

const ARBEITSWEISE = [
  {
    icon: FileSearch,
    title: "Erst verstehen",
    description:
      "In einer bezahlten Prozessanalyse erfassen wir den heutigen Ablauf, die Daten und die Zuständigkeiten. Eine Ausgangskennzahl macht das Ziel überprüfbar.",
  },
  {
    icon: UserCheck,
    title: "Gezielt umsetzen",
    description:
      "Danach folgt, was die Analyse empfiehlt: eine maßgeschneiderte Lösung, eine Schulung oder ein Digitalisierungsschritt, jeweils als eigener Festpreisauftrag. Wichtige Entscheidungen bleiben bei Menschen.",
  },
  {
    icon: Gauge,
    title: "Verantwortlich begleiten",
    description:
      "Nach der Abnahme begleiten wir den Betrieb im vereinbarten Umfang: Qualität, Fehler und Kosten beobachten, Schnittstellen pflegen und Änderungen abstimmen.",
  },
];

export default function UeberUns() {
  return (
    <main className="about-page">
      <section className="s-dark page-top about-hero">
        <div className="wrap about-hero-grid">
          <div>
            <span className="eyebrow">Über Synotix</span>
            <h1 className="page-h1 about-title">
              KI-Beratung, die zuerst zuhört.
            </h1>
            <p className="page-lead">
              Synotix ist eine KI-Beratung für den Mittelstand. Wir analysieren
              zuerst Ihre Abläufe und liefern dann, was Ihr Betrieb wirklich
              braucht: KI-Lösung, Schulung oder Digitalisierungsschritt.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-pri btn-pill" href="/kontakt">
                Erstgespräch vereinbaren <span className="ar" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-line btn-pill" href="/dienstleistungen">
                Unsere Leistungen
              </Link>
            </div>
          </div>
          <aside className="about-identity" aria-label="Ihr Ansprechpartner">
            <span className="about-identity-label">Ihr direkter Ansprechpartner</span>
            <div className="about-monogram" aria-hidden="true">MD</div>
            <p className="about-founder-name">Melih Dönmez</p>
            <p className="about-founder-role">Gründer von Synotix</p>
            <div className="about-identity-footer">
              Vom ersten Gespräch bis zur Umsetzung.
            </div>
          </aside>
        </div>
      </section>

      <section className="s-light">
        <div className="wrap two-col about-founder">
          <div className="sec-head">
            <span className="eyebrow">Der Gründer</span>
            <h2>Ein direkter Ansprechpartner. Von der Analyse bis zur Umsetzung.</h2>
          </div>
          <div className="about-prose">
            <p>
              Ich bin Melih Dönmez, Gründer von Synotix und Student der
              Wirtschaftsinformatik. Ich entwickle KI-Anwendungen und verbinde
              sie mit bestehenden Arbeitsabläufen. Mit Synotix berate ich
              mittelständische Betriebe, in denen Dokumente, E-Mails und manuelle
              Übertragungen viel Aufmerksamkeit binden. Mein Schwerpunkt liegt auf
              Industrie und Zulieferern; andere Branchen sind willkommen.
            </p>
            <p>
              Am Anfang steht ein klar eingegrenzter Prozess. Gemeinsam halten
              wir fest, was heute aufwendig ist, welches Ergebnis gebraucht wird
              und wer die Verantwortung trägt. Meine Empfehlung ist ehrlich, auch
              wenn sie lautet: jetzt noch nichts bauen.
            </p>
          </div>
        </div>
      </section>

      <section className="s-dark">
        <div className="wrap">
          <div className="sec-head about-section-head">
            <span className="eyebrow">Unsere Arbeitsweise</span>
            <h2>Ein nachvollziehbarer Weg zu einem besseren Ablauf.</h2>
          </div>
          <div className="cgrid cols-3 about-principles">
            {ARBEITSWEISE.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="uc-cell">
                <div className="about-principle-top">
                  <span className="n">{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="s-light">
        <div className="wrap">
          <div className="sec-head about-section-head">
            <span className="eyebrow">Unser Entwicklungsweg</span>
            <h2>Ein Beispiel aus der Praxis. Und wohin es geht.</h2>
          </div>
          <div className="about-growth">
            <article className="about-growth-step">
              <span className="about-growth-label">Beispiellösung</span>
              <h3>Betreute Rechnungsprüfung.</h3>
              <p>
                DataSynth unterstützt das Auslesen und Prüfen von
                Lieferantenrechnungen sowie die Vorbereitung für DATEV.
                Vor Import, Buchung oder Zahlung entscheidet ein Mensch.
              </p>
              <p>
                Die technische Grundlage ist getestet. Die Freigabe für den
                Kundenbetrieb steht noch aus und setzt die Prüfung mit echten
                Kundenabläufen und einen DATEV-Testimport voraus.
              </p>
              <Link className="about-text-link" href="/produkte/datensynth">
                Beispiellösung DataSynth ansehen <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="about-growth-step">
              <span className="about-growth-label">Unsere Perspektive</span>
              <h3>Bewährte Prozesse verbinden.</h3>
              <p>
                Unser Ziel ist, erfolgreiche KI-Arbeitsprozesse schrittweise mit
                weiteren Daten und Systemen eines Betriebs zu verbinden
                und im vereinbarten Umfang zu betreiben.
              </p>
              <p>
                Dieser Ausbau setzt nachgewiesenen Kundennutzen, wiederholbare
                Umsetzung und ein kompetentes Team voraus. Der nächste Schritt
                entsteht aus konkretem Bedarf und verlässlicher Lieferfähigkeit.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="s-dark about-contact">
        <div className="wrap">
          <h2>Welcher Ablauf kostet Sie heute unnötig Zeit?</h2>
          <p>
            In einem unverbindlichen Erstgespräch klären wir, ob eine
            Prozessanalyse sinnvoll ist.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href="/kontakt">
              Erstgespräch vereinbaren <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
