"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Linke Grafik bleibt beim Scrollen stehen, rechts läuft der Text.
   Die Linien-Zeichnung wechselt mit dem aktiven Abschnitt. */

function zahnrad(): string {
  const n = 12, r1 = 92, r2 = 112, pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.28) / n) * Math.PI * 2, a2 = ((i + 0.5) / n) * Math.PI * 2, a3 = ((i + 0.78) / n) * Math.PI * 2;
    for (const [a, r] of [[a0, r1], [a1, r2], [a2, r2], [a3, r1]] as const) pts.push(`${(150 + Math.cos(a) * r).toFixed(1)},${(150 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

const ZAHNRAD = zahnrad();

const P = { pathLength: 1 } as const;

const ZEICHNUNGEN: ReactNode[] = [
  // Analyse: Beleg mit Lupe
  <g key="a">
    <rect {...P} x="60" y="40" width="130" height="180" />
    <path {...P} d="M82 80h86M82 104h86M82 128h60M82 152h86" />
    <circle {...P} cx="185" cy="185" r="48" />
    <circle {...P} cx="185" cy="185" r="34" />
    <path {...P} d="m220 220 46 46" />
  </g>,
  // Lösung: Zahnrad
  <g key="b">
    <path {...P} d={ZAHNRAD} />
    <circle {...P} cx="150" cy="150" r="52" />
    <circle {...P} cx="150" cy="150" r="22" />
  </g>,
  // Schulung: Tafel mit Vortragenden
  <g key="c">
    <rect {...P} x="40" y="50" width="220" height="130" />
    <path {...P} d="M64 86h110M64 110h140M64 134h90" />
    <path {...P} d="M150 180v70M110 250h80" />
    <circle {...P} cx="222" cy="142" r="12" />
    <path {...P} d="M204 176c2-14 8-20 18-20s16 6 18 20" />
  </g>,
  // Begleitung: Rettungsring
  <g key="d">
    <circle {...P} cx="150" cy="150" r="108" />
    <circle {...P} cx="150" cy="150" r="56" />
    <path {...P} d="m74 74 38 38M226 74l-38 38M74 226l38-38M226 226l-38-38" />
  </g>,
];

const PUNKTE = [
  { titel: "Analyse & Strategie", text: "Wir nehmen einen Ablauf in Ihrem Betrieb genau auf und sagen offen, ob sich KI dort lohnt, auch wenn die Antwort „noch nicht“ lautet.", liste: ["Ablauf, Daten und Systeme aufnehmen", "Ausgangswert gemeinsam festlegen", "Empfehlung für den nächsten Schritt"] },
  { titel: "Maßgeschneiderte Lösungen", text: "Wir bauen ein Werkzeug genau für diesen Ablauf. Es fügt sich in Ihre Systeme ein und hat die Freigabe durch Menschen eingebaut.", liste: ["Klar abgegrenzter Umfang", "Abnahme nach vereinbarten Kriterien", "Anbindung an vorhandene Systeme"] },
  { titel: "Schulung & Enablement", text: "Ihr Team lernt KI an den eigenen Vorgängen, nicht an Beispielen von anderswo.", liste: ["Workshops für Fachbereiche", "Eigene Fälle statt Theorie", "Regeln für den sicheren Einsatz"] },
  { titel: "Begleitung", text: "Nach der Abnahme bleiben wir in vereinbarten Grenzen ansprechbar und passen an, wenn sich etwas ändert.", liste: ["Feste Ansprechperson", "Pflege nach Absprache", "Jeder Abschnitt gesondert vereinbart"] },
];

export function StLeistungen() {
  const [aktiv, setAktiv] = useState(0);
  const punkte = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) if (e.isIntersecting) setAktiv(punkte.current.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    punkte.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <div className="st-kleben">
      <div className="st-kleben-bild" aria-hidden="true">
        <svg viewBox="0 0 300 300">
          {ZEICHNUNGEN.map((z, i) => <g key={i} className={`st-zeichnung${aktiv === i ? " st-ein" : ""}`}>{z}</g>)}
        </svg>
        <span className="st-zaehler">{aktiv + 1} / {PUNKTE.length}</span>
      </div>
      <div className="st-kleben-text">
        {PUNKTE.map((p, i) => (
          <article key={p.titel} ref={(el) => { punkte.current[i] = el; }} className={`st-punkt${aktiv === i ? " st-aktiv" : ""}`}>
            <svg className="st-inline" viewBox="0 0 300 300" aria-hidden="true"><g className="st-zeichnung st-ein">{ZEICHNUNGEN[i]}</g></svg>
            <h3>{p.titel}</h3>
            <p>{p.text}</p>
            <ul role="list">{p.liste.map((l) => <li key={l}>{l}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}
