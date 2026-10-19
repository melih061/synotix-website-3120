"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── the curved row ──────────────────────────────────────────────
 * Scroll Tilted Grid turned on its side, with the tilt drawn as a curve.
 * One row of tiles runs around the inside of a cylinder. The centre faces
 * you flat, the ends bend toward you so each end tile curves along its
 * length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into `slices` vertical strips,
 * each a flat facet of the cylinder showing its share of the tile. The
 * strips sit still inside their tile, each turned its own few degrees
 * round the cylinder's axis, and the tile (preserve-3d) is what moves: one
 * rotateY about that same axis carries the whole tile along the arc.
 *
 * Synotix version: the row is driven by the page scroll, not by a clock.
 * `scrollRef` points at a tall wrapper; while the wrapper scrolls past, the
 * row advances so that every tile reaches the centre once, in order.
 * Each tile rests briefly in the centre; between tiles the row eases on.
 * When the page stands still, the row drifts very gently around that
 * position. Only transforms and visibility are written per frame.
 * ─────────────────────────────────────────────────────────────── */

// Camera distance from the screen, as a multiple of the cylinder's radius.
const CAMERA = 1.6;

/**
 * Cylinder radius, as a share of the hero's width, that puts the frame's
 * edge `bend` radians round the arc as seen through the camera:
 * r·sinθ · CAMERA / (CAMERA − 1 + cosθ) = width / 2, solved for r.
 */
function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number,
  maxWidth: number,
) {
  const h = Math.min(
    (tile / 100) * height,
    ((maxWidth / 100) * width) / aspect,
  );
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0))
    return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
  };
}

export type TiltedGridTile = {
  /** Drawn content of the tile. Sized in `em`; 1em follows the tile height. */
  content: React.ReactNode;
  /** Plain-text version for screen readers (the band itself is aria-hidden). */
  label: string;
};

export type TiltedGridHeroProps = {
  /** Tiles along the row, e.g. info cards. */
  tiles: TiltedGridTile[];
  /**
   * Tall wrapper whose scroll position drives the row. Its first child is the
   * pinned (sticky) box. Without it the row stays on the first tile.
   */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** Distance of the pinned box from the viewport's top, in px (fixed header). @default 72 */
  pinTop?: number;
  /** Idle drift: how far the centre tile floats to each side, in px. 0 turns it off. @default 10 */
  sway?: number;
  /** Called with the index of the tile in the centre whenever it changes. */
  onIndex?: (index: number) => void;
  /** Called every frame with the progress through the tiles, 0 … 1. */
  onProgress?: (progress: number) => void;
  /** Strips per tile. Fewer is lighter on phones; fewer than ~8 shows corners. @default 16 */
  slices?: number;
  /** A tile is never wider than this share of the hero, in percent. @default 55 */
  maxWidth?: number;
  /** Tile height, as a percentage of the hero's height. @default 26 */
  tileHeight?: number;
  /** Tile width divided by tile height. @default 16 / 9 */
  aspectRatio?: number;
  /** Space between tiles, as a percentage of a tile's height. @default 6 */
  gap?: number;
  /** Vertical centre of the row, as a percentage of the hero's height. @default 56 */
  axis?: number;
  /** How far the row has bent round by the frame's edge, in degrees (5–85). @default 80 */
  curve?: number;
  /** Width of the fade at each end, as a percentage of the hero's width. @default 12 */
  fade?: number;
  /** Class for every strip's background (the tile's base colour). */
  tileClassName?: string;
  /** id of the heading that names the screen-reader list of tiles. */
  labelledBy?: string;
  children?: React.ReactNode;
  className?: string;
};

export function TiltedGridHero({
  tiles,
  scrollRef,
  pinTop = 72,
  sway = 10,
  onIndex,
  onProgress,
  slices = 16,
  maxWidth = 55,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  tileClassName = "bg-[#08080A]",
  labelledBy,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const tileEls = React.useRef<(HTMLDivElement | null)[]>([]);
  const onIndexRef = React.useRef(onIndex);
  const onProgressRef = React.useRef(onProgress);
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;
  const count = tiles.length;

  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(
    null,
  );
  const [shown, setShown] = React.useState<number[]>([]);

  React.useEffect(() => {
    onIndexRef.current = onIndex;
    onProgressRef.current = onProgress;
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend, maxWidth);
      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit
          ? prev
          : next,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend, maxWidth]);

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;

  // Motion. Time T is measured in "pitches" (one tile's spacing); a tile at time
  // T sits at phase T + its index. T follows a critically damped spring toward
  // a target taken from the scroll position, so it always moves on from where
  // it is, carries its velocity and never overshoots.
  React.useEffect(() => {
    const root = ref.current;
    if (!root || !layout || count === 0) return;
    const { columns, sweep, limit } = layout;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const turn = (deg: number) =>
      `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

    // Whole laps are added so time never goes negative; count × columns keeps
    // the card order intact (tile k of lap n shows card n·columns + first).
    const base = count * columns;
    const offset = 1 - columns / 2;
    const centre = (c: number) => base + c + offset;
    const ruhig = () => document.documentElement.dataset.stRuhe === "an";

    // Scroll position → card position. Inside the pinned stretch every card
    // rests for a moment in the centre and the change between two cards eases
    // in and out (smootherstep). Before and after the stretch the row keeps
    // moving linearly, so the cards glide in from the right and out to the left.
    const REST = 0.12;
    const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const dwell = (x: number) => {
      if (x <= 0 || x >= count - 1) return x;
      const s = Math.floor(x);
      const f = x - s;
      const g = f <= REST ? 0 : f >= 1 - REST ? 1 : smoother((f - REST) / (1 - 2 * REST));
      return s + g;
    };
    const position = () => {
      const wrap = scrollRef?.current;
      if (!wrap) return 0;
      const box = wrap.getBoundingClientRect();
      const pinned = (wrap.firstElementChild as HTMLElement | null)?.getBoundingClientRect().height ?? 0;
      const u = (pinTop - box.top) / Math.max(1, box.height - pinned);
      return clamp(dwell(u * (count - 1)), -3, count + 2);
    };

    const cur: number[] = Array.from({ length: columns }, () => -1);
    const dims: number[] = Array.from({ length: columns }, () => -1);
    let lastIndex = -1;
    const start = reduce ? Math.min(3, count - 1) : position();
    let T = centre(start);
    let v = 0; // pitches per second
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const apply = () => {
      let changed = false;
      const cpos = T - base - offset; // card position now in the centre
      const lean = clamp(-v * 0.5, -2, 2);
      for (let t = 0; t < columns; t++) {
        const el = tileEls.current[t];
        if (!el) continue;
        const tau = T + t;
        const lap = Math.floor(tau / columns);
        const frac = tau / columns - lap;
        const angle = -sweep + 2 * sweep * frac;
        const raw = lap * columns + (columns - 1 - t);
        const seq = raw - base; // 0 … count−1 for real cards, outside = empty
        const k = clamp(Math.abs(seq - cpos), 0, 1);
        const focus = k * k * (3 - 2 * k);
        const dim = seq < 0 || seq >= count ? 0 : 1 - 0.8 * focus;
        el.style.transform = `${turn(angle)} rotateX(${lean.toFixed(3)}deg)`;
        el.style.visibility = Math.abs(angle) > limit || dim < 0.01 ? "hidden" : "visible";
        if (Math.abs(dim - dims[t]) > 0.004) {
          dims[t] = dim;
          el.style.setProperty("--tgh-dim", dim.toFixed(3));
        }
        const idx = ((raw % count) + count) % count;
        if (idx !== cur[t]) {
          cur[t] = idx;
          changed = true;
        }
      }
      if (changed) setShown([...cur]);
    };

    // Response ≈ 0.42 s, damping ratio 1 (critically damped).
    const OMEGA = (2 * Math.PI) / 0.42;
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      const x = position();
      const ci = Math.round(clamp(x, 0, count - 1));
      if (ci !== lastIndex) {
        lastIndex = ci;
        onIndexRef.current?.(ci);
      }
      onProgressRef.current?.(clamp(x / Math.max(1, count - 1), 0, 1));

      // Idle drift: two slow, unrelated sines give a calm, non-repeating float.
      // Given in px at the centre, converted to degrees on the cylinder, then pitches.
      const rpx = (r / 100) * root.clientWidth;
      const pitchDeg = (2 * sweep) / columns;
      const amp = ruhig() || !(rpx > 0) ? 0 : ((sway / rpx) * (180 / Math.PI)) / pitchDeg;
      const s = now / 1000;
      const drift = amp * (0.62 * Math.sin(s * 0.53) + 0.38 * Math.sin(s * 0.29 + 1.3));

      const target = centre(x) + drift;
      const x0 = T - target;
      const e = Math.exp(-OMEGA * dt);
      const tmp = (v + OMEGA * x0) * dt;
      T = target + (x0 + tmp) * e;
      v = (v - OMEGA * tmp) * e;
      apply();
      if (visible && (amp > 0 || Math.abs(target - T) > 0.0002 || Math.abs(v) > 0.001)) {
        raf = requestAnimationFrame(tick);
      }
    };
    const kick = () => {
      if (reduce || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    apply();
    if (reduce) {
      onIndexRef.current?.(Math.min(3, count - 1));
      return;
    }
    kick();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(root);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("st-ruhe", kick);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("st-ruhe", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [layout, count, radius, r, scrollRef, pinTop, sway]);

  const { columns, unit } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend, maxWidth);

  const size = `min(${tileHeight}cqh, ${+(maxWidth / aspectRatio).toFixed(4)}cqw)`;
  const u = (n: number) => `calc(${+n.toFixed(4)} * ${size})`;

  const turnStatic = (deg: number) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  const share = aspectRatio / slices;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent)`;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{ containerType: "size", ...props.style }}
    >
      <div
        aria-hidden
        className="tgh-band pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const index = shown[t] ?? (columns - 1 - t) % Math.max(count, 1);
          const custom = tiles[index];
          return (
            <div
              key={t}
              ref={(el) => {
                tileEls.current[t] = el;
              }}
              className="st-kurve-kachel absolute"
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                visibility: "hidden",
              }}
            >
              {Array.from({ length: slices }, (_, k) => (
                <div
                  key={k}
                  className={cn(
                    "absolute top-0 overflow-hidden",
                    tileClassName,
                    k === 0 && "rounded-l-xl",
                    k === slices - 1 && "rounded-r-xl",
                  )}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    width:
                      k === slices - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turnStatic(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit,
                    ),
                  }}
                >
                  {custom ? (
                    <div
                      className="absolute top-0"
                      style={{
                        left: u(-k * share),
                        width: u(aspectRatio),
                        height: u(1),
                        // 1em is a tenth of the tile height, so card
                        // content scales with the tile.
                        fontSize: u(0.1),
                        // Focus dimming lives on the flat content, never on the
                        // preserve-3d tile (opacity there would flatten the 3D).
                        // Brightness, not opacity: the strips overlap by 1px,
                        // and translucent strips would show that as seams.
                        filter: "brightness(var(--tgh-dim, 1))",
                      }}
                    >
                      {custom.content}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {children}

      {/* After the children, so the heading is read before the tiles. */}
      <ul className="st-sr tgh-sr" role="list" aria-labelledby={labelledBy}>
        {tiles.map((t) => (
          <li key={t.label}>{t.label}</li>
        ))}
      </ul>
    </div>
  );
}

export default TiltedGridHero;
