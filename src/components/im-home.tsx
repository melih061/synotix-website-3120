"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { HeroMark, SynotixMark } from "./im-brand";

/* ── Laufband mit Pause-Knopf (WCAG 2.2.2) ─────────────────────────── */
const BAND = ["Analyse vor Umsetzung", "Mensch gibt frei", "Festpreis je Auftrag", "Schulung für Ihr Team", "Entwickelt in Deutschland"];

export function Marquee() {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul className="im-marquee-row" aria-hidden={hidden || undefined}>
      {BAND.map((t) => (
        <li key={t}>{t}<span className="im-star" aria-hidden="true">✳</span></li>
      ))}
    </ul>
  );
  return (
    <div className={`im-marquee${paused ? " is-paused" : ""}`}>
      <div className="im-marquee-track">{row(false)}{row(true)}</div>
      <button className="im-marquee-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Laufband fortsetzen" : "Laufband anhalten"}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}

/* ── Mock-Oberfläche DataSynth (Beispieldaten) ─────────────────────── */
export function DataSynthMock({ tilt = true }: { tilt?: boolean }) {
  return (
    <div className={`im-mock${tilt ? " is-tilted" : ""}`} aria-hidden="true">
      <aside className="im-mock-side">
        <p className="im-mock-brand"><SynotixMark size={14} /> DataSynth</p>
        <span className="is-active">Übersicht</span>
        <span>Belege</span>
        <span>Prüfhinweise</span>
        <span>DATEV-Export</span>
        <small>Rechnungsprüfung</small>
      </aside>
      <div className="im-mock-main">
        <p className="im-mock-meta">Heute · Beispieldaten</p>
        <p className="im-mock-kicker">Übersicht</p>
        <p className="im-mock-h">Alles im Blick.</p>
        <div className="im-mock-stats">
          <div><small>Belege</small><b>42</b></div>
          <div><small>Prüfhinweise</small><b>3</b></div>
          <div><small>Freigabe offen</small><b>5</b></div>
        </div>
        <div className="im-mock-chart">
          <small>Eingang je Tag</small>
          <svg viewBox="0 0 300 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="im-mock-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3E5BA6" stopOpacity=".28" />
                <stop offset="100%" stopColor="#3E5BA6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 70 C25 70 30 35 55 35 S85 62 105 60 S130 12 150 12 S175 70 195 68 S220 20 240 18 S270 66 300 40 L300 90 L0 90Z" fill="url(#im-mock-fill)" />
            <path d="M0 70 C25 70 30 35 55 35 S85 62 105 60 S130 12 150 12 S175 70 195 68 S220 20 240 18 S270 66 300 40" fill="none" stroke="#3E5BA6" strokeWidth="2.2" />
          </svg>
        </div>
        <div className="im-mock-next">
          <span className="im-mock-av">SG</span>
          <span><b>Nächste Freigabe</b><small>Schmidt GmbH · IBAN geändert</small></span>
          <em>Mensch prüft</em>
        </div>
      </div>
    </div>
  );
}

/* ── Produkt-Schiene mit Pfeilen ───────────────────────────────────── */
type Product = { href: string; status: string; title: string; sub: string; tags: string[]; visual: "mock" | "mark" | "flow" | "eu" };

const PRODUCTS: Product[] = [
  { href: "/produkte/datensynth", status: "Pilotvorbereitung", title: "DataSynth", sub: "Betreute Rechnungsprüfung mit DATEV-Übergabe", tags: ["Rechnungsprüfung", "DATEV"], visual: "mock" },
  { href: "/produkte/wissens-agent", status: "Bei konkretem Bedarf", title: "Wissens-Agent", sub: "Firmenwissen finden, mit nachvollziehbaren Quellen", tags: ["Dokumente", "Quellen"], visual: "mark" },
  { href: "/produkte/prozessautomatisierung", status: "Nach Prozessanalyse", title: "Prozessautomatisierung", sub: "Ein Prozess, ein klarer Auftrag", tags: ["Umsetzung", "Freigaben"], visual: "flow" },
  { href: "/produkte/rfq-machbarkeit", status: "Perspektive", title: "RFQ-Machbarkeit", sub: "Technische Anfragen vorprüfen", tags: ["Anfragen", "Perspektive"], visual: "eu" },
];

function ProductVisual({ kind }: { kind: Product["visual"] }) {
  if (kind === "mock") return <div className="im-pv im-pv-lav"><DataSynthMock /></div>;
  if (kind === "mark") return <div className="im-pv im-pv-plum"><HeroMark className="im-pv-mark" rings={6} /></div>;
  if (kind === "flow") {
    return (
      <div className="im-pv im-pv-ink" aria-hidden="true">
        <div className="im-flow">
          {["Analyse", "Umsetzung", "Freigabe", "Betrieb"].map((s, i) => (
            <span key={s} style={{ ["--i" as string]: i }}>{String(i + 1).padStart(2, "0")} · {s}</span>
          ))}
        </div>
      </div>
    );
  }
  return <div className="im-pv im-pv-lav2" aria-hidden="true"><span className="im-pv-glyph">RFQ</span></div>;
}

export function ProductRail() {
  const rail = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState(1);
  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 30), behavior: "smooth" });
  };
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    setPos(Math.min(PRODUCTS.length, Math.round(el.scrollLeft / ((card?.clientWidth ?? 400) + 30)) + 1));
  };
  return (
    <div>
      <ul ref={rail} className="im-rail" onScroll={onScroll} aria-label="Produkte">
        {PRODUCTS.map((p) => (
          <li key={p.href} className={`im-pcard${p.visual === "mock" ? " is-wide" : ""}`}>
            <Link href={p.href} className="im-pcard-link">
              <div className="im-pcard-visual">
                <span className="im-badge">{p.status}</span>
                <ProductVisual kind={p.visual} />
              </div>
              <div className="im-pcard-body">
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.sub}</p>
                </div>
                <span className="im-round"><ArrowUpRight size={18} aria-hidden="true" /></span>
              </div>
              <div className="im-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="im-rail-ctrl">
        <span className="im-rail-pos">{String(pos).padStart(2, "0")} — {String(PRODUCTS.length).padStart(2, "0")}</span>
        <div>
          <button className="im-round im-round-lg" onClick={() => scrollBy(-1)} aria-label="Vorheriges Produkt"><ArrowLeft size={18} aria-hidden="true" /></button>
          <button className="im-round im-round-lg" onClick={() => scrollBy(1)} aria-label="Nächstes Produkt"><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
