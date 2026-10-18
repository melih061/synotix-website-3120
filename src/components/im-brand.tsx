"use client";

import { useId } from "react";

/* Synotix-Signet: zwei gegenläufige Chevrons (Doppel-Chevron aus dem Logo-System). */
const CHEVRONS = ["M22 14 L88 46 L22 78", "M98 62 L32 94 L98 126"];

/* Hero: zweiter Chevron tiefer, damit sich die Konturringe nicht berühren */
const HERO_CHEVRONS = ["M22 10 L88 42 L22 74", "M98 88 L32 120 L98 152"];

const GRADIENT_STOPS = [
  { offset: "0%", color: "#3E5BA6" },
  { offset: "48%", color: "#3E5BA6" },
  { offset: "100%", color: "#DCE6FA" },
];

/** Kleines, gefülltes Signet für Navigation und Footer. */
export function SynotixMark({ size = 28, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} width={size} height={size * 1.08} viewBox="8 0 104 140" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          {GRADIENT_STOPS.map((s) => <stop key={s.offset} offset={s.offset} stopColor={s.color} />)}
        </linearGradient>
      </defs>
      {CHEVRONS.map((d) => (
        <path key={d} d={d} fill="none" stroke={`url(#g${id})`} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

/** Logo-Lockup: Signet + Wortmarke. */
export function SynotixLogo({ className }: { className?: string }) {
  return (
    <span className={`im-logo ${className ?? ""}`}>
      <SynotixMark size={26} />
      <span className="im-logo-word">Synotix</span>
    </span>
  );
}

/**
 * Großes Hero-Signet aus konzentrischen Linien.
 * Technik: Maske aus abwechselnd weißen/schwarzen Strichen abnehmender Breite
 * → gleichmäßige Konturringe um die Chevron-Linien; darunter liegt ein Verlauf.
 */
export function HeroMark({ className, rings = 7 }: { className?: string; rings?: number }) {
  const id = useId().replace(/:/g, "");
  const step = 3.2;
  const widths = Array.from({ length: rings * 2 }, (_, i) => (rings * 2 - i) * step);
  return (
    <svg className={className} viewBox="-6 -16 132 194" aria-hidden="true">
      <defs>
        <linearGradient id={`hg${id}`} x1="0" y1="0" x2="1" y2="0.35">
          {GRADIENT_STOPS.map((s) => <stop key={s.offset} offset={s.offset} stopColor={s.color} />)}
        </linearGradient>
        <mask id={`hm${id}`} maskUnits="userSpaceOnUse" x="-6" y="-16" width="132" height="194">
          {widths.map((w, i) =>
            HERO_CHEVRONS.map((d) => (
              <path
                key={`${i}-${d}`}
                className="im-ring"
                d={d}
                pathLength={1}
                fill="none"
                stroke={i % 2 === 0 ? "#fff" : "#000"}
                strokeWidth={w}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )),
          )}
        </mask>
      </defs>
      <rect x="-6" y="-16" width="132" height="194" fill={`url(#hg${id})`} mask={`url(#hm${id})`} />
    </svg>
  );
}
