import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Synotix",
  alternates: { canonical: "/impressum" },
  description: "Impressum und Anbieterkennzeichnung der Synotix KI-Agentur.",
  robots: { index: true, follow: true },
};

const box: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: "var(--fg-soft)", maxWidth: "70ch" };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: "36px 0 12px", letterSpacing: "-.01em" };
const ph = (t: string) => <span style={{ color: "var(--glint)" }}>[{t}]</span>;

export default function Impressum() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 80 }}>
          <span className="eyebrow">Rechtliches</span>
          <h1 className="page-h1" style={{ maxWidth: "16ch" }}>Impressum</h1>

          <div style={{ marginTop: 40, ...box }}>
            <p style={{ fontSize: 13, color: "var(--fg-mute)", marginBottom: 28 }}>
              Hinweis: Die mit [Platzhalter] markierten Felder bitte mit den echten
              Unternehmensdaten ersetzen — sie sind gesetzlich vorgeschrieben (§ 5 DDG / § 18 MStV).
            </p>

            <h2 style={h2}>Angaben gemäß § 5 DDG</h2>
            <p>
              {ph("Synotix Rechtsform, z. B. Synotix GmbH")}<br />
              {ph("Straße und Hausnummer")}<br />
              {ph("PLZ Ort")}<br />
              Deutschland
            </p>

            <h2 style={h2}>Vertreten durch</h2>
            <p>{ph("Geschäftsführer: Melih Dönmez")}</p>

            <h2 style={h2}>Kontakt</h2>
            <p>
              Telefon: {ph("Telefonnummer")}<br />
              E-Mail: <a href="mailto:kontakt@synotix.de" style={{ color: "var(--glint)" }}>kontakt@synotix.de</a>
            </p>

            <h2 style={h2}>Registereintrag</h2>
            <p>
              Registergericht: {ph("Amtsgericht")}<br />
              Registernummer: {ph("HRB …")}
            </p>

            <h2 style={h2}>Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: {ph("DE…")}</p>

            <h2 style={h2}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>{ph("Name")}, {ph("Anschrift wie oben")}</p>

            <h2 style={h2}>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen.
            </p>

            <h2 style={h2}>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--glint)" }}>
                ec.europa.eu/consumers/odr
              </a>. Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
