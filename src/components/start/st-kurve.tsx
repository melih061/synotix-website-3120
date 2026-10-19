"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, ClipboardCheck, GitCompare, GraduationCap, Hourglass, PlugZap, Ruler, ShieldCheck, Workflow,
} from "lucide-react";
import { TiltedGridHero, type TiltedGridTile } from "@/components/ui/tilted-grid-hero";

/* Kurven-Band: Info-Karten laufen auf einer Zylinderkurve. Keine Fotos, keine Zahlen, keine Referenzen.
   Nur Aussagen, die Synotix auch an anderer Stelle der Seite trägt. Doppelungen zu Einstieg, Datenfluss
   und Ablauf (Mensch gibt frei, Festpreis, Prozessanalyse am Anfang) sind bewusst weggelassen. */

type Karte = { art: "Vorteil" | "Warum Synotix"; icon: LucideIcon; titel: string; text: string };

const KARTEN: Karte[] = [
  { art: "Vorteil", icon: GitCompare, titel: "Abweichungen fallen auf", text: "Bestellung, Lieferschein und Rechnung werden abgeglichen." },
  { art: "Warum Synotix", icon: PlugZap, titel: "Ihre Systeme bleiben", text: "Wir passen uns an E-Mail, Excel und ERP an, nicht umgekehrt." },
  { art: "Vorteil", icon: Workflow, titel: "Schluss mit Abtippen", text: "Daten landen sauber in Excel oder ERP." },
  { art: "Warum Synotix", icon: ShieldCheck, titel: "Datenschutz pro Prozess", text: "Nicht pauschal, sondern für Ihren Ablauf geprüft." },
  { art: "Vorteil", icon: Hourglass, titel: "Mehr Zeit fürs Entscheiden", text: "Routine ist vorbereitet, Ihre Fachleute prüfen nur noch." },
  { art: "Warum Synotix", icon: Ruler, titel: "Nicht von der Stange", text: "Jede Lösung entsteht für Ihren Ablauf, nicht als Standardpaket." },
  { art: "Vorteil", icon: BookOpen, titel: "Wissen bleibt im Betrieb", text: "Abläufe sind festgehalten, nicht nur im Kopf Einzelner." },
  { art: "Warum Synotix", icon: ClipboardCheck, titel: "„Noch nicht“ ist eine Antwort", text: "Die Analyse sagt auch, wenn sich KI noch nicht lohnt." },
  { art: "Vorteil", icon: GraduationCap, titel: "Ihr Team lernt mit", text: "Schulung am eigenen Ablauf, Begleitung nach Absprache." },
];

function InfoKarte({ art, icon: Icon, titel, text }: Karte) {
  const warum = art === "Warum Synotix";
  return (
    <div className={`st-karte${warum ? " st-karte-warum" : ""}`}>
      <div className="st-karte-kopf">
        <span className="st-karte-art"><i />{art}</span>
        <span className="st-karte-ring"><Icon strokeWidth={1.5} /></span>
      </div>
      <div>
        <p className="st-karte-titel">{titel}</p>
        <p className="st-karte-text">{text}</p>
      </div>
    </div>
  );
}

const TILES: TiltedGridTile[] = KARTEN.map((k) => ({
  label: `${k.art}: ${k.titel}. ${k.text}`,
  content: <InfoKarte {...k} />,
}));

export function StKurve() {
  const wrap = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);
  // Auf dem Handy: weniger Streifen pro Karte und breitere, kompaktere Karten.
  const [kompakt, setKompakt] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const set = () => setKompakt(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Wird im ruhigen Modus (CSS) ausgeblendet. Der Abschnitt ist hoch und das Band bleibt darin stehen: Scrollen schiebt die Karten durch,
  // jede Karte hält kurz in der Mitte, im Stillstand treibt das Band nur ganz leicht.
  return (
    <div ref={wrap} className="st-kurve-wrap">
      <div className="st-kurve-sticky">
        <TiltedGridHero
          tiles={TILES}
          scrollRef={wrap}
          onIndex={setAktiv}
          aspectRatio={kompakt ? 1.3 : 1.45}
          maxWidth={kompakt ? 78 : 50}
          slices={kompakt ? 10 : 16}
          gap={8}
          tileHeight={kompakt ? 36 : 33}
          axis={kompakt ? 58 : 61}
          curve={kompakt ? 52 : 62}
          fade={kompakt ? 8 : 14}
          sway={kompakt ? 6 : 10}
          tileClassName="bg-transparent"
          className="st-kurve"
          labelledBy="st-h-kurve"
        >
          <div className="st-kurve-in">
            <div className="st-wrap st-kopf">
              <h2 id="st-h-kurve">Was sich im Alltag ändert.</h2>
              <p>Das nehmen Ihnen die Abläufe ab, und so setzen wir sie um.</p>
            </div>
            {/* Ohne Bewegung (reduzierte Bewegung, Pause, niedrige Fenster, starker Zoom):
                alle Karten als ruhiges Raster statt des Bands. */}
            <ul className="st-wrap st-kurve-raster" role="list" aria-labelledby="st-h-kurve">
              {KARTEN.map((k) => <li key={k.titel}><InfoKarte {...k} /></li>)}
            </ul>
          </div>
          <div className="st-kurve-fuss" aria-hidden="true">
            <span className="st-kurve-zahl"><b>{String(aktiv + 1).padStart(2, "0")}</b> / {String(KARTEN.length).padStart(2, "0")}</span>
            <span className="st-kurve-punkte">
              {KARTEN.map((k, i) => <i key={k.titel} className={i === aktiv ? "st-an" : undefined} />)}
            </span>
          </div>
        </TiltedGridHero>
      </div>
    </div>
  );
}
