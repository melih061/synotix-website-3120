import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, CalendarClock, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Erstgespräch vereinbaren — Synotix",
  alternates: { canonical: "/kontakt" },
  description:
    "Vereinbaren Sie ein unverbindliches Erstgespräch mit Synotix: Situation, Ziel und eine ehrliche Einschätzung, ob eine Prozessanalyse sinnvoll ist.",
};

export default function Kontakt() {
  return (
    <main>
      <section className="s-dark page-top">
        <div className="wrap" style={{ paddingBottom: 64 }}>
          <span className="eyebrow">Kontakt</span>
          <h1 className="page-h1">
            Erstgespräch <span className="dim">vereinbaren.</span>
          </h1>
          <p className="page-lead">
            Unverbindlich und persönlich: Sie schildern Ihre Situation, wir geben eine ehrliche
            Einschätzung, ob eine bezahlte Prozessanalyse der passende nächste Schritt ist.
            Auch wenn die Antwort „noch nicht“ lautet.
          </p>
        </div>
      </section>

      <section className="s-dark-2">
        <div className="wrap">
          <div className="two-col">
            {/* Form */}
            <div>
              <ContactForm />
            </div>

            {/* Info */}
            <div>
              <div className="info-row">
                <span className="ic"><CalendarClock size={18} /></span>
                <div>
                  <div className="t">Erstgespräch</div>
                  <div className="d">Unverbindlich: Situation, Ziel und eine ehrliche Einschätzung. Den Termin stimmen wir persönlich ab.</div>
                </div>
              </div>
              <div className="info-row">
                <span className="ic"><Mail size={18} /></span>
                <div>
                  <div className="t">E-Mail</div>
                  <a className="d" href="mailto:kontakt@synotix.de">kontakt@synotix.de</a>
                </div>
              </div>
              <div className="info-row">
                <span className="ic"><MapPin size={18} /></span>
                <div>
                  <div className="t">Daten &amp; Systeme</div>
                  <div className="d">Datenwege, Anbieter und Zugriffsrechte werden für den konkreten Prozess geklärt.</div>
                </div>
              </div>
              <div className="info-row" style={{ borderBottom: "none" }}>
                <span className="ic"><ShieldCheck size={18} /></span>
                <div>
                  <div className="t">Datenschutz</div>
                  <div className="d">Bitte keine vertraulichen Rechnungen oder Kundendaten mitsenden. <Link href="/datenschutz">Datenschutzhinweise lesen</Link>.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
