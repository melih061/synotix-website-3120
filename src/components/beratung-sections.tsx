import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { DataSynthMock } from "@/components/im-home";
import { LEISTUNGEN, LEISTUNGEN_HINWEIS, REFERENZ, SCHRITTE, SITUATIONEN, UEBER_MELIH } from "@/lib/angebot";

/* Sektionen der Startseite im Beratungsmodell. Texte: src/lib/angebot.ts */

export function Checks({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className={`sx-checks${dark ? " is-dark" : ""}`}>
      {items.map((i) => <li key={i}><Check size={15} aria-hidden="true" />{i}</li>)}
    </ul>
  );
}

export function TextLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={`im-link${light ? " is-light" : ""}`}>
      {children} <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

/** Rechte Hero-Spalte: der Weg in vier Stufen, jede ein eigener Auftrag. */
export function HeroWeg() {
  return (
    <div className="sx-weg" aria-label="Der Weg in vier Stufen">
      <p className="sx-weg-k">Ihr Weg mit Synotix</p>
      <ol>
        {LEISTUNGEN.map(({ n, t, kurz, icon: Icon }) => (
          <li key={n}>
            <span className="sx-weg-ic" aria-hidden="true"><Icon size={18} /></span>
            <span className="sx-weg-t"><b>{t}</b><small>{kurz}</small></span>
            <span className="sx-weg-n" aria-hidden="true">{n}</span>
          </li>
        ))}
      </ol>
      <p className="sx-weg-foot">Jede Stufe ein eigener Auftrag · Sie entscheiden nach jeder Stufe</p>
    </div>
  );
}

export function SituationenSection() {
  return (
    <section id="situationen" className="im-sec im-light" aria-labelledby="situationen-h">
      <div className="im-wrap">
        <div className="im-head-row" data-reveal>
          <div>
            <p className="im-eyebrow">Erkennen Sie sich wieder?</p>
            <h2 id="situationen-h" className="im-h2 im-h2-lg">Typische Situationen<br />im Mittelstand.</h2>
          </div>
          <p className="sx-note">Beispielsituationen, keine Kundenzitate.</p>
        </div>
        <ul className="sx-quotes">
          {SITUATIONEN.map((s, i) => (
            <li key={s.zitat} data-reveal style={{ ["--d" as string]: i % 3 }}>
              <Link href={s.href} className="sx-quote">
                <span className="sx-quote-t">{s.zitat}</span>
                <span className="sx-quote-l">
                  <span className="sr-only">{s.linkLabel}: </span>
                  {s.leistung}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LeistungenSection() {
  return (
    <section id="leistungen" className="im-sec im-black" aria-labelledby="leistungen-h">
      <div className="im-wrap">
        <div className="im-head-row" data-reveal>
          <div>
            <p className="im-eyebrow">Leistungen</p>
            <h2 id="leistungen-h" className="im-h2 im-h2-xl">Vier Leistungen.<br />Jede ein eigener Auftrag.</h2>
          </div>
          <TextLink href="/dienstleistungen" light>Alle Leistungen im Detail</TextLink>
        </div>
        <ol className="im-approach sx-leistungen">
          {LEISTUNGEN.map(({ n, slug, t, kurz, punkte, icon: Icon }) => (
            <li key={n} data-reveal>
              <span className="im-approach-n">{n}</span>
              <h3>{t}</h3>
              <div className="im-approach-body">
                <p>{kurz}</p>
                <ul className="sx-dots">
                  {punkte.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <Link href={`/dienstleistungen/${slug}`} className="im-link is-light">
                  {t} ansehen <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="im-approach-visual" aria-hidden="true"><Icon size={32} /></div>
            </li>
          ))}
        </ol>
        <p className="sx-leistungen-note" data-reveal>{LEISTUNGEN_HINWEIS}</p>
      </div>
    </section>
  );
}

export function SchritteSection() {
  return (
    <section id="zusammenarbeit" className="im-sec sx-navy" aria-labelledby="zusammenarbeit-h">
      <div className="im-wrap">
        <div className="im-head-row" data-reveal>
          <div>
            <p className="im-eyebrow">So beginnt die Zusammenarbeit</p>
            <h2 id="zusammenarbeit-h" className="im-h2 im-h2-lg">Drei Schritte.<br />Klare Entscheidungen.</h2>
          </div>
          <TextLink href="/kontakt" light>Erstgespräch vereinbaren</TextLink>
        </div>
        <ol className="sx-rea">
          {SCHRITTE.map((s, i) => (
            <li key={s.t} className={i === 1 ? "is-action" : undefined} data-reveal style={{ ["--d" as string]: i }}>
              <span className="sx-rea-k">Schritt {i + 1} von 3 · {s.tag}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <code>{s.ergebnis}</code>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ReferenzSection() {
  return (
    <section id="beispiel" className="im-sec sx-mist" aria-labelledby="beispiel-h">
      <div className="im-wrap sx-ref">
        <div data-reveal>
          <p className="im-eyebrow">{REFERENZ.eyebrow}</p>
          <h2 id="beispiel-h" className="im-h2 im-h2-lg">{REFERENZ.h2}</h2>
          <p className="im-lead">{REFERENZ.text}</p>
          <ul className="sx-ref-list">
            {REFERENZ.punkte.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="sx-ref-status">{REFERENZ.status}</p>
          <div className="sx-ref-cta">
            <Link href="/produkte/datensynth" className="im-pill im-pill-dark">Beispiellösung DataSynth ansehen <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <TextLink href="/demo">Demo mit Beispieldaten</TextLink>
          </div>
        </div>
        <div className="sx-ref-frame" data-reveal style={{ ["--d" as string]: 1 }} aria-hidden="true">
          <DataSynthMock tilt={false} />
        </div>
      </div>
    </section>
  );
}

export function UeberMelihSection() {
  return (
    <section id="ueber-melih" className="im-sec im-light" aria-labelledby="ueber-melih-h">
      <div className="im-wrap sx-about">
        <div className="sx-person" data-reveal>
          {/* Platzhalter, bis ein Porträtfoto vorliegt */}
          <span className="sx-person-av" aria-hidden="true">MD</span>
          <p className="sx-person-q">Melih Dönmez</p>
          <p className="sx-person-n"><small>Gründer von Synotix · direkter Kontakt</small></p>
          <Link href="/ueber-uns" className="sx-person-link">Profil von Melih Dönmez ansehen <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <div data-reveal style={{ ["--d" as string]: 1 }}>
          <p className="im-eyebrow">{UEBER_MELIH.eyebrow}</p>
          <h2 id="ueber-melih-h" className="im-h2 im-h2-lg">{UEBER_MELIH.h2}</h2>
          {UEBER_MELIH.absaetze.map((a) => <p key={a} className="sx-about-p">{a}</p>)}
          <Checks items={UEBER_MELIH.punkte} />
        </div>
      </div>
    </section>
  );
}
