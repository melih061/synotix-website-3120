"use client";

import { useEffect, useRef } from "react";

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

/** Pixel-Übergang zwischen zwei Flächen (geordnetes Raster). Rein dekorativ. */
export function StNaht({ von, nach }: { von: string; nach: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const zeichnen = () => {
      const w = Math.max(1, Math.ceil(c.clientWidth / 8)), h = 5;
      c.width = w; c.height = h;
      g.fillStyle = von; g.fillRect(0, 0, w, h);
      g.fillStyle = nach;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if ((y + 0.5) / h > (BAYER[y & 3][x & 3] + 0.5) / 16) g.fillRect(x, y, 1, 1);
    };
    zeichnen();
    const ro = new ResizeObserver(zeichnen);
    ro.observe(c);
    return () => ro.disconnect();
  }, [von, nach]);

  return <canvas ref={ref} className="st-naht" aria-hidden="true" style={{ background: `linear-gradient(${von}, ${nach})` }} />;
}
