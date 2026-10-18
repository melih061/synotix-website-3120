"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const KOPFHOEHE = 72;

/** Weiches Scrollen nur auf der Startseite. Bei reduzierter Bewegung bleibt das normale Scrollen. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // lerp: je höher, desto schneller folgt die Seite dem Mausrad (Standard wäre 0.1).
    const lenis = new Lenis({ lerp: 0.2, wheelMultiplier: 1.1, smoothWheel: true });
    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Sprünge zu Ankern (#kontakt usw.) laufen ebenfalls weich und stoppen unter der festen Kopfzeile.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const id = a?.getAttribute("href")?.slice(1);
      if (!a || !id) return;
      const ziel = document.getElementById(id);
      if (!ziel) return;
      e.preventDefault();
      lenis.scrollTo(ziel, { offset: -KOPFHOEHE, duration: 0.7 });
      history.replaceState(history.state, "", `#${id}`);
      ziel.setAttribute("tabindex", "-1");
      ziel.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
