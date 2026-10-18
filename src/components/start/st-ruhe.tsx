"use client";

import { useEffect, useState } from "react";

/** Pause für alle Dauer-Animationen der Startseite (WCAG 2.2.2). Wirkt über ein Attribut am html-Element. */
export function StRuheKnopf() {
  const [an, setAn] = useState(false);

  useEffect(() => () => { delete document.documentElement.dataset.stRuhe; }, []);

  const umschalten = () => {
    const neu = !an;
    setAn(neu);
    if (neu) document.documentElement.dataset.stRuhe = "an";
    else delete document.documentElement.dataset.stRuhe;
    window.dispatchEvent(new Event("st-ruhe"));
  };

  return (
    <button type="button" className="st-ruhe" aria-pressed={an} onClick={umschalten}>
      Animationen pausieren
    </button>
  );
}
