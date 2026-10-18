"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";

const STAGES = [
  {
    label: "Ausgangslage",
    title: "Den Rechnungseingang verstehen",
    text: "Wo Rechnungen ankommen, welche Felder heute geprüft werden und wer Entscheidungen trifft, bestimmt den sinnvollen Startpunkt.",
  },
  {
    label: "Prüfhilfen",
    title: "Auffälligkeiten sichtbar machen",
    text: "DataSynth kann Rechnungsdaten auslesen und vereinbarte Prüfhilfen, Abweichungen oder mögliche Duplikate für die Prüfung markieren.",
  },
  {
    label: "Freigabe",
    title: "Entscheidungen beim Menschen lassen",
    text: "Vor Import, Buchung oder Zahlung prüft und bestätigt ein Mensch das Ergebnis. DataSynth trifft keine endgültigen Entscheidungen.",
  },
  {
    label: "Übergabe",
    title: "Für die weitere Bearbeitung vorbereiten",
    text: "Die geprüften Daten können für einen DATEV-Export vorbereitet werden. Umfang und Freigaberegeln werden vor einem Einsatz gemeinsam festgelegt.",
  },
] as const;

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 60%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduceMotion) return;
    setActiveStage(Math.min(STAGES.length - 1, Math.max(0, Math.floor(progress * STAGES.length))));
  });

  return (
    <section ref={sectionRef} className={`s-dark-2 about-story${reduceMotion ? " about-story--static" : ""}`}>
      <div className="wrap about-story-grid">
        <div className="about-rail" aria-hidden="true">
          <span className="eyebrow">So arbeitet DataSynth</span>
          <p className="about-rail-title">Eine Prüfspur statt einer Black Box.</p>
          <div className="about-rail-track">
            <motion.span
              className="about-rail-fill"
              style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
            />
          </div>
          <span className="about-rail-progress">{String(activeStage + 1).padStart(2, "0")} / 04</span>
        </div>

        <div className="about-stages">
          {STAGES.map((stage, index) => (
            <article
              className="about-stage"
              data-active={index === activeStage}
              key={stage.label}
            >
              <span className="about-stage-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="about-stage-label">{stage.label}</p>
                <h2>{stage.title}</h2>
                <p>{stage.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
