import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DotSphere } from "@/components/dot-sphere";
import { SynotixMark } from "@/components/im-brand";
import { Marquee } from "@/components/im-home";
import { RevealObserver } from "@/components/im-reveal";
import {
  Checks, HeroWeg, LeistungenSection, ReferenzSection, SchritteSection, SituationenSection, UeberMelihSection,
} from "@/components/beratung-sections";
import { FAQ, HERO, KONTAKT_EMAIL, SEO } from "@/lib/angebot";
import "./home.css";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="im-home">
      <RevealObserver />

      {/* ── Hero ── */}
      <section className="sx-hero" aria-labelledby="sx-hero-h">
        <div className="sx-hero-grid" aria-hidden="true" />
        <div className="sx-hero-sphere" aria-hidden="true"><DotSphere className="sx-hero-canvas" /></div>
        <div className="im-wrap sx-hero-in">
          <div className="sx-hero-copy">
            <span className="sx-chip"><SynotixMark size={14} /> {HERO.chip}</span>
            <h1 id="sx-hero-h" className="sx-hero-h">
              {HERO.h1} <span>{HERO.h1Accent}</span>
            </h1>
            <p className="sx-hero-lead">{HERO.lead}</p>
            <div className="sx-hero-cta">
              <Link href="/kontakt" className="im-pill im-pill-light">Erstgespräch vereinbaren <ArrowUpRight size={16} aria-hidden="true" /></Link>
              <Link href="#zusammenarbeit" className="im-pill im-pill-line">So arbeiten wir</Link>
            </div>
            <div>
              <Checks dark items={HERO.checks} />
            </div>
          </div>
          <div className="sx-hero-frame">
            <div className="sx-hero-frame-in"><HeroWeg /></div>
          </div>
        </div>
      </section>

      <SituationenSection />
      <Marquee />
      <LeistungenSection />
      <SchritteSection />
      <ReferenzSection />
      <UeberMelihSection />

      {/* ── FAQ ── */}
      <section className="im-sec sx-mist" aria-labelledby="faq-h">
        <div className="im-wrap im-faq">
          <div data-reveal>
            <p className="im-eyebrow">Häufige Fragen</p>
            <h2 id="faq-h" className="im-h2 im-h2-lg">Fragen vor dem<br />ersten Gespräch.</h2>
          </div>
          <div className="im-faq-list" data-reveal style={{ ["--d" as string]: 1 }}>
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}<span className="im-faq-pm" aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Schluss-CTA ── */}
      <section className="im-closing" aria-labelledby="closing-h">
        <div className="im-wrap im-center" data-reveal>
          <h2 id="closing-h" className="im-h2 im-h2-xl">Welcher Ablauf soll<br />leichter werden?</h2>
          <p>Ein unverbindliches Erstgespräch über Ihre Situation.<br />Ehrlich, auch wenn die Antwort „noch nicht“ lautet.</p>
          <Link href="/kontakt" className="im-pill im-pill-dark">Erstgespräch vereinbaren <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <p className="sx-closing-alt">
            Oder schreiben Sie direkt an <a href={`mailto:${KONTAKT_EMAIL}`}>{KONTAKT_EMAIL}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
