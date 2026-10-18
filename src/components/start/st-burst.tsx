"use client";

import { useEffect, useRef } from "react";

/* Feine Linien, die aus der Mitte schießen und danach ruhig "atmen".
   Eigene Umsetzung nach der von Melih gelieferten LogoBurst-Vorlage:
   gleicher Aufbau (Tentakel mit Spitzen und Mittelpunkten), aber ohne Theme-Wechsel,
   mit Pause außerhalb des Bildschirms, Pause-Knopf (st-ruhe) und festem Endbild bei reduzierter Bewegung. */

type Tentakel = {
  angle: number; length: number; width: number; alpha: number; delay: number; grow: number;
  phase: number; tip: boolean; tipSize: number; tipOvershoot: number;
  mids: { t: number; size: number; alpha: number }[];
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOutQuart = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 4);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bauen(count: number, seed: number, particleRatio: number): Tentakel[] {
  const r = mulberry32(seed);
  const out: Tentakel[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (r() - 0.5) * Math.PI * 2 * 0.018;
    const roll = r();
    const length = roll < 0.12 ? 0.22 + r() * 0.18 : roll < 0.78 ? 0.48 + r() * 0.32 : 0.78 + r() * 0.22;
    const tip = r() < particleRatio;
    const midCount = r() < 0.22 ? 2 : r() < 0.48 ? 1 : 0;
    const mids: Tentakel["mids"] = [];
    for (let m = 0; m < midCount; m++) mids.push({ t: 0.28 + r() * 0.52, size: 0.55 + r() * 0.7, alpha: 0.28 + r() * 0.38 });
    out.push({
      angle, length: clamp(length, 0.16, 1), width: 0.35 + r() * 0.85, alpha: 0.22 + r() * 0.55,
      delay: r() * 0.42 + (i / count) * 0.08, grow: 0.55 + r() * 0.7, phase: r() * Math.PI * 2,
      tip, tipSize: 0.85 + r() * 1.35, tipOvershoot: tip && r() < 0.35 ? 0.018 + r() * 0.05 : 0, mids,
    });
  }
  return out;
}

const DAUER = 1.4;
const RADIUS = 0.5;
const KERN = 60; // freier Innenkreis in px

export function StBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !parent || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const klein = window.innerWidth < 700;
    const tentakel = bauen(klein ? 190 : 300, 23, 0.62);
    const size = { w: 0, h: 0 };
    let sichtbar = true;
    let ruhe = document.documentElement.dataset.stRuhe === "an";
    let settled = reduce;
    const start = performance.now();
    let raf = 0;

    const farbe = (a: number) => `rgba(214,220,236,${clamp(a, 0, 1)})`;

    function zeichnen(now: number) {
      const { w, h } = size;
      if (!w || !h) return;
      const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * RADIUS, inner = Math.min(maxR * 0.92, KERN);
      const s = now / 1000;
      const atmen = settled && !reduce && !ruhe;
      const feld = atmen ? Math.sin(s * 0.92) * 0.015 : 0;
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";
      let fertig = true;

      for (const t of tentakel) {
        const p = settled ? 1 : easeOutQuart(((now - start) / 1000 - t.delay * DAUER) / (DAUER * t.grow));
        if (p < 1) fertig = false;
        const sc = 1 + feld + (atmen ? Math.sin(s * 1.28 + t.phase) * 0.018 : 0);
        const reach = inner + (maxR - inner) * t.length * p * sc;
        if (reach <= inner + 0.4) continue;
        const fade = atmen ? 0.9 + 0.1 * Math.sin(s * 0.92 + t.phase * 0.35) : 1;
        const c = Math.cos(t.angle), n = Math.sin(t.angle);
        ctx!.beginPath();
        ctx!.moveTo(cx + c * inner, cy + n * inner);
        ctx!.lineTo(cx + c * reach, cy + n * reach);
        ctx!.strokeStyle = farbe(t.alpha * (0.55 + p * 0.45) * fade);
        ctx!.lineWidth = t.width;
        ctx!.stroke();
        for (const m of t.mids) {
          if (p < m.t) continue;
          const mr = inner + (maxR - inner) * t.length * m.t * sc;
          ctx!.beginPath(); ctx!.arc(cx + c * mr, cy + n * mr, m.size, 0, Math.PI * 2);
          ctx!.fillStyle = farbe(m.alpha * fade); ctx!.fill();
        }
        if (t.tip && p > 0.92) {
          const tr = inner + (maxR - inner) * t.length * (1 + t.tipOvershoot) * sc;
          const ap = clamp((p - 0.92) / 0.08, 0, 1);
          ctx!.beginPath();
          ctx!.arc(cx + c * tr, cy + n * tr, t.tipSize * (atmen ? 1 + 0.1 * Math.sin(s * 1.28 + t.phase) : 1), 0, Math.PI * 2);
          ctx!.fillStyle = farbe(0.78 * ap * fade); ctx!.fill();
        }
      }
      if (!reduce && fertig) settled = true;
    }

    // Die Schleife läuft nur, solange sich etwas bewegt: sichtbar, nicht pausiert, nicht reduziert.
    const loop = (now: number) => {
      raf = 0;
      if (!sichtbar) return;
      zeichnen(now);
      if (!reduce && !(ruhe && settled)) raf = requestAnimationFrame(loop);
    };
    const an = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = parent.clientWidth; size.h = parent.clientHeight;
      canvas.width = Math.floor(size.w * dpr); canvas.height = Math.floor(size.h * dpr);
      canvas.style.width = `${size.w}px`; canvas.style.height = `${size.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      an();
    };
    const onRuhe = () => { ruhe = document.documentElement.dataset.stRuhe === "an"; an(); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    const io = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; if (sichtbar) an(); }, { threshold: 0 });
    io.observe(parent);
    window.addEventListener("st-ruhe", onRuhe);
    an();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("st-ruhe", onRuhe); };
  }, []);

  return (
    <div className="st-burst" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="st-burst-kern"><i /></span>
    </div>
  );
}
