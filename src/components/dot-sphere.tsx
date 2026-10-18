"use client";

import { useEffect, useRef } from "react";

/**
 * Rotierende Punkt-Sphäre (Celonis-Stil) auf Canvas.
 * Fibonacci-Verteilung, weiße Dots mit tiefenabhängiger Größe/Alpha.
 * DPR-scharf, ResizeObserver, respektiert prefers-reduced-motion.
 * Performance: Punkte als fillRect (statt arc-Pfad), Culling außerhalb des
 * Canvas, 30 fps, mobil weniger Punkte, Start erst im Leerlauf (schont LCP/TBT).
 */
export function DotSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Punkte auf Einheitssphäre (Fibonacci) ──
    const COUNT = window.innerWidth < 800 ? 600 : 1000;
    const pts: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    let w = 0, h = 0, dpr = 1;
    // Vor resize() deklarieren: bei reduced-motion zeichnet resize() sofort (sonst TDZ-Fehler).
    let raf = 0;
    let angle = 0;
    let visible = true;
    const tilt = -0.42; // leichte Neigung der Achse
    const parent = canvas.parentElement;

    function resize() {
      const rect = parent?.getBoundingClientRect();
      w = rect?.width ?? window.innerWidth;
      h = rect?.height ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Bei reduced-motion gibt es keinen Loop → nach Resize einmal neu zeichnen
      if (reduced) draw();
    }
    resize();

    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Sphäre groß, Zentrum unten (Dome ragt in den Hero) — wie Celonis
      const radius = Math.min(w * 0.46, h * 0.95);
      const cx = w * 0.5;
      const cy = h * 1.02;

      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);

      ctx.fillStyle = "#fff";
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Rotation um Y-Achse
        const x = p.x * cosA - p.z * sinA;
        let z = p.x * sinA + p.z * cosA;
        let y = p.y;
        // Neigung um X-Achse
        const y2 = y * cosT - z * sinT;
        const z2 = y * sinT + z * cosT;
        y = y2; z = z2;

        const sx = cx + x * radius;
        const sy = cy + y * radius;
        if (sy > h + 2 || sy < -2 || sx < -2 || sx > w + 2) continue;

        // Tiefe: z ∈ [-1,1] → vorne (z>0) heller & größer
        const depth = (z + 1) / 2;
        const size = 0.35 + depth * 1.75;
        const alpha = 0.06 + depth * depth * 0.7;

        ctx.globalAlpha = alpha;
        ctx.fillRect(sx - size * 0.5, sy - size * 0.5, size, size);
      }
      ctx.globalAlpha = 1;

    }

    let last = 0;
    let started = false; // wird im Leerlauf gesetzt (siehe unten)
    function loop(t: number) {
      // auf ~30 fps drosseln: halbe Zeichenlast bei kaum sichtbarem Unterschied
      if (t - last >= 32) {
        draw();
        angle += 0.0032;
        last = t;
      }
      if (!reduced && visible) raf = requestAnimationFrame(loop);
    }

    // Animation pausieren, wenn die Sphäre nicht im Viewport ist (spart CPU)
    const io = new IntersectionObserver(
      entries => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !reduced && started) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Erst starten, wenn der Browser untätig ist (Hero-Text und Fonts zuerst)
    const w8 = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const start = () => { started = true; if (reduced) draw(); else raf = requestAnimationFrame(loop); };
    const idle = w8.requestIdleCallback ? w8.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 600);

    return () => {
      if (w8.cancelIdleCallback) w8.cancelIdleCallback(idle); else window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
