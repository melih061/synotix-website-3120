import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Synotix",
  alternates: { canonical: "/datenschutz" },
  description: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO bei Synotix.",
  robots: { index: true, follow: true },
};

const box: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: "var(--fg-soft)", maxWidth: "72ch" };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: "40px 0 12px", letterSpacing: "-.01em" };
const ph = (t: string) => <span style={{ color: "var(--glint)" }}>[{t}]</span>;

export default function Datenschutz() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 80 }}>
          <span className="eyebrow">Rechtliches</span>
          <h1 className="page-h1" style={{ maxWidth: "18ch" }}>Datenschutzerklärung</h1>

          <div style={{ marginTop: 40, ...box }}>
            <p style={{ fontSize: 13, color: "var(--fg-mute)", marginBottom: 28 }}>
              Hinweis: Mustertext — bitte [Platzhalter] ergänzen und vor Veröffentlichung
              datenschutzrechtlich prüfen lassen.
            </p>

            <h2 style={h2}>1. Verantwortlicher</h2>
            <p>
              Verantwortlich im Sinne der DSGVO ist:<br />
              {ph("Synotix GmbH, Anschrift")} · E-Mail:{" "}
              <a href="mailto:kontakt@synotix.de" style={{ color: "var(--glint)" }}>kontakt@synotix.de</a>
            </p>

            <h2 style={h2}>2. Hosting</h2>
            <p>
              Diese Website wird auf Servern in Deutschland gehostet ({ph("Hetzner Online GmbH, Gunzenhausen")}).
              Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO). Beim Aufruf
              werden technisch notwendige Server-Logdaten (IP-Adresse, Datum/Uhrzeit, abgerufene Ressource,
              Referrer, User-Agent) verarbeitet. Rechtsgrundlage ist unser berechtigtes Interesse an einem
              sicheren, störungsfreien Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <h2 style={h2}>3. Kontaktformular &amp; E-Mail</h2>
            <p>
              Wenn Sie uns über das Formular oder per E-Mail kontaktieren, verarbeiten wir die angegebenen
              Daten (Name, E-Mail, optional Unternehmen, Nachricht) zur Bearbeitung Ihrer Anfrage
              (Art. 6 Abs. 1 lit. b und f DSGVO). Der Versand erfolgt über einen Dienstleister
              ({ph("Resend, mit AV-Vertrag")}). Die Daten werden gelöscht, sobald sie nicht mehr
              erforderlich sind, spätestens nach Ablauf gesetzlicher Aufbewahrungsfristen.
            </p>

            <h2 style={h2}>4. Interaktive Beispiel-Demo (KI-Assistent)</h2>
            <p>
              Auf der Demo-Seite können Sie optional einen KI-Assistenten testen. Ihre dort eingegebenen
              Nachrichten werden zur Generierung der Antwort an {ph("den eingesetzten LLM-Anbieter")}
              übermittelt. Geben Sie hier bitte keine personenbezogenen oder vertraulichen Daten ein.
              Rechtsgrundlage ist Ihre Einwilligung bzw. unser berechtigtes Interesse an der
              Produktdemonstration (Art. 6 Abs. 1 lit. a/f DSGVO).
            </p>

            <h2 style={h2}>5. Cookies &amp; Reichweitenmessung</h2>
            <p>
              Diese Website setzt keine Marketing- oder Tracking-Cookies. Sofern eine
              datenschutzfreundliche, cookielose Reichweitenmessung ({ph("z. B. Plausible/Umami")})
              aktiviert ist, werden dabei keine personenbezogenen Profile gebildet und keine Daten in
              Drittländer übertragen.
            </p>

            <h2 style={h2}>6. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
              Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch (Art. 21 DSGVO).
              Eine erteilte Einwilligung können Sie jederzeit widerrufen. Zudem besteht ein
              Beschwerderecht bei einer Aufsichtsbehörde ({ph("zuständige Landesdatenschutzbehörde")}).
            </p>

            <h2 style={h2}>7. Stand</h2>
            <p>Stand dieser Erklärung: {ph("Monat Jahr")}.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
