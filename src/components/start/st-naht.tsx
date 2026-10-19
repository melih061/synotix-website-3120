"use client";

import { useEffect, useRef } from "react";

const HOEHE = 56;
const ZEILEN = 8;
const ZEILE = HOEHE / ZEILEN;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Übergang zwischen zwei Flächen: Zeilen aus kurzen "Datenpaketen", die nach unten dichter werden,
    bis die nächste Fläche beginnt. Ein blaues Paket steht für die Freigabe. Rein dekorativ. */
export function StNaht({ von, nach }: { von: string; nach: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const zeichnen = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, c.clientWidth);
      c.width = Math.round(w * dpr);
      c.height = Math.round(HOEHE * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = von;
      g.fillRect(0, 0, w, HOEHE);
      g.fillStyle = nach;
      for (let k = 0; k < ZEILEN; k++) {
        const y = k * ZEILE;
        if (k === ZEILEN - 1) { g.fillRect(0, y, w, ZEILE); continue; }
        const dicke = 2 + k * 0.7;
        const dichte = 0.18 + 0.12 * k;
        const r = mulberry32(1000 + k * 77);
        let x = -r() * 30;
        while (x < w) {
          const laenge = 6 + r() * 42;
          if (r() < dichte) g.fillRect(Math.round(x), y + (ZEILE - dicke) / 2, Math.round(laenge), dicke);
          x += laenge + 4 + r() * 10;
        }
      }
      // das eine blaue Paket: die Freigabe
      g.fillStyle = "#3B6BF5";
      g.fillRect(Math.round(w * 0.62), 3 * ZEILE + (ZEILE - 4) / 2, 44, 4);
    };
    zeichnen();
    const ro = new ResizeObserver(zeichnen);
    ro.observe(c);
    return () => ro.disconnect();
  }, [von, nach]);

  return <canvas ref={ref} className="st-naht" aria-hidden="true" style={{ background: `linear-gradient(${von}, ${nach})` }} />;
}
