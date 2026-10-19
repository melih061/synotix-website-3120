"use client";

import { useEffect, useRef, useState } from "react";
import { analyse, begleitung, loesung, schulung, type Motiv } from "./st-motive";
import { StPixelBild } from "./st-pixelbild";

/* Linke Grafik bleibt beim Scrollen stehen, rechts läuft der Text.
   Die Pixel-Grafik baut sich beim Wechsel des Abschnitts Pixel für Pixel um. */

const MOTIVE: Motiv[] = [analyse, loesung, schulung, begleitung];

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
        <StPixelBild motive={MOTIVE} index={aktiv} className="st-pixel" />
        <span className="st-zaehler">{aktiv + 1} / {PUNKTE.length}</span>
      </div>
      <div className="st-kleben-text">
        {PUNKTE.map((p, i) => (
          <article key={p.titel} ref={(el) => { punkte.current[i] = el; }} className={`st-punkt${aktiv === i ? " st-aktiv" : ""}`}>
            <StPixelBild motive={MOTIVE} index={i} lebendig={false} className="st-pixel st-inline" />
            <h3>{p.titel}</h3>
            <p>{p.text}</p>
            <ul role="list">{p.liste.map((l) => <li key={l}>{l}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}
