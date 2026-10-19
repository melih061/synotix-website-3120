"use client";

import { useEffect, useState } from "react";

/** Pause für alle Dauer-Animationen der Startseite (WCAG 2.2.2). Wirkt über ein Attribut am html-Element. */
export function StRuheKnopf() {
  const [an, setAn] = useState(false);

  // Die Wahl gilt für die ganze Sitzung, auch nach dem Neuladen.
  useEffect(() => {
    let gemerkt = false;
    try { gemerkt = sessionStorage.getItem("st-ruhe") === "an"; } catch {}
    if (gemerkt) {
      setAn(true);
      document.documentElement.dataset.stRuhe = "an";
      window.dispatchEvent(new Event("st-ruhe"));
    }
    return () => { delete document.documentElement.dataset.stRuhe; };
  }, []);

  const umschalten = () => {
    const neu = !an;
    setAn(neu);
    if (neu) document.documentElement.dataset.stRuhe = "an";
    else delete document.documentElement.dataset.stRuhe;
    try { if (neu) sessionStorage.setItem("st-ruhe", "an"); else sessionStorage.removeItem("st-ruhe"); } catch {}
    window.dispatchEvent(new Event("st-ruhe"));
  };

  return (
    <button type="button" className="st-ruhe" aria-pressed={an} onClick={umschalten}>
      Animationen pausieren
    </button>
  );
}
