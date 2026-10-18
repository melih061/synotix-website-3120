"use client";

import { useState } from "react";
import { ANLIEGEN, BRANCHE_MAX, MITARBEITENDE } from "@/lib/erstgespraech";

type State = "idle" | "sending" | "ok" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      message: fd.get("message"),
      anliegen: fd.get("anliegen"),
      branche: fd.get("branche"),
      mitarbeitende: fd.get("mitarbeitende"),
      website: fd.get("website"), // Honeypot
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Fehler");
      setState("ok");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    }
  }

  if (state === "ok") {
    return (
      <div className="cform-ok" role="status">
        <h3>Danke — Nachricht erhalten.</h3>
        <p>Wir melden uns persönlich, um einen Termin für das Erstgespräch abzustimmen. Alternativ erreichen Sie uns direkt per E-Mail.</p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit}>
      {/* Honeypot — für Menschen unsichtbar, fängt Bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="cform-row">
        <div className="cfield">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" required autoComplete="name" placeholder="Max Mustermann" />
        </div>
        <div className="cfield">
          <label htmlFor="company">Unternehmen</label>
          <input id="company" name="company" autoComplete="organization" placeholder="Muster GmbH" />
        </div>
      </div>
      <div className="cfield">
        <label htmlFor="email">E-Mail *</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="max@muster.de" />
      </div>
      <div className="cfield">
        <label htmlFor="anliegen">Ihr Anliegen</label>
        <select id="anliegen" name="anliegen" defaultValue="">
          <option value="">Bitte wählen (optional)</option>
          {ANLIEGEN.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className="cform-row">
        <div className="cfield">
          <label htmlFor="branche">Branche</label>
          <input id="branche" name="branche" maxLength={BRANCHE_MAX} placeholder="z. B. Metallverarbeitung" />
        </div>
        <div className="cfield">
          <label htmlFor="mitarbeitende">Mitarbeitende</label>
          <select id="mitarbeitende" name="mitarbeitende" defaultValue="">
            <option value="">Bitte wählen (optional)</option>
            {MITARBEITENDE.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="cfield">
        <label htmlFor="message">Welcher Ablauf stört Sie heute? *</label>
        <textarea id="message" name="message" required minLength={20} placeholder="Zum Beispiel: Wir übertragen Rechnungsdaten von Hand ins ERP. Welche Systeme nutzen Sie? Bitte keine vertraulichen Dokumente oder Kundendaten einfügen." />
      </div>
      {state === "error" && <p role="alert" style={{ color: "var(--err, #FF453A)", fontSize: 13.5 }}>{error}</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-pri btn-pill" disabled={state === "sending"}>
          {state === "sending" ? "Senden …" : "Erstgespräch anfragen"} <span className="ar" aria-hidden="true">→</span>
        </button>
        <span className="cform-note">Bitte beachten Sie unsere Datenschutzhinweise.</span>
      </div>
    </form>
  );
}
