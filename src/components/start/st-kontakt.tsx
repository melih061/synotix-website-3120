"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics-events";

type Zustand = "bereit" | "sendet" | "ok" | "fehler";

const TAGE = ["Egal", "Mo", "Di", "Mi", "Do", "Fr"];
const ZEITEN = ["Egal", "Vormittag", "Nachmittag"];

/* Sendet an die bestehende, serverseitig geprüfte Route /api/contact.
   Der Terminwunsch wird nur als Text der Nachricht vorangestellt; es gibt keine echte Terminbuchung. */
export function StKontakt() {
  const [zustand, setZustand] = useState<Zustand>("bereit");
  const [fehler, setFehler] = useState("");
  const gestartet = useRef(false);
  const okRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (zustand === "ok") okRef.current?.focus(); }, [zustand]);

  async function senden(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (zustand === "sendet") return;
    setZustand("sendet");
    setFehler("");
    const fd = new FormData(e.currentTarget);
    const tag = String(fd.get("tag") ?? "Egal");
    const zeit = String(fd.get("zeit") ?? "Egal");
    const wunsch = tag === "Egal" && zeit === "Egal" ? "" : `Terminwunsch: ${[tag !== "Egal" && tag, zeit !== "Egal" && zeit].filter(Boolean).join(", ")}\n\n`;
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      message: `${wunsch}${String(fd.get("message") ?? "")}`,
      website: fd.get("website"), // Honeypot
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Die Nachricht konnte nicht gesendet werden.");
      trackEvent("contact_form_success");
      setZustand("ok");
    } catch (err) {
      trackEvent("contact_form_error");
      setFehler(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
      setZustand("fehler");
    }
  }

  if (zustand === "ok") {
    return (
      <div className="st-ok" role="status" tabIndex={-1} ref={okRef}>
        <h3>Danke, Nachricht erhalten.</h3>
        <p>Wir melden uns persönlich, um einen Termin für das Erstgespräch abzustimmen.</p>
      </div>
    );
  }

  return (
    <form
      className="st-form"
      onSubmit={senden}
      onFocus={() => { if (!gestartet.current) { gestartet.current = true; trackEvent("contact_form_start"); } }}
    >
      <div className="st-honig" aria-hidden="true" inert>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="st-chips">
        <legend>Wunschtermin für das Erstgespräch (optional)</legend>
        <div role="radiogroup" aria-label="Wochentag">{TAGE.map((t, i) => <label key={t}><input type="radio" name="tag" value={t} defaultChecked={i === 0} /><span>{t}</span></label>)}</div>
        <div role="radiogroup" aria-label="Tageszeit">{ZEITEN.map((t, i) => <label key={t}><input type="radio" name="zeit" value={t} defaultChecked={i === 0} /><span>{t}</span></label>)}</div>
      </fieldset>

      <div className="st-zwei">
        <label className="st-feld">Name *<input name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
        <label className="st-feld">E-Mail *<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      </div>
      <label className="st-feld">Unternehmen<input name="company" maxLength={160} autoComplete="organization" /></label>
      <div className="st-feld">
        <label htmlFor="st-nachricht">Welcher Ablauf soll leichter werden? *</label>
        <textarea id="st-nachricht" name="message" required minLength={20} maxLength={3500} aria-describedby="st-nachricht-hinweis" data-lenis-prevent />
        <small id="st-nachricht-hinweis">Mindestens 20 Zeichen. Bitte keine vertraulichen Dokumente oder Kundendaten einfügen.</small>
      </div>
      <p className="st-pflicht">* Pflichtfeld</p>

      {zustand === "fehler" && <p role="alert" className="st-fehler">{fehler}</p>}
      <div className="st-form-fuss">
        <button type="submit" className="st-knopf st-knopf-schwarz" aria-disabled={zustand === "sendet"}>
          {zustand === "sendet" ? "Wird gesendet …" : "Erstgespräch anfragen"}
        </button>
        <span>Bitte beachten Sie unsere <Link href="/datenschutz">Datenschutzhinweise</Link>.</span>
      </div>
    </form>
  );
}
