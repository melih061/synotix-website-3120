"use client";

import { useState } from "react";
import { ArrowRight, ClipboardList, Timer, CheckCircle } from "lucide-react";

const MEASUREMENT_STEPS = [
  { icon: ClipboardList, title: "Ausgangslage aufnehmen", text: "Den heutigen Aufwand an einer repräsentativen Auswahl erfassen: vom Eingang bis zum geprüften Ergebnis, einschließlich Ausnahmen." },
  { icon: Timer, title: "Im Pilot erneut messen", text: "Dieselben Prozessgrenzen und einen vergleichbaren Fallmix verwenden. Menschliche Prüfung, Korrekturen und Nacharbeit mitzählen." },
  { icon: CheckCircle, title: "Nutzen gemeinsam bewerten", text: "Zeitaufwand, Fehler und Ergebnisqualität vergleichen. Erst mit Umsetzungs- und Betriebskosten lässt sich die Wirtschaftlichkeit beurteilen." },
];

export function MeasurementDemo() {
  const [volume, setVolume] = useState("");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const cases = Number(volume);
  const baseline = Number(before);
  const pilot = Number(after);
  const complete = [volume, before, after].every(value => value.trim() !== "");
  const valid = complete && [cases, baseline, pilot].every(Number.isFinite)
    && Number.isInteger(cases) && cases > 0 && baseline > 0 && pilot >= 0;
  const hours = valid ? ((baseline - pilot) * cases) / 60 : null;
  const format = (value: number) => value.toLocaleString("de-DE", { maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        {MEASUREMENT_STEPS.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className="p-5 flex items-start gap-4" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd)" }}>
            <Icon className="h-5 w-5 shrink-0 mt-1" style={{ color: "var(--blue)" }} />
            <div>
              <span className="label-mono">0{index + 1}</span>
              <h3 className="font-semibold mt-1" style={{ color: "var(--tx-0)" }}>{title}</h3>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--tx-1)" }}>{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6" style={{ backgroundColor: "var(--bg-2)", border: "1px solid var(--bd-hi)" }}>
        <p className="label-mono">Ihr Zeitvergleich</p>
        <h3 className="text-xl font-semibold mt-2" style={{ color: "var(--tx-0)" }}>Mit eigenen Messwerten rechnen</h3>
        <p className="text-sm leading-relaxed mt-3 mb-6" style={{ color: "var(--tx-1)" }}>
          Tragen Sie gemessene Durchschnittswerte ein. Die Rechnung bleibt in Ihrem Browser. Schätzwerte liefern ausschließlich ein Rechenbeispiel, keinen belegten Kundennutzen.
        </p>

        <div className="space-y-4">
          {[
            { id: "measurement-volume", label: "Vergleichbare Fälle pro Monat", value: volume, setValue: setVolume, min: 1, step: "1" },
            { id: "measurement-before", label: "Bisher: Minuten pro Fall", value: before, setValue: setBefore, min: 0.01, step: "any" },
            { id: "measurement-after", label: "Im Pilot: Minuten pro Fall inklusive Prüfung", value: after, setValue: setAfter, min: 0, step: "any" },
          ].map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm mb-2" style={{ color: "var(--tx-1)" }}>{field.label}</label>
              <input
                id={field.id}
                type="number"
                inputMode="decimal"
                min={field.min}
                step={field.step}
                value={field.value}
                onChange={event => field.setValue(event.target.value)}
                className="w-full px-4 py-3 outline-offset-4"
                style={{ backgroundColor: "var(--bg-1)", color: "var(--tx-0)", border: "1px solid var(--bd-hi)" }}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4" aria-live="polite" aria-atomic="true" style={{ backgroundColor: "var(--bg-1)", border: "1px solid var(--bd)" }}>
          {hours !== null ? (
            <>
              <p className="text-2xl font-semibold" style={{ color: "var(--tx-0)" }}>
                {format(Math.abs(hours))} Stunden {hours > 0 ? "weniger" : hours < 0 ? "mehr" : "Unterschied"} pro Monat
              </p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--tx-1)" }}>
                ({format(baseline)} − {format(pilot)}) Minuten × {format(cases)} Fälle ÷ 60.
                {hours < 0 ? " Mit diesen Werten entsteht zusätzlicher Zeitaufwand." : hours === 0 ? " Mit diesen Werten ergibt sich keine zeitliche Entlastung." : " Rechnerische Entlastung auf Basis Ihrer Angaben."}
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "var(--tx-1)" }}>
              {complete ? "Bitte geben Sie eine positive ganze Fallzahl, einen bisherigen Aufwand größer null und einen Pilotaufwand ab null ein." : "Mit allen drei Angaben erscheint hier Ihr Zeitvergleich. Es sind keine Einsparungen vorbelegt."}
            </p>
          )}
        </div>
        <p className="text-xs leading-relaxed mt-3" style={{ color: "var(--tx-2)" }}>Zeitentlastung ist keine garantierte Kosteneinsparung. Einmaliger Einführungsaufwand und laufende Kosten sind hier nicht enthalten.</p>
        <a href="/kontakt" className="btn-violet mt-6 inline-flex items-center gap-2 px-5 py-3">Erstgespräch vereinbaren <ArrowRight className="h-4 w-4" /></a>
      </div>
    </div>
  );
}
