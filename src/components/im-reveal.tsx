"use client";

import { useEffect } from "react";

/**
 * Blendet Elemente mit [data-reveal] beim Hineinscrollen weich ein.
 * Versteckt wird erst, wenn JS läuft (Klasse am <html>), damit Inhalte ohne JS
 * sichtbar bleiben. Bei prefers-reduced-motion passiert nichts.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // Was beim Laden schon im Viewport ist, sofort zeigen (kein Flackern im Hero)
    const vh = window.innerHeight;
    items.forEach((el) => { if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-in"); });
    root.classList.add("im-js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      // Oben unbegrenzt: Auch beim schnellen Überspringen gilt alles oberhalb der
      // Viewport-Unterkante als „gesehen“ und wird eingeblendet.
      { rootMargin: "100000px 0px -6% 0px", threshold: 0 },
    );
    items.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("im-js-reveal");
    };
  }, []);
  return null;
}
