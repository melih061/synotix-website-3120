import type { LucideIcon } from "lucide-react";
import { ClipboardList, GraduationCap, LifeBuoy, Wrench } from "lucide-react";

/* Inhalte des Beratungsmodells (Entscheidung 2026-10-17).
   Keine Preise, keine Ersparnis- oder Genauigkeitszahlen, keine Kundenzitate.
   Datenschutz-Aussage bleibt allgemein, bis die Mistral-AVV vorliegt. */

export const KONTAKT_EMAIL = "kontakt@synotix.de";

export const DATENSCHUTZ_AUSSAGE =
  "Datenschutz wird pro Kundenprozess geprüft und dokumentiert. Wichtige Entscheidungen trifft immer ein Mensch.";

export const SEO = {
  title: "Synotix — KI-Beratung und Umsetzung für den Mittelstand",
  description:
    "KI-Beratung für den Mittelstand mit Schwerpunkt Industrie: bezahlte Prozessanalyse, danach maßgeschneiderte KI-Lösung, KI-Schulung oder Digitalisierungsschritt. Festpreis je Auftrag, Freigabe durch Menschen.",
  slogan: "Erst analysieren, dann bauen, was Ihr Betrieb braucht.",
  keywords: ["KI-Beratung", "Prozessanalyse", "KI-Schulung", "Maßgeschneiderte KI-Lösung", "Mittelstand", "Industrie", "Digitalisierung"],
};

export const HERO = {
  chip: "KI-Beratung & Umsetzung · Mittelstand",
  h1: "Erst verstehen wir Ihre Abläufe.",
  h1Accent: "Dann bauen wir, was Ihr Betrieb braucht.",
  lead:
    "KI-Beratung für den Mittelstand mit 10 bis 75 Mitarbeitenden, mit Schwerpunkt Industrie. Am Anfang steht eine bezahlte Prozessanalyse. Danach folgt genau das, was sich lohnt: eine maßgeschneiderte KI-Lösung, eine Schulung oder ein Digitalisierungsschritt.",
  checks: ["Analyse vor Umsetzung", "Festpreis je Auftrag", "Freigabe durch Menschen"],
};

export type Leistung = {
  n: string; slug: string; icon: LucideIcon; t: string; kurz: string; punkte: string[];
};

export const LEISTUNGEN: Leistung[] = [
  {
    n: "01", slug: "ki-agenten", icon: ClipboardList, t: "Analyse & Strategie",
    kurz: "Wir nehmen einen Ablauf auf und sagen ehrlich, was sich lohnt.",
    punkte: ["Ablauf, Daten und Systeme aufnehmen", "Ausgangskennzahl festlegen", "Empfehlung nach Bedarf, auch „jetzt nichts bauen“"],
  },
  {
    n: "02", slug: "n8n-workflows", icon: Wrench, t: "Maßgeschneiderte Lösungen",
    kurz: "Eine KI-Lösung oder ein Digitalisierungsschritt, genau für Ihren Prozess.",
    punkte: ["Ein Prozess, ein klarer Festpreisauftrag", "Abnahmekriterien vorab vereinbart", "Wichtige Entscheidungen bleiben beim Menschen"],
  },
  {
    n: "03", slug: "schulung", icon: GraduationCap, t: "Schulung & Enablement",
    kurz: "Damit Ihr Team KI im Alltag sicher und sinnvoll nutzt.",
    punkte: ["Workshops für Geschäftsführung und Teams", "KI sicher im Arbeitsalltag einsetzen", "Inhalte aus der Analyse abgeleitet"],
  },
  {
    n: "04", slug: "managed-services", icon: LifeBuoy, t: "Begleitung",
    kurz: "Nach der Abnahme bleiben wir in vereinbarten Grenzen an Ihrer Seite.",
    punkte: ["Qualität, Fehler und Kosten beobachten", "Pflege in vereinbarten Grenzen", "Keine 24/7-Zusage, klare Reaktionszeiten"],
  },
];

export const LEISTUNGEN_HINWEIS =
  "Jeder Bereich ist ein eigener Auftrag, nie im Bündel. Sie entscheiden nach jeder Stufe, ob es weitergeht. Den Festpreis für eine Umsetzung nennen wir nach der Analyse.";

export type Situation = { zitat: string; leistung: string; href: string; linkLabel: string };

export const SITUATIONEN: Situation[] = [
  { zitat: "Unsere Eingangsrechnungen stapeln sich in der Buchhaltung.", leistung: "Analyse, dann Lösung", href: "/produkte/datensynth", linkLabel: "Beispiellösung für Rechnungsprüfung ansehen" },
  { zitat: "Wir übertragen täglich Daten zwischen E-Mail, Excel und ERP.", leistung: "Analyse & Strategie", href: "/dienstleistungen/ki-agenten", linkLabel: "Leistung Analyse & Strategie ansehen" },
  { zitat: "Wir haben KI ausprobiert, aber im Alltag nutzt sie niemand.", leistung: "Schulung & Enablement", href: "/dienstleistungen/schulung", linkLabel: "Leistung Schulung & Enablement ansehen" },
  { zitat: "Wir haben eine Idee, aber keine eigenen Entwickler.", leistung: "Maßgeschneiderte Lösung", href: "/dienstleistungen/n8n-workflows", linkLabel: "Leistung Maßgeschneiderte Lösungen ansehen" },
  { zitat: "Wir wissen nicht, wo wir anfangen sollen.", leistung: "Erstgespräch", href: "/kontakt", linkLabel: "Erstgespräch vereinbaren" },
];

export const SCHRITTE = [
  { t: "Erstgespräch", tag: "Unverbindlich", d: "Wir klären Ihre Situation und Ihr Ziel. Sie bekommen eine ehrliche Einschätzung, ob eine Analyse sinnvoll ist.", ergebnis: "Ergebnis: klares Ja oder Nein zur Analyse" },
  { t: "Bezahlte Analyse", tag: "Festpreis", d: "Prozessbild, Ausgangskennzahl und eine Empfehlung nach Bedarf. Auch „jetzt nichts bauen“ ist ein gültiges Ergebnis.", ergebnis: "Ergebnis: Empfehlung mit Abnahmekriterien" },
  { t: "Umsetzung", tag: "Eigener Auftrag", d: "Lösung, Schulung oder Digitalisierungsschritt als abgegrenzter Auftrag. Vor wichtigen Entscheidungen gibt ein Mensch frei.", ergebnis: "Ergebnis: Abnahme nach vereinbarten Kriterien" },
];

export const REFERENZ = {
  eyebrow: "Beispiel aus der Praxis",
  h2: "Betreute Rechnungsprüfung mit DataSynth.",
  text:
    "Ein Beispiel für eine maßgeschneiderte Lösung: DataSynth liest Lieferantenrechnungen aus, markiert Auffälligkeiten und bereitet die DATEV-Übergabe vor. Zahlung, Buchung und Import gibt immer ein Mensch frei.",
  status: "Status: technisch getestet. Der Pilot mit echten Kundendaten steht noch aus.",
  punkte: ["Pflichtangaben und Summen prüfen", "IBAN-Abweichungen und mögliche Duplikate markieren", "DATEV-Übergabe vorbereiten", "Freigabe durch einen Menschen"],
};

export const UEBER_MELIH = {
  eyebrow: "Ihr Ansprechpartner",
  h2: "Sie sprechen direkt mit dem Gründer.",
  absaetze: [
    "Ich bin Melih Dönmez, Gründer von Synotix und Student der Wirtschaftsinformatik. Ich entwickle KI-Anwendungen und verbinde sie mit bestehenden Abläufen.",
    "Von der Analyse bis zur Umsetzung sprechen Sie mit mir, ohne Zwischenstufen. Mein Schwerpunkt liegt auf Industriebetrieben; Betriebe aus anderen Branchen sind ebenso willkommen.",
  ],
  punkte: ["Ein Ansprechpartner für den ganzen Weg", "Ehrliche Empfehlung, auch gegen KI", "Ein Kundenprojekt nach dem anderen"],
};

export const FAQ = [
  { q: "Was macht Synotix?", a: "Synotix ist eine KI-Beratung für den Mittelstand. Wir analysieren zuerst einen Ablauf in Ihrem Betrieb und empfehlen dann, was wirklich hilft: eine maßgeschneiderte KI-Lösung, eine Schulung, einen Digitalisierungsschritt oder auch nichts." },
  { q: "Muss ich DataSynth einsetzen?", a: "Nein. DataSynth ist ein Beispiel für eine Lösung, die wir für die Rechnungsprüfung vorbereitet haben. Was wir für Sie umsetzen, ergibt sich aus der Analyse." },
  { q: "Was kostet die Zusammenarbeit?", a: "Das Erstgespräch ist unverbindlich. Die Analyse und jede spätere Umsetzung sind Festpreisaufträge mit klarem Umfang. Den Preis besprechen wir im Erstgespräch bzw. nach der Analyse." },
  { q: "Wie gehen Sie mit unseren Daten um?", a: "Datenschutz wird pro Kundenprozess geprüft und dokumentiert. Eingesetzte Dienstleister und Datenwege legen wir vor dem Start offen. Wichtige Entscheidungen wie Zahlung, Buchung oder Verträge trifft immer ein Mensch." },
];
