import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { CatalogEntry } from "@/lib/catalog";
import { STATUS_META } from "@/lib/catalog";

const BACK: Record<CatalogEntry["category"], { label: string; href: string }> = {
  agenten: { label: "Alle technischen Beispiele", href: "/agenten" },
  dienstleistungen: { label: "Alle Leistungen", href: "/dienstleistungen" },
  branchen: { label: "Alle Branchen", href: "/branchen" },
  produkte: { label: "Alle Beispiellösungen", href: "/produkte" },
};

export function DetailPage({ e }: { e: CatalogEntry }) {
  const back = BACK[e.category];
  const ctaPrimary = e.ctaPrimary ?? { label: "Erstgespräch vereinbaren", href: "/kontakt" };
  const ctaSecondary = e.ctaSecondary ?? { label: "So arbeiten wir", href: "/dienstleistungen" };

  return (
    <main>
      {/* Hero */}
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 72 }}>
          <Link href={back.href} className="back-link">← {back.label}</Link>
          {e.status && (
            <span className={`status-badge is-${e.status}`} style={{ display: "flex", marginTop: 16 }}>
              {STATUS_META[e.status].label}
            </span>
          )}
          <span className="eyebrow" style={{ marginTop: e.status ? 12 : 14 }}>{e.eyebrow}</span>
          <h1 className="page-h1">
            {e.title}{e.titleDim && <> <span className="dim">{e.titleDim}</span></>}
          </h1>
          <p className="page-lead">{e.lead}</p>
          <div className="hero-cta">
            <Link className="btn btn-pri btn-pill" href={ctaPrimary.href}>{ctaPrimary.label} <span className="ar">→</span></Link>
            <Link className="btn btn-line btn-pill" href={ctaSecondary.href}>{ctaSecondary.label}</Link>
          </div>
        </div>
      </section>

      {/* Ausgangslage */}
      <section className="s-light">
        <div className="wrap two-col">
          <div className="sec-head">
            <span className="eyebrow">Ausgangslage</span>
            <h2>{e.intro.h}</h2>
            <p>{e.intro.body}</p>
          </div>
          <ul className="check-list">
            {e.intro.points.map((p) => (
              <li key={p}><Check size={16} /> {p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fähigkeiten / Leistungen */}
      <section className="s-dark">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">{e.featuresLabel}</span>
            <h2>{e.featuresHead}</h2>
          </div>
          <div className="cgrid">
            {e.features.map(({ icon: Icon, t, d }) => (
              <div key={t} className="uc-cell">
                <span className="uc-ico"><Icon size={18} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="s-dark-2">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <span className="eyebrow">{e.stepsLabel}</span>
            <h2>{e.stepsHead}</h2>
          </div>
          <div className="cgrid cols-3">
            {e.steps.map((s, i) => (
              <div key={s.t} className="uc-cell">
                <span className="n">{String(i + 1).padStart(2, "0")} — Schritt</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ergebnis + verwandte Themen */}
      <section className="s-soft">
        <div className="wrap two-col">
          <div>
            <div className="sec-head" style={{ marginBottom: 26 }}>
              <span className="eyebrow">Ergebnis</span>
              <h2>{e.outcomesHead}</h2>
            </div>
            <ul className="check-list">
              {e.outcomes.map((o) => (
                <li key={o}><Check size={16} /> {o}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="sn-col-lbl" style={{ color: "var(--ink-fg-soft)" }}>Verwandte Themen</div>
            <div className="rel-list">
              {e.related.map((r) => (
                <Link key={r.label} href={r.href} className="rel-row">
                  <span>{r.label}</span>
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s-dark">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "0 auto", maxWidth: "22ch", lineHeight: 1.05 }}>
            Welcher Ablauf soll leichter werden?
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Link className="btn btn-pri btn-pill" href={ctaPrimary.href}>{ctaPrimary.label} <ArrowRight size={16} /></Link>
            <Link className="btn btn-line btn-pill" href={ctaSecondary.href}>{ctaSecondary.label}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
