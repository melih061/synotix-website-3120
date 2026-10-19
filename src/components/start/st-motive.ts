/* Motive für die Pixel-Grafiken der Startseite. Jedes Motiv zeichnet sich weiß auf Schwarz in einen
   300 × 300 großen Raum; Helligkeit wird später zu Pixeldichte (geordnetes Raster). Reines Blau (#00F)
   markiert die wenigen Akzent-Pixel. Keine Fotos, nur Formen aus dem Alltag eines Betriebs. */

export type Motiv = (g: CanvasRenderingContext2D) => void;

const W = (a: number) => `rgba(255,255,255,${a})`;
const AKZENT = "#0000FF";

function linien(g: CanvasRenderingContext2D, d: string, breite: number, farbe = W(1)) {
  g.strokeStyle = farbe;
  g.lineWidth = breite;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.stroke(new Path2D(d));
}

function verlauf(g: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, a: number, b: number) {
  const v = g.createLinearGradient(x0, y0, x1, y1);
  v.addColorStop(0, W(a));
  v.addColorStop(1, W(b));
  return v;
}

function zahnradPfad(): string {
  const n = 12, r1 = 92, r2 = 114, pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (k: number) => ((i + k) / n) * Math.PI * 2;
    for (const [w, r] of [[a(0), r1], [a(0.28), r2], [a(0.5), r2], [a(0.78), r1]] as const)
      pts.push(`${(150 + Math.cos(w) * r).toFixed(1)},${(150 + Math.sin(w) * r).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}
const ZAHNRAD = zahnradPfad();

/** Beleg: Rechnung mit Zeilen, eine Zeile weicht ab (Akzent). */
export const beleg: Motiv = (g) => {
  g.fillStyle = verlauf(g, 0, 40, 0, 260, 0.42, 0.12);
  g.fillRect(78, 34, 150, 232);
  linien(g, "M78 34h150v232H78z", 5);
  linien(g, "M100 70h70", 9);
  linien(g, "M100 108h106M100 132h106M100 180h106M100 204h80", 5, W(0.85));
  g.fillStyle = AKZENT;
  g.fillRect(96, 151, 114, 13);
  linien(g, "M184 236h22", 7);
};

/** E-Mail-Eingang: Umschlag, darüber zwei Nachrichten, die einsortiert werden. */
export const brief: Motiv = (g) => {
  g.fillStyle = verlauf(g, 0, 120, 0, 250, 0.4, 0.1);
  g.fillRect(50, 120, 200, 130);
  linien(g, "M50 120h200v130H50z", 5);
  linien(g, "m50 124 100 72 100-72", 5);
  linien(g, "m50 246 72-58M250 246l-72-58", 4, W(0.7));
  g.fillStyle = W(0.85);
  g.fillRect(96, 54, 108, 10);
  g.fillRect(118, 80, 64, 10);
  g.fillStyle = AKZENT;
  g.fillRect(142, 24, 16, 16);
};

/** Wissen im Betrieb: Knoten, die Handbuch, Anleitung und Zeichnung verbinden. */
export const netz: Motiv = (g) => {
  linien(g, "M86 92 214 112M86 92l54 120M214 112l-74 100M214 112l30 116M140 212l104 16", 4, W(0.65));
  const knoten: [number, number, number, number][] = [[86, 92, 26, 0.9], [214, 112, 30, 0.75], [140, 212, 24, 0.85], [244, 228, 13, 1]];
  for (const [x, y, r, a] of knoten) {
    const v = g.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r);
    v.addColorStop(0, W(a));
    v.addColorStop(1, W(0.18));
    g.fillStyle = v;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = AKZENT;
  g.beginPath(); g.arc(244, 228, 8, 0, Math.PI * 2); g.fill();
};

/** Analyse: Dokument unter der Lupe, im Glas erscheinen die Zeilen größer. */
export const analyse: Motiv = (g) => {
  g.fillStyle = verlauf(g, 0, 30, 0, 230, 0.36, 0.08);
  g.fillRect(52, 30, 136, 196);
  linien(g, "M52 30h136v196H52z", 5);
  linien(g, "M74 70h90M74 96h90M74 122h60", 5, W(0.8));
  const v = g.createRadialGradient(176, 172, 6, 186, 184, 58);
  v.addColorStop(0, W(0.75));
  v.addColorStop(1, W(0.05));
  g.fillStyle = v;
  g.beginPath(); g.arc(186, 184, 56, 0, Math.PI * 2); g.fill();
  linien(g, "M156 174h56M156 198h40", 9);
  g.strokeStyle = W(1); g.lineWidth = 7;
  g.beginPath(); g.arc(186, 184, 56, 0, Math.PI * 2); g.stroke();
  g.fillStyle = AKZENT;
  g.fillRect(208, 190, 16, 16);
  linien(g, "m228 226 46 46", 14);
};

/** Lösung: Zahnrad, das sich in vorhandene Teile einfügt. */
export const loesung: Motiv = (g) => {
  const v = g.createRadialGradient(130, 120, 10, 150, 150, 120);
  v.addColorStop(0, W(0.7));
  v.addColorStop(1, W(0.12));
  g.fillStyle = v;
  g.fill(new Path2D(ZAHNRAD));
  linien(g, ZAHNRAD, 4);
  g.globalCompositeOperation = "destination-out";
  g.beginPath(); g.arc(150, 150, 46, 0, Math.PI * 2); g.fill();
  g.globalCompositeOperation = "source-over";
  linien(g, "M150 150m-46 0a46 46 0 1 0 92 0a46 46 0 1 0-92 0", 5);
  g.fillStyle = AKZENT;
  g.beginPath(); g.arc(150, 150, 14, 0, Math.PI * 2); g.fill();
};

/** Schulung: Tafel mit eigenem Ablauf, davor eine Person. */
export const schulung: Motiv = (g) => {
  g.fillStyle = verlauf(g, 40, 40, 260, 180, 0.34, 0.1);
  g.fillRect(36, 44, 228, 136);
  linien(g, "M36 44h228v136H36z", 5);
  linien(g, "M62 82h104M62 108h132M62 134h84", 6, W(0.85));
  g.fillStyle = AKZENT;
  g.fillRect(176, 100, 16, 16);
  linien(g, "M150 180v66M110 248h80", 5);
  const v = g.createRadialGradient(226, 196, 2, 230, 200, 22);
  v.addColorStop(0, W(1)); v.addColorStop(1, W(0.4));
  g.fillStyle = v;
  g.beginPath(); g.arc(230, 200, 18, 0, Math.PI * 2); g.fill();
  g.fillStyle = verlauf(g, 0, 224, 0, 290, 0.8, 0.2);
  g.beginPath(); g.moveTo(200, 290); g.quadraticCurveTo(202, 228, 230, 228); g.quadraticCurveTo(258, 228, 260, 290); g.fill();
};

/** Begleitung: Ring, der hält, mit Haltepunkten rundum. */
export const begleitung: Motiv = (g) => {
  const v = g.createRadialGradient(120, 110, 20, 150, 150, 120);
  v.addColorStop(0, W(0.75));
  v.addColorStop(1, W(0.1));
  g.fillStyle = v;
  g.beginPath(); g.arc(150, 150, 112, 0, Math.PI * 2); g.arc(150, 150, 60, 0, Math.PI * 2, true); g.fill();
  linien(g, "M150 150m-112 0a112 112 0 1 0 224 0a112 112 0 1 0-224 0M150 150m-60 0a60 60 0 1 0 120 0a60 60 0 1 0-120 0", 4);
  g.globalCompositeOperation = "destination-out";
  for (const w of [45, 135, 225, 315]) {
    g.save(); g.translate(150, 150); g.rotate((w * Math.PI) / 180); g.fillRect(58, -9, 58, 18); g.restore();
  }
  g.globalCompositeOperation = "source-over";
  g.fillStyle = AKZENT;
  g.beginPath(); g.arc(150, 38, 9, 0, Math.PI * 2); g.fill();
};

// 8 × 8 Bayer-Matrix für das geordnete Raster
const BAYER = (() => {
  const m = [[0, 2], [3, 1]];
  let b = m;
  for (let n = 2; n < 8; n *= 2) {
    const nb: number[][] = [];
    for (let y = 0; y < n * 2; y++) {
      nb.push([]);
      for (let x = 0; x < n * 2; x++) nb[y].push(4 * b[y % n][x % n] + m[Math.floor(y / n)][Math.floor(x / n)]);
    }
    b = nb;
  }
  return b.map((r) => r.map((v) => (v + 0.5) / 64));
})();

/** Rastert ein Motiv auf cols × rows Zellen: 0 = aus, 1 = weiß, 2 = Akzent. */
export function rastern(motiv: Motiv, cols: number, rows: number): Uint8Array {
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const g = c.getContext("2d", { willReadFrequently: true });
  const out = new Uint8Array(cols * rows);
  if (!g) return out;
  const s = Math.min(cols, rows) / 300;
  g.setTransform(s, 0, 0, s, (cols - 300 * s) / 2, (rows - 300 * s) / 2);
  motiv(g);
  const d = g.getImageData(0, 0, cols, rows).data;
  for (let i = 0; i < cols * rows; i++) {
    const r = d[i * 4], gr = d[i * 4 + 1], b = d[i * 4 + 2], a = d[i * 4 + 3] / 255;
    if (a < 0.05) continue;
    if (b > 160 && r < 90 && gr < 90) { out[i] = 2; continue; }
    const hell = (r / 255) * a;
    const x = i % cols, y = Math.floor(i / cols);
    if (hell > BAYER[y & 7][x & 7]) out[i] = 1;
  }
  return out;
}

/** Fester Zufallswert je Zelle (0 … 1), damit Übergänge bei jedem Laden gleich aussehen. */
export function zufall(i: number): number {
  let t = (i + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
