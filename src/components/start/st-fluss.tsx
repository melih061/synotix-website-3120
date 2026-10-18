"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* Verbindungen nach dem Prinzip "Animated Beam" (klyv-ui, MIT): gebogene Linie zwischen
   zwei echten Elementen, ein Lichtpunkt läuft darüber. Eigene Umsetzung, misst bei jeder Größenänderung neu. */

type Id = "mail" | "scan" | "erp" | "ki" | "team" | "buch";
type Weg = { von: Id; nach: Id; bogen: number; verz: number; blau?: boolean };
type Pfad = { d: string; len: number; x1: number; y1: number; x2: number; y2: number; weg: Weg };

const WEGE: Weg[] = [
  { von: "mail", nach: "ki", bogen: -40, verz: 0 },
  { von: "scan", nach: "ki", bogen: 0, verz: 0.5 },
  { von: "erp", nach: "ki", bogen: 40, verz: 1 },
  { von: "ki", nach: "team", bogen: 0, verz: 1.3, blau: true },
  { von: "team", nach: "buch", bogen: 0, verz: 2 },
];

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
);

export function StFluss() {
  const box = useRef<HTMLDivElement>(null);
  const ringe = useRef<Partial<Record<Id, HTMLElement | null>>>({});
  const [pfade, setPfade] = useState<Pfad[]>([]);
  const uid = useId().replace(/:/g, "");

  const setRing = (id: Id) => (el: HTMLElement | null) => { ringe.current[id] = el; };

  const messen = useCallback(() => {
    const c = box.current;
    if (!c) return;
    const cb = c.getBoundingClientRect();
    const mitte = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - cb.left + r.width / 2, y: r.top - cb.top + r.height / 2 };
    };
    const neu: Pfad[] = [];
    for (const weg of WEGE) {
      const a = ringe.current[weg.von], b = ringe.current[weg.nach];
      if (!a || !b) continue;
      const s = mitte(a), e = mitte(b);
      const dx = e.x - s.x, dy = e.y - s.y, sp = Math.hypot(dx, dy) || 1;
      const cx = (s.x + e.x) / 2 + (-dy / sp) * weg.bogen, cy = (s.y + e.y) / 2 + (dx / sp) * weg.bogen;
      const len = Math.round((sp + Math.hypot(cx - s.x, cy - s.y) + Math.hypot(e.x - cx, e.y - cy)) / 2);
      neu.push({ d: `M${s.x},${s.y} Q${cx},${cy} ${e.x},${e.y}`, len, x1: s.x, y1: s.y, x2: e.x, y2: e.y, weg });
    }
    setPfade(neu);
  }, []);

  useEffect(() => {
    messen();
    const c = box.current;
    if (!c) return;
    const ro = new ResizeObserver(messen);
    ro.observe(c);
    document.fonts?.ready.then(messen);
    return () => ro.disconnect();
  }, [messen]);

  const L = 80;
  return (
    <div
      ref={box}
      className="st-fluss"
      role="img"
      aria-label="Datenfluss: E-Mail, Scan und ERP fließen zur KI-Prüfung, von dort zur Freigabe durch Ihr Team und dann an die Buchhaltung."
    >
      <div className="st-spalte">
        <div className="st-knoten"><span className="st-ring" ref={setRing("mail")}><Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon></span><small>E-Mail</small></div>
        <div className="st-knoten"><span className="st-ring" ref={setRing("scan")}><Icon><path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3" /><path d="M8 12h8" /></Icon></span><small>Scan</small></div>
        <div className="st-knoten"><span className="st-ring" ref={setRing("erp")}><Icon><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></Icon></span><small>ERP</small></div>
      </div>
      <div className="st-knoten st-gross"><span className="st-ring" ref={setRing("ki")}><Icon><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" /><path d="m9 12 2 2 4-4" /></Icon></span><small>KI liest und prüft</small></div>
      <div className="st-knoten st-gross st-mensch"><span className="st-ring" ref={setRing("team")}><Icon><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="m16 11 2 2 4-4" /></Icon></span><small>Ihr Team gibt frei</small></div>
      <div className="st-knoten"><span className="st-ring" ref={setRing("buch")}><Icon><path d="M5 4h11l3 3v13H5z" /><path d="M9 10h6M9 14h6M9 18h4" /></Icon></span><small>Buchhaltung</small></div>

      <svg className="st-beams" aria-hidden="true">
        <defs>
          {pfade.map((p, i) => {
            const farbe = p.weg.blau ? "#9DB4FF" : "#FFFFFF";
            return (
              <linearGradient key={i} id={`${uid}-g${i}`} gradientUnits="userSpaceOnUse" x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}>
                <stop offset="0" stopColor={farbe} stopOpacity=".2" />
                <stop offset=".5" stopColor={farbe} />
                <stop offset="1" stopColor={farbe} stopOpacity=".2" />
              </linearGradient>
            );
          })}
        </defs>
        {pfade.map((p, i) => (
          <g key={i}>
            <path className="st-spur" d={p.d} />
            <path
              className="st-puls"
              d={p.d}
              stroke={`url(#${uid}-g${i})`}
              strokeDasharray={`${L} ${p.len}`}
              style={{ "--weg": -(p.len + L), "--d": `${2.4 + i * 0.1}s`, "--v": `${p.weg.verz}s` } as CSSProperties}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
