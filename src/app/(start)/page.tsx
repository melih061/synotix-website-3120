import type { Metadata } from "next";
import Link from "next/link";
import { StBurst } from "@/components/start/st-burst";
import { StFluss } from "@/components/start/st-fluss";
import { StEinsatz } from "@/components/start/st-einsatz";
import { StKurve } from "@/components/start/st-kurve";
import { StLeistungen } from "@/components/start/st-leistungen";
import { StKontakt } from "@/components/start/st-kontakt";
import { StNaht } from "@/components/start/st-naht";
import { StRuheKnopf } from "@/components/start/st-ruhe";
import { KONTAKT_EMAIL } from "@/lib/angebot";

const TITEL = "Synotix — KI für Hersteller und Zulieferer";
const BESCHREIBUNG =
  "Synotix setzt KI in Industrieunternehmen um: bezahlte Prozessanalyse am Anfang, danach maßgeschneiderte Lösung, Schulung oder Begleitung. Festpreis je Auftrag, Freigabe durch Menschen.";

export const metadata: Metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "de_DE", url: "/", siteName: "Synotix", title: TITEL, description: BESCHREIBUNG },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG },
};

const FAQ = [
  { q: "Was macht Synotix?", a: "Synotix setzt KI in Industrieunternehmen um. Wir analysieren zuerst einen Ablauf in Ihrem Betrieb und empfehlen dann, was wirklich hilft: eine maßgeschneiderte Lösung, eine Schulung oder auch nichts." },
  { q: "Muss ich DataSynth einsetzen?", a: "Nein. DataSynth ist ein Beispiel für eine Lösung, die wir für die Rechnungsprüfung vorbereitet haben. Was wir für Sie umsetzen, ergibt sich aus der Analyse." },
  { q: "Was kostet die Zusammenarbeit?", a: "Das Erstgespräch ist unverbindlich. Die Analyse und jede spätere Umsetzung sind Festpreisaufträge mit klarem Umfang. Den Preis besprechen wir im Erstgespräch bzw. nach der Analyse." },
  { q: "Wer entscheidet am Ende?", a: "Wichtige Entscheidungen wie Zahlung, Buchung oder Verträge trifft immer ein Mensch. Die KI bereitet vor, sie gibt nichts frei." },
  { q: "Wie gehen Sie mit unseren Daten um?", a: "Datenschutz wird pro Kundenprozess geprüft und dokumentiert. Eingesetzte Dienstleister und Datenwege legen wir vor dem Start offen." },
];

const NACHWEISE = ["Platzhalter: Zertifikat 1", "Platzhalter: Zertifikat 2", "Platzhalter: Zertifikat 3", "Platzhalter: Zertifikat 4"];

export default function Startseite() {
  return (
    <>
      {/* Einstieg */}
      <section className="st-einstieg" aria-labelledby="st-h1">
        <div className="st-einstieg-text">
          <h1 id="st-h1">KI, die in Ihrer Fertigung mitarbeitet.</h1>
          <p>Wir setzen KI in Industrieunternehmen dort ein, wo heute von Hand geprüft und abgetippt wird. Die KI bereitet vor, Ihr Team entscheidet.</p>
          <div className="st-aktion">
            <a className="st-knopf st-knopf-weiss" href="#kontakt" data-analytics-event="primary_cta_click">Erstgespräch vereinbaren</a>
            <Link className="st-knopf" href="/demo">Demo ansehen</Link>
          </div>
          <p className="st-zusagen">
            <span><b>Bezahlte Prozessanalyse</b> am Anfang</span>
            <span><b>Festpreis</b> je Auftrag</span>
            <span><b>Freigabe</b> durch Menschen</span>
          </p>
          <StRuheKnopf />
        </div>
        <StBurst />
      </section>

      <StNaht von="#070B16" nach="#08080A" />

      {/* Datenfluss */}
      <section className="st-block" aria-labelledby="st-h-fluss">
        <div className="st-wrap">
          <div className="st-kopf">
            <h2 id="st-h-fluss">Vom Eingang bis zur Freigabe.</h2>
            <p>Belege kommen aus E-Mail, Scan und ERP. Die KI liest und prüft. Entschieden wird bei Ihnen, danach geht alles an die Buchhaltung.</p>
          </div>
          <StFluss />
        </div>
      </section>

      {/* Kurven-Band: was sich im Alltag ändert (schwarz wie der Datenfluss, daher ohne Übergang) */}
      <section className="st-kurve-block" aria-labelledby="st-h-kurve">
        <StKurve />
      </section>

      <StNaht von="#08080A" nach="#F3F4F6" />

      {/* Einsatzgebiete (heller Block) */}
      <section className="st-hell st-block" id="einsatz" aria-labelledby="st-h-einsatz">
        <div className="st-wrap">
          <div className="st-kopf">
            <h2 id="st-h-einsatz">Einsatzgebiete von KI in der Industrie</h2>
            <p>Mögliche Abläufe bei Herstellern und Zulieferern. Welcher sich bei Ihnen lohnt, klärt die Prozessanalyse.</p>
          </div>
          <StEinsatz />
          <p className="st-fuss-cta"><a className="st-knopf st-knopf-schwarz" href="#kontakt">Ablauf besprechen</a></p>
        </div>
      </section>

      <StNaht von="#F3F4F6" nach="#08080A" />

      {/* Leistungen */}
      <section className="st-block" id="leistungen" aria-labelledby="st-h-leist">
        <div className="st-wrap">
          <div className="st-kopf">
            <h2 id="st-h-leist">Ein Partner von der Analyse bis zum Betrieb.</h2>
            <p>Vier Leistungen. Jede ist ein eigener Auftrag mit Festpreis, und nach jedem entscheiden Sie neu.</p>
          </div>
          <StLeistungen />
          <p className="st-fuss-cta"><Link className="st-knopf" href="/dienstleistungen">Alle Leistungen im Detail</Link></p>
        </div>
      </section>

      <StNaht von="#08080A" nach="#F3F4F6" />

      {/* So beginnt die Zusammenarbeit (heller Block) */}
      <section className="st-hell st-block" id="zusammenarbeit" aria-labelledby="st-h-start">
        <div className="st-wrap">
          <div className="st-kopf">
            <h2 id="st-h-start">So beginnt die Zusammenarbeit.</h2>
            <p>Am Anfang steht ein Gespräch. Alles Weitere entscheiden Sie Schritt für Schritt.</p>
          </div>
          <ol className="st-schritte" role="list">
            <li><span>Schritt 1</span><h3>Erstgespräch</h3><p>Sie schildern Ihre Situation. Wir sagen Ihnen ehrlich, ob und wie wir helfen können.</p></li>
            <li><span>Schritt 2</span><h3>Prozessanalyse</h3><p>Bezahlt und mit Festpreis. Am Ende steht eine klare Empfehlung.</p></li>
            <li><span>Schritt 3</span><h3>Umsetzung</h3><p>Nur wenn es sich lohnt. Wieder mit Festpreis und klar abgegrenztem Umfang.</p></li>
          </ol>
        </div>
      </section>

      <StNaht von="#F3F4F6" nach="#08080A" />

      {/* Demo (Platzhalter) */}
      <section className="st-block" id="demo" aria-labelledby="st-h-demo">
        <div className="st-wrap">
          <div className="st-kopf">
            <h2 id="st-h-demo">Sehen, wie es arbeitet.</h2>
            <p>Ein Beispielablauf von der Rechnung bis zur Freigabe.</p>
          </div>
          <div className="st-platz st-demo" data-platzhalter="demo">
            <div>
              <strong>Platzhalter: Demo</strong>
              <span>Was hier gezeigt wird, steht noch nicht fest.</span>
              <Link className="st-knopf st-knopf-klein" href="/demo">Zur Demo-Seite</Link>
            </div>
          </div>
        </div>
      </section>

      <StNaht von="#08080A" nach="#F3F4F6" />

      {/* Gründer + Zertifikate (heller Block, geht in den Kontakt über) */}
      <section className="st-hell st-block" id="unternehmen" aria-labelledby="st-h-gruender">
        <div className="st-wrap">
          <div className="st-gruender">
            <div className="st-platz st-foto" data-platzhalter="foto"><div><strong>Platzhalter: Foto</strong><span>Melih Dönmez</span></div></div>
            <div>
              <h2 id="st-h-gruender">Sie sprechen direkt mit dem Gründer.</h2>
              <p>Von Anfang an ist Melih Dönmez Ihr Ansprechpartner, vom Erstgespräch bis zur Begleitung.</p>
              <p><Link className="st-link" href="/ueber-uns">Mehr über Synotix</Link></p>
            </div>
          </div>

          <section className="st-zert" aria-labelledby="st-h-zert">
            <h3 id="st-h-zert">Zertifikate</h3>
            <ul role="list">
              {NACHWEISE.map((n) => (
                <li key={n} className="st-platz" data-platzhalter="zertifikat"><div><strong>{n}</strong><span>Name und Bild folgen</span></div></li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      {/* Kontakt (heller Block) */}
      <section className="st-hell st-block" id="kontakt" aria-labelledby="st-h-kontakt">
        <div className="st-wrap st-kontakt">
          <div>
            <h2 id="st-h-kontakt">Lassen Sie uns über Ihren Ablauf sprechen.</h2>
            <p>Wir hören zu, ordnen ein und sagen Ihnen offen, was der nächste sinnvolle Schritt ist.</p>
            <p className="st-mail">Oder direkt per E-Mail: <a href={`mailto:${KONTAKT_EMAIL}`}>{KONTAKT_EMAIL}</a></p>
          </div>
          <StKontakt />
        </div>
      </section>

      <StNaht von="#F3F4F6" nach="#08080A" />

      {/* FAQ */}
      <section className="st-block" aria-labelledby="st-h-faq">
        <div className="st-wrap st-faq">
          <h2 id="st-h-faq">Häufige Fragen</h2>
          <div>
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
