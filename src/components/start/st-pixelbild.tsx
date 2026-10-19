"use client";

import { useEffect, useRef } from "react";
import { rastern, zufall, type Motiv } from "./st-motive";

/* Pixel-Grafik: ein Raster aus quadratischen Pixeln, das von einem Motiv zum nächsten umschaltet.
   Der Wechsel läuft als diagonale Welle mit Streuung durch das Raster; umschaltende Pixel blitzen kurz
   auf, wenige davon blau. Im Stillstand flackern vereinzelte Pixel wie Datenverkehr, unter dem
   Mauszeiger weichen sie leicht aus. Reduzierte Bewegung und Pause: Wechsel ohne Welle, kein Flackern. */

const SPALTEN = 64;
const DAUER = 950; // ms für eine ganze Welle
const BLAU = "#3B6BF5";

type Props = {
  motive: Motiv[];
  index: number;
  /** false: einmalig aufbauen, wenn die Grafik ins Bild kommt (z. B. auf dem Handy), danach still. */
  lebendig?: boolean;
  className?: string;
};

export function StPixelBild({ motive, index, lebendig = true, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const zielRef = useRef(index);
  const anstoss = useRef<() => void>(() => {});

  useEffect(() => {
    zielRef.current = index;
    anstoss.current();
  }, [index]);

  useEffect(() => {
    const c = ref.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ruhig = () => reduce.matches || document.documentElement.dataset.stRuhe === "an";

    const n = SPALTEN * SPALTEN;
    let masken: Uint8Array[] = [];
    let leer: Uint8Array = new Uint8Array(n);
    let von: Uint8Array = leer; // Ausgangsbild der laufenden Welle
    let nach: Uint8Array = leer; // Zielbild
    let aktuell = -1;
    let t0 = 0;
    let groesse = 0;
    let dpr = 1;
    let raf = 0;
    let sichtbar = false;
    let letzt = 0;
    let gezeichnet = 0;
    const maus = { x: -1e4, y: -1e4, an: false };
    const flackern = new Float32Array(n); // Restzeit des Flackerns je Pixel (ms)

    // Zeitpunkt, zu dem jedes Pixel umschaltet: diagonale Welle von oben links, mit Streuung.
    const verzug = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i % SPALTEN, y = Math.floor(i / SPALTEN);
      verzug[i] = 0.55 * ((x + y) / (2 * SPALTEN)) + 0.45 * zufall(i);
    }

    const messen = () => {
      const b = c.getBoundingClientRect();
      groesse = Math.max(1, Math.round(Math.min(b.width, b.height)));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(groesse * dpr);
      c.height = Math.round(groesse * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!masken.length) {
        masken = motive.map((m) => rastern(m, SPALTEN, SPALTEN));
        leer = new Uint8Array(n);
      }
    };

    const zeichnen = (jetzt: number) => {
      const zelle = groesse / SPALTEN;
      const pix = Math.max(1, zelle - Math.max(1, zelle * 0.18));
      const p = t0 ? Math.min(1, (jetzt - t0) / DAUER) : 1;
      g.clearRect(0, 0, groesse, groesse);
      // ruhendes Raster: winzige Punkte als Untergrund
      g.fillStyle = "rgba(255,255,255,0.07)";
      const punkt = Math.max(1, zelle * 0.16);
      for (let i = 0; i < n; i++) {
        const x = i % SPALTEN, y = (i / SPALTEN) | 0;
        g.fillRect(x * zelle + (zelle - punkt) / 2, y * zelle + (zelle - punkt) / 2, punkt, punkt);
      }
      const mr = zelle * 7;
      for (let i = 0; i < n; i++) {
        const a = von[i], b = nach[i];
        if (!a && !b) continue;
        const s = verzug[i] * 0.82;
        let wert = p < s ? a : b;
        let blitz = false;
        if (a !== b && p >= s && p < s + 0.1) blitz = true;
        if (!wert && !blitz) continue;
        const x = i % SPALTEN, y = (i / SPALTEN) | 0;
        let px = x * zelle + (zelle - pix) / 2;
        let py = y * zelle + (zelle - pix) / 2;
        let alpha = 1;
        if (flackern[i] > 0) alpha = 0.25;
        if (maus.an) {
          const dx = px - maus.x, dy = py - maus.y;
          const d = Math.hypot(dx, dy);
          if (d < mr && d > 0.01) {
            const k = (1 - d / mr) ** 2;
            px += (dx / d) * k * zelle * 1.6;
            py += (dy / d) * k * zelle * 1.6;
            alpha *= 1 - k * 0.35;
          }
        }
        if (blitz) {
          wert = zufall(i * 7 + 3) < 0.22 ? 2 : 1;
          alpha = 1;
        }
        g.globalAlpha = alpha;
        g.fillStyle = wert === 2 ? BLAU : "#EEF1F7";
        g.fillRect(px, py, pix, pix);
      }
      g.globalAlpha = 1;
      return p < 1;
    };

    const schritt = (jetzt: number) => {
      raf = 0;
      const dt = letzt ? Math.min(64, jetzt - letzt) : 16;
      letzt = jetzt;
      // Flackern: ab und zu dimmt ein einzelnes Pixel kurz ab
      let flackert = false;
      if (lebendig && !ruhig()) {
        for (let k = 0; k < 2; k++) {
          if (Math.random() < 0.35) {
            const i = (Math.random() * n) | 0;
            if (nach[i]) flackern[i] = 220 + Math.random() * 380;
          }
        }
      }
      for (let i = 0; i < n; i++) if (flackern[i] > 0) { flackern[i] -= dt; flackert = true; }
      // Nur Flackern: 15 Bilder pro Sekunde reichen und schonen den Akku.
      const welle = t0 > 0 && jetzt - t0 < DAUER;
      let laeuft = welle;
      if (welle || maus.an || jetzt - gezeichnet > 66) {
        laeuft = zeichnen(jetzt);
        gezeichnet = jetzt;
      }
      if (sichtbar && (laeuft || flackert || maus.an || (lebendig && !ruhig()))) {
        raf = requestAnimationFrame(schritt);
      } else {
        letzt = 0;
      }
    };
    const weiter = () => { if (!raf && sichtbar) raf = requestAnimationFrame(schritt); };

    const wechseln = () => {
      const ziel = zielRef.current;
      if (ziel === aktuell || !masken.length) return;
      // Die laufende Welle wird eingefroren: Ausgang ist, was gerade zu sehen ist.
      const jetzt = performance.now();
      const p = t0 ? Math.min(1, (jetzt - t0) / DAUER) : 1;
      if (p < 1) {
        const stand = new Uint8Array(n);
        for (let i = 0; i < n; i++) stand[i] = p < verzug[i] * 0.82 ? von[i] : nach[i];
        von = stand;
      } else {
        von = nach;
      }
      nach = masken[ziel] ?? leer;
      aktuell = ziel;
      t0 = ruhig() ? jetzt - DAUER : jetzt;
      weiter();
    };
    anstoss.current = () => { if (sichtbar) wechseln(); };

    messen();
    const ro = new ResizeObserver(() => { messen(); zeichnen(performance.now()); });
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => {
      sichtbar = e.isIntersecting;
      if (sichtbar) { wechseln(); weiter(); }
    }, { rootMargin: "80px" });
    io.observe(c);

    const bewegen = (e: PointerEvent) => {
      if (ruhig() || e.pointerType !== "mouse") return;
      const b = c.getBoundingClientRect();
      maus.x = e.clientX - b.left; maus.y = e.clientY - b.top; maus.an = true;
      weiter();
    };
    const verlassen = () => { maus.an = false; weiter(); };
    const wieder = () => weiter();
    if (lebendig) {
      c.addEventListener("pointermove", bewegen);
      c.addEventListener("pointerleave", verlassen);
    }
    window.addEventListener("st-ruhe", wieder);
    return () => {
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointermove", bewegen);
      c.removeEventListener("pointerleave", verlassen);
      window.removeEventListener("st-ruhe", wieder);
      if (raf) cancelAnimationFrame(raf);
      anstoss.current = () => {};
    };
  }, [motive, lebendig]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
