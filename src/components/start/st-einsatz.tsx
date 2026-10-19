"use client";

import { useEffect, useRef, useState } from "react";
import { beleg, brief, kurve, netz, pruef, raster, rastern, stapel, zufall, type Motiv } from "./st-motive";

/* Liste mit Balken und schwebender Vorschau-Karte (Prinzip "Hover Image List", 21st.dev, eigene Umsetzung).
   Die Karte folgt dem Mauszeiger mit Feder und neigt sich mit der Bewegung. In ihr fügen sich Pixel
   zum Motiv der Zeile; beim Wechsel der Zeile wandern dieselben Pixel ins nächste Motiv.
   Wirkt nur mit Maus; auf Touch und bei reduzierter Bewegung bleibt es eine ruhige Liste. */

const ZEILEN: { titel: string; bereich: string; text: string; motiv: Motiv }[] = [
  { titel: "Rechnungsprüfung", bereich: "Buchhaltung", text: "Rechnungen auslesen, mit Bestellung und Lieferschein abgleichen, Abweichungen markieren.", motiv: beleg },
  { titel: "Angebote und Anfragen", bereich: "Vertrieb", text: "Anfragen erfassen, Angaben ordnen, Angebotsentwürfe vorbereiten.", motiv: stapel },
  { titel: "Qualitätsdokumente", bereich: "Qualität", text: "Prüfberichte und Nachweise ablegen, verknüpfen und schnell wiederfinden.", motiv: pruef },
  { titel: "Wissen im Betrieb", bereich: "Alle Bereiche", text: "Antworten aus Handbüchern, Anleitungen und Zeichnungen.", motiv: netz },
  { titel: "Auswertungen", bereich: "Leitung", text: "Zahlen aus Excel und ERP zusammenführen und lesbar machen.", motiv: kurve },
  { titel: "E-Mail-Eingang", bereich: "Verwaltung", text: "Nachrichten sortieren und an die richtige Stelle geben.", motiv: brief },
  { titel: "Stammdaten", bereich: "Einkauf", text: "Artikel- und Lieferantendaten prüfen und vereinheitlichen.", motiv: raster },
];

const KARTE_B = 300;
const KARTE_H = 220;
const RASTER = 4; // px je Pixel in der Karte
const BLAU = "#3B6BF5";

type Teil = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; a: number; ta: number; blau: boolean; verzug: number };

export function StEinsatz() {
  const wrap = useRef<HTMLDivElement>(null);
  const karte = useRef<HTMLDivElement>(null);
  const flaeche = useRef<HTMLCanvasElement>(null);
  const zeilen = useRef<(HTMLLIElement | null)[]>([]);
  const [aktiv, setAktiv] = useState<number | null>(null);
  const [balken, setBalken] = useState({ y: 0, h: 0 });
  const aktivRef = useRef<number | null>(null);
  const motor = useRef<{ ziel: (i: number) => void; maus: (x: number, y: number) => void; weg: () => void } | null>(null);

  useEffect(() => {
    const w = wrap.current, k = karte.current, c = flaeche.current;
    const g = c?.getContext("2d");
    if (!w || !k || !c || !g) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maus = window.matchMedia("(hover: hover) and (pointer: fine)");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = KARTE_B * dpr;
    c.height = KARTE_H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Zielpositionen je Motiv, von links nach rechts sortiert, damit die Pixel beim Wechsel fließen statt sich zu kreuzen.
    const cols = Math.floor(KARTE_B / RASTER), rows = Math.floor(KARTE_H / RASTER);
    const ziele = ZEILEN.map((z) => {
      const m = rastern(z.motiv, cols, rows);
      const liste: { x: number; y: number; blau: boolean }[] = [];
      for (let i = 0; i < m.length; i++) if (m[i]) liste.push({ x: (i % cols) * RASTER + RASTER / 2, y: Math.floor(i / cols) * RASTER + RASTER / 2, blau: m[i] === 2 });
      return liste.sort((a, b) => a.x + a.y * 0.35 - (b.x + b.y * 0.35));
    });
    const anzahl = Math.max(...ziele.map((z) => z.length));
    const teile: Teil[] = Array.from({ length: anzahl }, (_, i) => ({
      x: KARTE_B / 2 + (zufall(i) - 0.5) * 60, y: KARTE_H / 2 + (zufall(i + 99) - 0.5) * 60,
      vx: 0, vy: 0, tx: KARTE_B / 2, ty: KARTE_H / 2, a: 0, ta: 0, blau: false, verzug: zufall(i + 7) * 140,
    }));

    // Karte: Position folgt der Maus über eine kritisch gedämpfte Feder, Neigung aus der Geschwindigkeit.
    const pos = { x: 0, y: 0, vx: 0, vy: 0, zx: 0, zy: 0, sichtbar: false, gesetzt: false };
    let wechsel = 0;
    let raf = 0;
    let letzt = 0;

    const ziel = (idx: number) => {
      const z = ziele[idx];
      wechsel = performance.now();
      for (let i = 0; i < teile.length; i++) {
        const t = teile[i];
        if (i < z.length) {
          t.tx = z[i].x; t.ty = z[i].y; t.ta = 1; t.blau = z[i].blau;
        } else {
          // überzählige Pixel lösen sich in der Nähe eines echten Zielpunkts auf
          const q = z[Math.floor(zufall(i) * z.length)];
          t.tx = q.x; t.ty = q.y; t.ta = 0; t.blau = false;
        }
      }
    };

    const schritt = (jetzt: number) => {
      raf = 0;
      const dt = letzt ? Math.min(0.05, (jetzt - letzt) / 1000) : 1 / 60;
      letzt = jetzt;

      // Feder der Karte (Antwort ≈ 0,35 s, ohne Überschwingen)
      const om = (2 * Math.PI) / 0.35;
      const vorX = pos.x;
      for (const ach of ["x", "y"] as const) {
        const v = ach === "x" ? "vx" : "vy";
        const zz = ach === "x" ? pos.zx : pos.zy;
        const x0 = pos[ach] - zz;
        const e = Math.exp(-om * dt);
        const tmp = (pos[v] + om * x0) * dt;
        pos[ach] = zz + (x0 + tmp) * e;
        pos[v] = (pos[v] - om * tmp) * e;
      }
      const neig = Math.max(-9, Math.min(9, pos.vx * 0.012));
      k.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0) skewX(${(-neig).toFixed(2)}deg) rotate(${(neig * 0.25).toFixed(2)}deg)`;

      // Pixel: Feder zum Ziel, dazu Trägheit, wenn die Karte ruckt
      const stoss = (pos.x - vorX) * 0.18;
      const seit = jetzt - wechsel;
      let bewegt = Math.abs(pos.vx) > 2 || Math.abs(pos.vy) > 2 || Math.abs(pos.x - pos.zx) > 0.3 || Math.abs(pos.y - pos.zy) > 0.3;
      g.clearRect(0, 0, KARTE_B, KARTE_H);
      for (const t of teile) {
        if (seit > t.verzug) {
          t.vx += (t.tx - t.x) * 0.075 - stoss * 0.6;
          t.vy += (t.ty - t.y) * 0.075;
          t.vx *= 0.8; t.vy *= 0.8;
          t.x += t.vx; t.y += t.vy;
          t.a += (t.ta - t.a) * 0.14;
        }
        if (Math.abs(t.vx) + Math.abs(t.vy) > 0.02 || Math.abs(t.ta - t.a) > 0.01) bewegt = true;
        if (t.a < 0.02) continue;
        g.globalAlpha = t.a;
        g.fillStyle = t.blau ? BLAU : "#EEF1F7";
        g.fillRect(t.x - 1.5, t.y - 1.5, 3, 3);
      }
      g.globalAlpha = 1;
      if (bewegt || seit < 600) raf = requestAnimationFrame(schritt);
      else letzt = 0;
    };
    const weiter = () => { if (!raf) raf = requestAnimationFrame(schritt); };

    motor.current = {
      ziel: (i) => {
        if (reduce.matches || !maus.matches) return;
        ziel(i);
        pos.sichtbar = true;
        weiter();
      },
      maus: (mx, my) => {
        if (reduce.matches || !maus.matches) return;
        const b = w.getBoundingClientRect();
        // Karte rechts vom Zeiger, am rechten Rand auf die linke Seite
        const rechts = mx + 36 + KARTE_B < b.width;
        pos.zx = rechts ? mx + 36 : mx - 36 - KARTE_B;
        pos.zy = Math.max(-KARTE_H * 0.3, Math.min(b.height - KARTE_H * 0.7, my - KARTE_H / 2));
        if (!pos.gesetzt) { pos.x = pos.zx; pos.y = pos.zy; pos.gesetzt = true; }
        weiter();
      },
      weg: () => { pos.sichtbar = false; pos.gesetzt = false; weiter(); },
    };
    return () => { if (raf) cancelAnimationFrame(raf); motor.current = null; };
  }, []);

  const betreten = (i: number) => {
    const w = wrap.current, li = zeilen.current[i];
    if (!w || !li) return;
    const wb = w.getBoundingClientRect(), lb = li.getBoundingClientRect();
    setBalken({ y: lb.top - wb.top, h: lb.height });
    setAktiv(i);
    if (aktivRef.current !== i) motor.current?.ziel(i);
    aktivRef.current = i;
  };

  return (
    <div
      ref={wrap}
      className="st-liste"
      onMouseLeave={() => { setAktiv(null); aktivRef.current = null; motor.current?.weg(); }}
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (r) motor.current?.maus(e.clientX - r.left, e.clientY - r.top);
      }}
    >
      <div
        className="st-balken"
        aria-hidden="true"
        style={{ transform: `translateY(${balken.y}px)`, height: balken.h, opacity: aktiv === null ? 0 : 1 }}
      />
      <div ref={karte} className="st-vorschau" aria-hidden="true">
        <div className={`st-karte-schwebe${aktiv !== null ? " st-an" : ""}`}>
          <canvas ref={flaeche} style={{ width: KARTE_B, height: KARTE_H }} />
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
