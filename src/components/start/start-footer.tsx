import Link from "next/link";
import { KONTAKT_EMAIL } from "@/lib/angebot";

const SEITEN = [
  { label: "Leistungen", href: "/dienstleistungen" },
  { label: "Lösungen", href: "/loesungen" },
  { label: "Branchen", href: "/branchen" },
  { label: "Unternehmen", href: "/ueber-uns" },
  { label: "Demo", href: "/demo" },
];
const LEISTUNGEN = [
  { label: "Analyse & Strategie", href: "/dienstleistungen/ki-agenten" },
  { label: "Maßgeschneiderte Lösungen", href: "/dienstleistungen/n8n-workflows" },
  { label: "Schulung & Enablement", href: "/dienstleistungen/schulung" },
  { label: "Begleitung", href: "/dienstleistungen/managed-services" },
];
const RECHTLICHES = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AVV / DSGVO", href: "/avv" },
];

export function StartFooter() {
  return (
    <footer className="st-footer">
      <div className="st-wrap">
        <div className="st-footer-gitter">
          <p className="st-footer-satz">KI für Hersteller und Zulieferer. Erst verstehen, dann bauen.</p>
          <nav aria-label="Seiten"><h2>Seiten</h2><ul role="list">{SEITEN.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></nav>
          <nav aria-label="Leistungen"><h2>Leistungen</h2><ul role="list">{LEISTUNGEN.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></nav>
          <nav aria-label="Rechtliches"><h2>Rechtliches</h2><ul role="list">{RECHTLICHES.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></nav>
        </div>
        <p className="st-footer-mail">
          <a href={`mailto:${KONTAKT_EMAIL}`}>{KONTAKT_EMAIL}</a>
        </p>
      </div>
      <div className="st-wortmarke" aria-hidden="true"><span>synotix</span></div>
      <div className="st-wrap st-footer-unten"><span>© 2026 Synotix</span><a href="#main-content">Nach oben</a></div>
    </footer>
  );
}
