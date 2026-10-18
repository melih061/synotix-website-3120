import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SynotixLogo } from "./im-brand";
import { KONTAKT_EMAIL } from "@/lib/angebot";

const COLUMNS = [
  [
    { label: "Leistungen", href: "/dienstleistungen" },
    { label: "Schulung", href: "/dienstleistungen/schulung" },
    { label: "Lösungen", href: "/loesungen" },
    { label: "Branchen", href: "/branchen" },
  ],
  [
    { label: "Beispiellösungen", href: "/produkte" },
    { label: "Technischer Hintergrund", href: "/plattform" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Kontakt", href: "/kontakt" },
  ],
];

export function SiteFooter() {
  return (
    <footer className="im-footer">
      <div className="im-wrap">
        <div className="im-footer-top">
          <div className="im-footer-brand">
            <SynotixLogo />
            <p>
              KI-Beratung für den Mittelstand, mit Schwerpunkt Industrie.<br />
              Erst die Analyse, dann Lösung, Schulung oder Begleitung.
            </p>
          </div>
          {COLUMNS.map((col, i) => (
            <ul key={i} className="im-footer-col">
              {col.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          ))}
          <div className="im-footer-contact">
            <p className="im-footer-lbl">Kontakt</p>
            <Link href="/kontakt" className="im-footer-strong">Erstgespräch vereinbaren <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <a href={`mailto:${KONTAKT_EMAIL}`} className="im-footer-strong">{KONTAKT_EMAIL}</a>
            <p className="im-footer-lbl">Deutschland · Direkter Kontakt zum Gründer Melih Dönmez</p>
          </div>
        </div>
        <div className="im-footer-bottom">
          <div className="im-footer-legal">
            <span>© 2026 Synotix</span>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/avv">AVV / DSGVO</Link>
          </div>
          <a href="#main-content" className="im-footer-top-link">Zurück nach oben ↑</a>
        </div>
        <p className="im-footer-note">DATEV ist eine Marke der DATEV eG. Synotix steht in keiner Verbindung zur DATEV eG.</p>
      </div>
      <div className="im-footer-word" aria-hidden="true">SYNOTIX</div>
    </footer>
  );
}
