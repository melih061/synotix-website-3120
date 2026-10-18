"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Liste mit weißem Balken und Linien-Vorschau (Prinzip "Interactive List Preview", hyperiux).
   Eigene Grafiken statt Fotos. Wirkt nur mit Maus; auf Touch bleibt es eine ruhige Liste. */

const GRAFIK: Record<string, ReactNode> = {
  beleg: <><rect x="70" y="40" width="160" height="220" /><path d="M95 80h110M95 105h110M95 130h80M95 170h110M95 195h110" /><rect x="88" y="160" width="124" height="22" /><path d="M150 285v20M140 300l10 10 10-10" /></>,
  stapel: <><rect x="60" y="80" width="140" height="180" /><rect x="80" y="60" width="140" height="180" /><rect x="100" y="40" width="140" height="180" /><path d="M120 80h100M120 100h100M120 120h70" /></>,
  pruef: <><circle cx="150" cy="150" r="90" /><circle cx="150" cy="150" r="60" /><path d="m118 150 22 22 44-44" /><path d="M150 40v20M150 240v20M40 150h20M240 150h20" /></>,
  netz: <><circle cx="80" cy="90" r="14" /><circle cx="220" cy="110" r="14" /><circle cx="140" cy="210" r="14" /><circle cx="240" cy="230" r="8" /><path d="m92 96 114 12M86 102l46 96M152 200l58-80M152 214l80 14" /></>,
  kurve: <><path d="M50 260h210M50 260V50" /><path d="M60 230c40-10 50-80 90-90s40 40 80-70" /><path d="M60 250h30v-40H60zM110 250h30v-70h-30zM160 250h30v-100h-30z" /></>,
  brief: <><rect x="50" y="90" width="200" height="140" /><path d="m50 95 100 75 100-75" /><path d="m50 225 70-60M250 225l-70-60" /></>,
  raster: <><path d="M60 60h180v180H60z" /><path d="M60 105h180M60 150h180M60 195h180M105 60v180M150 60v180M195 60v180" /><rect x="150" y="105" width="45" height="45" /></>,
};

const ZEILEN = [
  { titel: "Rechnungsprüfung", bereich: "Buchhaltung", text: "Rechnungen auslesen, mit Bestellung und Lieferschein abgleichen, Abweichungen markieren.", g: "beleg" },
  { titel: "Angebote und Anfragen", bereich: "Vertrieb", text: "Anfragen erfassen, Angaben ordnen, Angebotsentwürfe vorbereiten.", g: "stapel" },
  { titel: "Qualitätsdokumente", bereich: "Qualität", text: "Prüfberichte und Nachweise ablegen, verknüpfen und schnell wiederfinden.", g: "pruef" },
  { titel: "Wissen im Betrieb", bereich: "Alle Bereiche", text: "Antworten aus Handbüchern, Anleitungen und Zeichnungen.", g: "netz" },
  { titel: "Auswertungen", bereich: "Leitung", text: "Zahlen aus Excel und ERP zusammenführen und lesbar machen.", g: "kurve" },
  { titel: "E-Mail-Eingang", bereich: "Verwaltung", text: "Nachrichten sortieren und an die richtige Stelle geben.", g: "brief" },
  { titel: "Stammdaten", bereich: "Einkauf", text: "Artikel- und Lieferantendaten prüfen und vereinheitlichen.", g: "raster" },
];

export function StEinsatz() {
  const wrap = useRef<HTMLDivElement>(null);
  const folgen = useRef<HTMLDivElement>(null);
  const zeilen = useRef<(HTMLLIElement | null)[]>([]);
  const [aktiv, setAktiv] = useState<number | null>(null);
  const [balken, setBalken] = useState({ y: 0, h: 0 });
  const [ruhig, setRuhig] = useState(false);
  const ziel = useRef({ x: 0, y: 0 });
  const akt = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  const tick = () => {
    const a = akt.current, z = ziel.current;
    a.x += (z.x - a.x) * 0.09;
    a.y += (z.y - a.y) * 0.09;
    if (folgen.current) folgen.current.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
    raf.current = Math.abs(z.x - a.x) > 0.05 || Math.abs(z.y - a.y) > 0.05 ? requestAnimationFrame(tick) : 0;
  };
  const anstossen = () => { if (!ruhig && !raf.current) raf.current = requestAnimationFrame(tick); };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setRuhig(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const betreten = (i: number) => {
    const w = wrap.current, li = zeilen.current[i];
    if (!w || !li) return;
    const wb = w.getBoundingClientRect(), lb = li.getBoundingClientRect();
    setBalken({ y: lb.top - wb.top, h: lb.height });
    setAktiv(i);
  };

  return (
    <div
      ref={wrap}
      className="st-liste"
      onMouseLeave={() => { setAktiv(null); ziel.current = { x: 0, y: 0 }; anstossen(); }}
      onMouseMove={(e) => {
        if (ruhig || !wrap.current) return;
        const r = wrap.current.getBoundingClientRect();
        ziel.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 40, y: ((e.clientY - r.top) / r.height - 0.5) * 40 };
        anstossen();
      }}
    >
      <div
        className="st-balken"
        aria-hidden="true"
        style={{ transform: `translateY(${balken.y}px)`, height: balken.h, opacity: aktiv === null ? 0 : 1 }}
      />
      <div className="st-vorschau" aria-hidden="true">
        <div ref={folgen} className="st-folgen">
          {ZEILEN.map((z, i) => (
            <div
              key={z.titel}
              className={`st-bild${aktiv === i ? " st-an" : ""}`}
              style={aktiv === i ? { top: balken.y + balken.h / 2 } : undefined}
            >
              <svg viewBox="0 0 300 340">{GRAFIK[z.g]}</svg>
            </div>
          ))}
        </div>
      </div>
      <ul role="list">
        {ZEILEN.map((z, i) => (
          <li key={z.titel} ref={(el) => { zeilen.current[i] = el; }} className={aktiv === i ? "st-aktiv" : undefined} onMouseEnter={() => betreten(i)}>
            <b>{z.titel}</b>
            <span>{z.bereich}</span>
            <span>{z.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
