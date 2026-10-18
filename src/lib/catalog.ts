import type { LucideIcon } from "lucide-react";
import {
  BarChart3, FileSearch, AlertTriangle, Target, Mail, Workflow,
  Server, Wrench, Factory, Cog, Truck, ShieldCheck, Database, FileText,
  GitBranch, Lock, Activity, Search, RefreshCw, Eye, Receipt,
  FileSpreadsheet, BookOpen, Handshake, CheckSquare, GraduationCap, Users, MessageSquare,
} from "lucide-react";

export type Category = "agenten" | "dienstleistungen" | "branchen" | "produkte";
export type Feature = { icon: LucideIcon; t: string; d: string };
export type Step = { t: string; d: string };
export type CtaLink = { label: string; href: string };
export type ProductStatus = "pilotvorbereitung" | "bedarfsabhaengig" | "perspektive" | "prozessbezogen" | "beispiel";

export const STATUS_META: Record<ProductStatus, { label: string }> = {
  pilotvorbereitung: { label: "Pilotvorbereitung" },
  bedarfsabhaengig: { label: "Bei konkretem Bedarf" },
  perspektive: { label: "Perspektive" },
  prozessbezogen: { label: "Nach Prozessanalyse" },
  beispiel: { label: "Technisches Beispiel" },
};

export type CatalogEntry = {
  slug: string;
  category: Category;
  icon: LucideIcon;
  card: string;
  eyebrow: string;
  title: string;
  titleDim?: string;
  lead: string;
  metaDesc: string;
  intro: { h: string; body: string; points: string[] };
  featuresLabel: string;
  featuresHead: string;
  features: Feature[];
  stepsLabel: string;
  stepsHead: string;
  steps: Step[];
  outcomesHead: string;
  outcomes: string[];
  related: { label: string; href: string }[];
  status?: ProductStatus;
  ctaPrimary?: CtaLink;
  ctaSecondary?: CtaLink;
};

const CONTACT: CtaLink = { label: "Erstgespräch vereinbaren", href: "/kontakt" };
const HOW: CtaLink = { label: "So arbeiten wir", href: "/dienstleistungen" };
const REFERENCE: CtaLink = { label: "Beispiellösung DataSynth", href: "/produkte/datensynth" };

const PROCESS_STEPS: Step[] = [
  { t: "Bezahlt analysieren", d: "Ablauf, Daten, Systeme und Verantwortliche aufnehmen, eine Ausgangskennzahl festlegen. Ergebnis ist eine Empfehlung nach Bedarf, auch „jetzt nichts bauen“." },
  { t: "Abgegrenzt umsetzen", d: "Lösung, Schulung oder Digitalisierungsschritt als eigenen Festpreisauftrag umsetzen, mit Abnahmekriterien und menschlichen Freigaben." },
  { t: "Begrenzt begleiten", d: "Nach der Abnahme Qualität, Fehler und Kosten im vereinbarten Umfang beobachten. Keine 24/7-Zusage; Änderungen gesondert festlegen." },
];

type ExampleSpec = {
  slug: string; icon: LucideIcon; name: string; card: string;
  title: string; titleDim: string; context: string; features: Feature[];
};

// Existing example URLs remain available. They describe possible components,
// not additional off-the-shelf products or production-proven capabilities.
function technicalExample(s: ExampleSpec): CatalogEntry {
  return {
    slug: s.slug, category: "agenten", icon: s.icon, card: s.card,
    eyebrow: "Technischer Baustein · " + s.name,
    title: s.title, titleDim: s.titleDim,
    lead: s.context + " Dieses Beispiel erläutert eine mögliche technische Anwendung. Ein Kundeneinsatz setzt einen bezahlten, klar begrenzten Prozessauftrag und passende Testfälle voraus.",
    metaDesc: s.card + " Technisches Beispiel; Einsatz und Nutzen müssen am konkreten Kundenprozess geprüft werden.",
    intro: {
      h: "Zuerst den Arbeitsablauf verstehen.",
      body: "Synotix beginnt immer mit einer bezahlten Prozessanalyse. Ob ein solcher Baustein sinnvoll ist, ergibt sich daraus; entwickelt wird nur für einen konkreten, bezahlten Kundenbedarf.",
      points: ["Einen abgegrenzten Bedarf benennen", "Datenzugriff und Zuständigkeit klären", "Ergebnisse mit Fachverantwortlichen prüfen", "Nutzen vor einer Erweiterung belegen"],
    },
    featuresLabel: "Mögliche Bausteine", featuresHead: "Was im Einzelfall zu prüfen ist.",
    features: s.features,
    stepsLabel: "Voraussetzungen", stepsHead: "Vom Bedarf zu einer Entscheidung.",
    steps: [
      { t: "Bedarf prüfen", d: "Wie oft entsteht das Problem, wer bearbeitet es und welche Folgen hat es?" },
      { t: "Machbarkeit klären", d: "Daten, Zugriffsrechte, Schnittstellen und repräsentative Fehlerfälle prüfen." },
      { t: "Umfang entscheiden", d: "Nur bei wirtschaftlichem Nutzen einen begrenzten Auftrag mit menschlicher Kontrolle vereinbaren." },
    ],
    outcomesHead: "Woran ein Einsatz gemessen würde.",
    outcomes: ["Bearbeitungszeit vor und nach der Umsetzung", "Qualität der Vorschläge und notwendige Korrekturen", "Nachvollziehbare Quellen und Entscheidungen", "Aufwand und Kosten des vereinbarten Betriebs"],
    related: [HOW, REFERENCE, { label: "Technischer Hintergrund", href: "/plattform" }],
    status: "beispiel", ctaPrimary: CONTACT, ctaSecondary: HOW,
  };
}

const AGENTEN_ENTRIES: CatalogEntry[] = [
  technicalExample({
    slug: "datenanalyst", icon: BarChart3, name: "Datenanalyse",
    card: "Beispiel: ausgewählte Tabellen auswerten und Auffälligkeiten für eine fachliche Prüfung aufbereiten.",
    title: "Zahlen einordnen,", titleDim: "Entscheidungen vorbereiten.",
    context: "Ein Analysebaustein könnte einen vereinbarten Datenexport auswerten und Befunde verständlich aufbereiten.",
    features: [
      { icon: Database, t: "Datenbasis", d: "Welche Daten sind vollständig, aktuell und für die konkrete Frage geeignet?" },
      { icon: BarChart3, t: "Auswertung", d: "Welche Berechnung beantwortet die Frage, und wie wird sie nachvollziehbar dokumentiert?" },
      { icon: AlertTriangle, t: "Auffälligkeiten", d: "Welche Abweichungen sind fachlich relevant, welche entstehen durch Datenfehler?" },
      { icon: FileText, t: "Prüfbarer Bericht", d: "Quellen, Rechenweg und Unsicherheiten müssten für die verantwortliche Person sichtbar sein." },
    ],
  }),
  technicalExample({
    slug: "dokumenten-intelligenz", icon: FileSearch, name: "Dokumentensuche",
    card: "Beispiel: freigegebene Dokumente durchsuchen und Antworten mit Fundstellen vorbereiten.",
    title: "Dokumente erschließen,", titleDim: "Quellen sichtbar machen.",
    context: "Eine dokumentengestützte Suche könnte passende Textstellen finden und daraus Antwortvorschläge mit Quellen erzeugen.",
    features: [
      { icon: BookOpen, t: "Dokumentauswahl", d: "Geeignete Unterlagen, Versionen und Nutzungsrechte müssten festgelegt werden." },
      { icon: Search, t: "Suche", d: "Die Suche müsste relevante Stellen anhand echter Fragen zuverlässig auffinden." },
      { icon: FileText, t: "Fundstellen", d: "Antwortvorschläge sollten auf die verwendeten Dokumentstellen verweisen." },
      { icon: Lock, t: "Berechtigungen", d: "Zugriff und Antwortumfang müssten die Rechte der jeweiligen Person berücksichtigen." },
    ],
  }),
  technicalExample({
    slug: "anomalie-erkennung", icon: AlertTriangle, name: "Abweichungen",
    card: "Beispiel: Abweichungen in ausgewählten Prozessdaten für eine fachliche Prüfung markieren.",
    title: "Abweichungen erkennen,", titleDim: "fachlich beurteilen.",
    context: "Ein Prüfbaustein könnte ausgewählte Messwerte mit vereinbarten Regeln oder einer belastbaren Vergleichsbasis abgleichen.",
    features: [
      { icon: Database, t: "Vergleichsbasis", d: "Historische Daten und bekannte Fehlerfälle müssten ausreichend aussagekräftig sein." },
      { icon: Activity, t: "Prüfregeln", d: "Grenzwerte und Verfahren müssten zum Prozess und seinen Schwankungen passen." },
      { icon: AlertTriangle, t: "Fehlmeldungen", d: "Übersehene Fälle und falsche Warnungen müssten gemeinsam bewertet werden." },
      { icon: Eye, t: "Fachliche Entscheidung", d: "Eine Meldung wäre eine Prüfhilfe; über Maßnahmen entscheidet eine verantwortliche Person." },
    ],
  }),
  technicalExample({
    slug: "lead-qualifizierung", icon: Target, name: "Anfragen einordnen",
    card: "Beispiel: eingehende Anfragen nach nachvollziehbaren Kriterien für die Bearbeitung vorsortieren.",
    title: "Anfragen einordnen,", titleDim: "mit klaren Kriterien.",
    context: "Eine Vorsortierung könnte den Vertrieb bei der Einordnung eingehender Anfragen unterstützen.",
    features: [
      { icon: Mail, t: "Ein Eingang", d: "Für einen möglichen Einsatz würde zunächst genau ein Eingangskanal ausgewählt." },
      { icon: CheckSquare, t: "Kriterien", d: "Die zuständige Person müsste nachvollziehbare Regeln und Grenzen festlegen." },
      { icon: FileSearch, t: "Fehlende Angaben", d: "Unvollständige Informationen sollten sichtbar bleiben und zur Prüfung führen." },
      { icon: Handshake, t: "Freigabe", d: "Verbindliche Zusagen, Angebote und wesentliche externe Nachrichten bleiben menschliche Entscheidungen." },
    ],
  }),
  technicalExample({
    slug: "email-analyse", icon: Mail, name: "E-Mail-Vorbereitung",
    card: "Beispiel: Nachrichten kategorisieren und Antwortentwürfe zur menschlichen Prüfung vorbereiten.",
    title: "Nachrichten vorbereiten,", titleDim: "bewusst freigeben.",
    context: "Ein E-Mail-Baustein könnte Kategorien oder Antwortentwürfe für einen eng begrenzten Postfachprozess vorschlagen.",
    features: [
      { icon: Mail, t: "Postfachzugriff", d: "Zweck, Berechtigungen und notwendiger Datenumfang müssten vorab geklärt werden." },
      { icon: FileSearch, t: "Einordnung", d: "Beispielnachrichten würden zeigen, welche Kategorien sinnvoll und zuverlässig unterscheidbar sind." },
      { icon: FileText, t: "Entwürfe", d: "Antworten würden als Vorschläge mit offen erkennbaren Unsicherheiten vorbereitet." },
      { icon: CheckSquare, t: "Menschliche Freigabe", d: "Wesentliche externe Nachrichten würden erst nach Prüfung und Freigabe versendet." },
    ],
  }),
];

type ServiceSpec = {
  slug: string; icon: LucideIcon; name: string; card: string;
  title: string; titleDim: string; lead: string; features: Feature[]; outcomes: string[];
};

function service(s: ServiceSpec): CatalogEntry {
  return {
    slug: s.slug, category: "dienstleistungen", icon: s.icon, card: s.card,
    eyebrow: "Leistung · " + s.name, title: s.title, titleDim: s.titleDim,
    lead: s.lead, metaDesc: s.card,
    intro: {
      h: "Ihr Bedarf bestimmt den Umfang.",
      body: "Synotix beginnt mit einer bezahlten Prozessanalyse. Sie klärt Ablauf, Daten, Zuständigkeiten und eine messbare Ausgangslage. Daraus folgt eine Empfehlung nach Bedarf: Lösung, Schulung, Digitalisierungsschritt oder nichts. Jede Leistung ist ein eigener Festpreisauftrag.",
      points: ["Analyse vor jeder Umsetzung", "Ein klar abgegrenzter Auftrag mit Festpreis", "Eine verantwortliche Person und klare Freigaben", "Vereinbarte Abnahmekriterien"],
    },
    featuresLabel: "Vereinbarter Umfang", featuresHead: "Was wir gemeinsam festlegen.",
    features: s.features, stepsLabel: "Zusammenarbeit", stepsHead: "In drei klaren Stufen.",
    steps: PROCESS_STEPS, outcomesHead: "Das Ergebnis des vereinbarten Auftrags.",
    outcomes: s.outcomes,
    related: [{ label: "Alle Leistungen", href: "/dienstleistungen" }, REFERENCE, { label: "Beispiellösungen", href: "/loesungen" }],
    ctaPrimary: CONTACT, ctaSecondary: HOW,
  };
}

const DIENSTLEISTUNGEN_ENTRIES: CatalogEntry[] = [
  // Slugs bleiben aus SEO-Gründen bestehen: ki-agenten = Analyse & Strategie,
  // n8n-workflows = Maßgeschneiderte Lösungen, managed-services = Begleitung.
  service({
    slug: "ki-agenten", icon: Search, name: "Analyse & Strategie",
    card: "Bezahlte Prozessanalyse: Ablauf verstehen, Ausgangslage messen und ehrlich empfehlen, was sich lohnt.",
    title: "Erst verstehen,", titleDim: "dann entscheiden.",
    lead: "In einer bezahlten Prozessanalyse nehmen wir einen Ablauf Ihres Betriebs auf: Daten, Systeme, Verantwortliche und heutigen Aufwand. Am Ende steht eine Empfehlung nach Bedarf, mit Abnahmekriterien. Auch „jetzt nichts bauen“ ist ein gültiges Ergebnis.",
    features: [
      { icon: Search, t: "Ablauf aufnehmen", d: "Prozess, Daten, Systeme und Verantwortliche gemeinsam mit Ihrem Team erfassen." },
      { icon: BarChart3, t: "Ausgangslage messen", d: "Eine Kennzahl festlegen, an der sich jede spätere Umsetzung messen lassen muss." },
      { icon: FileText, t: "Empfehlung nach Bedarf", d: "Lösung, Schulung, Digitalisierungsschritt oder nichts, jeweils begründet." },
      { icon: CheckSquare, t: "Klares Ergebnis", d: "Schriftliche Empfehlung mit Umfang und Abnahmekriterien als Grundlage für Ihre Entscheidung." },
    ],
    outcomes: ["Ein dokumentiertes Prozessbild", "Eine messbare Ausgangskennzahl", "Eine begründete Empfehlung nach Bedarf", "Ein klares Ja oder Nein zur Umsetzung"],
  }),
  service({
    slug: "n8n-workflows", icon: Wrench, name: "Maßgeschneiderte Lösungen",
    card: "Eine KI-Lösung oder ein Digitalisierungsschritt, genau für Ihren Prozess, als abgegrenzter Festpreisauftrag.",
    title: "Gebaut für Ihren Ablauf,", titleDim: "nicht von der Stange.",
    lead: "Nach der Analyse setzen wir genau das um, was empfohlen wurde: einen KI-Arbeitsprozess oder einen Digitalisierungs- und Automatisierungsschritt. Ein Prozess, ein verantwortlicher Mensch, eine Kennzahl. Wichtige Entscheidungen bleiben beim Menschen.",
    features: [
      { icon: Workflow, t: "Ein Prozess", d: "Ein klar beschriebener Ablauf mit einer Eingangsquelle und einer zentralen Anbindung." },
      { icon: GitBranch, t: "Passende Anbindung", d: "Werkzeuge und Schnittstellen nach Ihrem Prozess auswählen, nicht umgekehrt." },
      { icon: CheckSquare, t: "Abnahme vorab", d: "Repräsentative Fälle und messbare Abnahmekriterien vor Beginn festlegen." },
      { icon: Handshake, t: "Menschliche Freigabe", d: "Zahlung, Buchung, Import oder Verträge bleiben Entscheidungen Ihres Teams." },
    ],
    outcomes: ["Eine Lösung für genau einen Prozess", "Festpreis und klarer Umfang", "Menschliche Freigaben an wichtigen Entscheidungen", "Abnahme anhand vereinbarter Kriterien"],
  }),
  service({
    slug: "schulung", icon: GraduationCap, name: "Schulung & Enablement",
    card: "Workshops für Geschäftsführung und Teams, damit KI im Arbeitsalltag sicher und sinnvoll genutzt wird.",
    title: "KI im Alltag nutzen,", titleDim: "sicher und mit Verstand.",
    lead: "Viele Betriebe haben KI ausprobiert, aber im Alltag nutzt sie niemand. In Workshops für Geschäftsführung, Fachbereiche und Teams zeigen wir an Beispielen aus Ihren eigenen Abläufen, wo KI hilft, wo nicht und wie man sie sicher einsetzt.",
    features: [
      { icon: Users, t: "Für Ihre Zielgruppe", d: "Geschäftsführung, Fachbereiche oder ganze Teams, jeweils mit passendem Schwerpunkt." },
      { icon: MessageSquare, t: "Praxis statt Folien", d: "Gute Anweisungen formulieren und Ergebnisse prüfen, an Aufgaben aus Ihrem Betrieb." },
      { icon: Lock, t: "Sicher nutzen", d: "Welche Daten in welches Werkzeug dürfen und wo ein Mensch prüfen muss." },
      { icon: CheckSquare, t: "Aus der Analyse", d: "Inhalte leiten sich aus Ihrem Bedarf ab. Zertifikate stellen wir nicht aus." },
    ],
    outcomes: ["Ein Team, das KI im eigenen Alltag einordnen kann", "Klare Regeln für den sicheren Einsatz", "Übungen mit Beispielen aus Ihren Abläufen", "Ein vereinbarter Umfang als Festpreis"],
  }),
  service({
    slug: "managed-services", icon: Activity, name: "Begleitung",
    card: "Nach der Abnahme: Qualität, Fehler und Kosten im vereinbarten Umfang begleiten.",
    title: "Begleitung mit", titleDim: "klaren Grenzen.",
    lead: "Nach einer erfolgreichen Abnahme kann Synotix den vereinbarten Prozess begleiten. Umfang, Reaktionszeiten, Änderungen und Kosten werden vorab festgelegt. Eine Rund-um-die-Uhr-Zusage ist damit nicht verbunden.",
    features: [
      { icon: Eye, t: "Qualität beobachten", d: "Vereinbarte Stichproben und Kennzahlen für den abgenommenen Prozess prüfen." },
      { icon: AlertTriangle, t: "Fehler bearbeiten", d: "Zuständigkeiten und Reaktionszeiten für Störungen ausdrücklich vereinbaren." },
      { icon: RefreshCw, t: "Änderungen abstimmen", d: "Modell- und Schnittstellenpflege von neuen Funktionen und zusätzlichem Umfang trennen." },
      { icon: BarChart3, t: "Kosten nachvollziehen", d: "Vereinbarte Nutzungskosten und Grenzen transparent festhalten." },
    ],
    outcomes: ["Ein benannter Ansprechpartner", "Vereinbarte Reaktionszeiten, keine 24/7-Zusage", "Abgegrenzte Pflege und Änderungen", "Nachvollziehbare Qualität und Kosten"],
  }),
  service({
    slug: "infrastruktur", icon: Server, name: "Technische Grundlage",
    card: "Hosting, Zugriffe und Protokollierung als Teil einer Umsetzung passend zum einzelnen Prozess planen.",
    title: "Die passende Grundlage,", titleDim: "für einen konkreten Prozess.",
    lead: "Die technische Umgebung ist ein Baustein einer Umsetzung, kein eigenes Angebot. Hosting, Modelle, Datenwege und Zugriffe werden anhand des Kundenprozesses ausgewählt und geprüft. Eine umfassende KI-Plattform gehört nicht dazu.",
    features: [
      { icon: Server, t: "Betriebsumgebung", d: "Geeignete Betriebsform und Anbieter anhand von Prozessanforderungen und Kosten auswählen." },
      { icon: Lock, t: "Zugriffsrechte", d: "Erforderliche Berechtigungen und verantwortliche Personen vor dem Einsatz festlegen." },
      { icon: FileSearch, t: "Datenwege prüfen", d: "Speicherung, Modellaufrufe und beteiligte Dienstleister pro Konfiguration nachvollziehen." },
      { icon: Activity, t: "Beobachtung planen", d: "Erforderliche Qualitäts-, Fehler- und Kostenkontrollen im Betriebsumfang festhalten." },
    ],
    outcomes: ["Eine zum Prozess passende technische Entscheidung", "Nachvollziehbare Datenwege", "Festgelegte Zugriffsrechte", "Ein ausdrücklich begrenzter Betriebsumfang"],
  }),
];

function industry(slug: string, icon: LucideIcon, name: string, context: string): CatalogEntry {
  return {
    slug, category: "branchen", icon,
    card: context,
    eyebrow: "Branche · " + name, title: name + ",", titleDim: "mit einer Analyse beginnen.",
    lead: context + " Am Anfang steht eine bezahlte Prozessanalyse; danach folgt, was Ihr Betrieb wirklich braucht: Lösung, Schulung oder Digitalisierungsschritt.",
    metaDesc: "KI-Beratung für " + name + " im Mittelstand: Prozessanalyse, maßgeschneiderte KI-Lösung oder KI-Schulung, mit Freigabe durch Menschen.",
    intro: {
      h: "Passt Ihr Betrieb zu uns?",
      body: "Synotix berät mittelständische Betriebe mit etwa 10–75 Mitarbeitenden, wenig interner IT und manuellen Abläufen über E-Mail, Excel, Dokumente und ERP. Der Schwerpunkt liegt auf Industrie und Zulieferern; andere Branchen sind willkommen.",
      points: ["Ein wiederkehrender, manueller Ablauf", "Direkt verantwortliche Geschäftsführung", "Zugängliche Daten und eine zuständige Fachperson", "Bereitschaft, Nutzen und Qualität zu messen"],
    },
    featuresLabel: "Gesprächsgrundlage", featuresHead: "Diese Fragen klären wir im Erstgespräch.",
    features: [
      { icon: Receipt, t: "Dokumente", d: "Welche Unterlagen werden wiederholt erfasst und geprüft, beispielsweise Lieferantenrechnungen?" },
      { icon: Workflow, t: "Bearbeitung", d: "Wo entstehen Übertragungen, Rückfragen, Fehler oder Wartezeiten?" },
      { icon: Database, t: "Systeme", d: "Welche Eingangsquelle und welche zentrale Übergabe sind für einen ersten Prozess relevant?" },
      { icon: Handshake, t: "Verantwortung", d: "Wer prüft Vorschläge, erteilt Freigaben und bewertet das Ergebnis?" },
    ],
    stepsLabel: "Zusammenarbeit", stepsHead: "Drei Stufen, jede ein eigener Auftrag.",
    steps: PROCESS_STEPS,
    outcomesHead: "Was die Analyse klärt.",
    outcomes: ["Ob sich Lösung, Schulung oder Digitalisierungsschritt lohnt", "Welche Daten und Zugriffe benötigt werden", "Welcher Umfang tatsächlich lieferbar ist", "Woran der Erfolg gemessen wird"],
    related: [{ label: "Leistungen kennenlernen", href: "/dienstleistungen" }, REFERENCE, { label: "Alle Branchen", href: "/branchen" }],
    ctaPrimary: CONTACT, ctaSecondary: HOW,
  };
}

const BRANCHEN_ENTRIES: CatalogEntry[] = [
  industry("produktion", Factory, "Produktion & Fertigung", "Auch im Fertigungsbetrieb entstehen manuelle Dokumentenabläufe zwischen Büro, Einkauf und Buchhaltung."),
  industry("maschinenbau", Cog, "Maschinenbau", "In kleinen Maschinenbaubetrieben und bei Zulieferern treffen technische Arbeit und wiederkehrende kaufmännische Dokumentenprozesse zusammen."),
  industry("logistik", Truck, "Logistik & Supply Chain", "Im industriellen Materialfluss begleiten Rechnungen, Rückfragen und Datenübergaben die tägliche Zusammenarbeit."),
  industry("qualitaetssicherung", ShieldCheck, "Qualitätssicherung", "Dokumentierte Prüfungen und nachvollziehbare Freigaben zeigen, wie wichtig klare Verantwortlichkeiten im Industriebetrieb sind."),
];

const PRODUKTE_ENTRIES: CatalogEntry[] = [
  {
    slug: "datensynth", category: "produkte", icon: Receipt,
    card: "Beispiellösung: Lieferantenrechnungen auslesen, Auffälligkeiten markieren und die menschliche Prüfung vorbereiten.",
    eyebrow: "Beispiellösung · DataSynth · Betreute Rechnungsprüfung", title: "Rechnungen vorbereiten,", titleDim: "kontrolliert prüfen.",
    lead: "DataSynth ist der technische Kern einer betreuten Rechnungsprüfung. Lieferantenrechnungen werden ausgelesen, Prüfhilfen, Abweichungen und mögliche Duplikate sichtbar gemacht und Daten für die DATEV-Übergabe vorbereitet. Ein Mensch gibt vor Import, Buchung oder Zahlung frei. DataSynth ist ein Beispiel dafür, was nach einer Analyse entstehen kann.",
    metaDesc: "DataSynth: Beispiel einer maßgeschneiderten KI-Lösung zur betreuten Rechnungsprüfung im Mittelstand. Auslesen, Prüfhilfen und DATEV-Vorbereitung mit menschlicher Freigabe. In Pilotvorbereitung.",
    intro: {
      h: "Mit dem tatsächlichen Rechnungseingang beginnen.",
      body: "Die bezahlte Prozessanalyse klärt Volumen, Eingangskanal, Bearbeitungszeit, Systeme und Zuständigkeiten, und ob DataSynth überhaupt zu Ihrem Betrieb passt. Daraus entsteht bei Eignung ein begrenzter Pilotauftrag. DataSynth ist technisch getestet; die Erprobung mit echten Kundendaten, der laufende Betrieb und ein Steuerberater-Testimport stehen noch aus.",
      points: ["Eine Eingangsquelle und ein verantwortlicher Mensch", "Ausgangskennzahl vor der Umsetzung", "Prüfhilfen statt automatischer Buchungsentscheidung", "Kundeneinsatz erst nach Prüfung und Abnahme"],
    },
    featuresLabel: "Vorgesehener Ablauf", featuresHead: "Von der Rechnung zur menschlichen Freigabe.",
    features: [
      { icon: Receipt, t: "Rechnung auslesen", d: "Rechnungsdaten als Grundlage für die Prüfung erfassen; Formate und Qualität anhand vereinbarter Beispiele prüfen." },
      { icon: CheckSquare, t: "Auffälligkeiten markieren", d: "Prüfhilfen, Abweichungen und mögliche Duplikate für die verantwortliche Person sichtbar machen." },
      { icon: FileSpreadsheet, t: "DATEV vorbereiten", d: "Die Übergabe fachlich vorbereiten. Der Testimport mit dem Steuerberater ist vor einem Kundenbetrieb erforderlich." },
      { icon: Handshake, t: "Menschlich freigeben", d: "Import, Buchung und Zahlung bleiben Entscheidungen der dafür verantwortlichen Menschen." },
    ],
    stepsLabel: "Zusammenarbeit", stepsHead: "Ein messbarer erster Prozess.", steps: PROCESS_STEPS,
    outcomesHead: "Was wir im Pilot gemeinsam prüfen.",
    outcomes: ["Bearbeitungszeit gegenüber der Ausgangslage", "Qualität der erfassten Felder und Prüfhilfen", "Umgang mit fehlenden Angaben und Sonderfällen", "Fachlich geprüfte Übergabe und klare Freigaben"],
    related: [{ label: "Unser Vorgehen", href: "/dienstleistungen" }, { label: "Beispielablauf ansehen", href: "/demo" }, { label: "Prozessbezogene Umsetzung", href: "/produkte/prozessautomatisierung" }],
    status: "pilotvorbereitung", ctaPrimary: CONTACT,
    ctaSecondary: { label: "Beispielablauf ansehen", href: "/demo" },
  },
  {
    slug: "wissens-agent", category: "produkte", icon: BookOpen,
    card: "Möglicher Baustein für die Suche in freigegebenen Dokumenten; Weiterentwicklung nur bei konkretem, bezahltem Bedarf.",
    eyebrow: "Beispiellösung · Wissenssuche", title: "Firmenwissen finden,", titleDim: "mit nachvollziehbaren Quellen.",
    lead: "Ein Wissens-Agent kann als Baustein Fragen zu freigegebenen Unternehmensdokumenten unterstützen. Ob er sinnvoll ist, wird am konkreten Prozess geprüft. Synotix entwickelt ihn nur bei bezahlter Kundennachfrage weiter.",
    metaDesc: "Wissens-Agent als möglicher Baustein bei konkretem, bezahltem Kundenbedarf. Dokumentensuche, Fundstellen und menschliche Prüfung.",
    intro: {
      h: "Eine konkrete Frage vor einer neuen Lösung.",
      body: "Zunächst muss feststehen, welche Informationen fehlen, wie oft danach gesucht wird und welche Dokumente verlässlich zur Verfügung stehen. Nicht dokumentiertes Erfahrungswissen wird durch eine Suche allein nicht erfasst.",
      points: ["Freigegebene Dokumente als Grundlage", "Zugriffsrechte vor dem Einsatz klären", "Antworten und Fundstellen fachlich prüfen", "Entwicklung nur mit begründetem Kundenauftrag"],
    },
    featuresLabel: "Möglicher Umfang", featuresHead: "Was ein Auftrag klären müsste.",
    features: [
      { icon: BookOpen, t: "Quellen auswählen", d: "Geeignete Dokumente, Versionen und Verantwortliche bestimmen." },
      { icon: Search, t: "Fragen prüfen", d: "Mit repräsentativen Fragen untersuchen, ob relevante Stellen gefunden werden." },
      { icon: FileSearch, t: "Quellen zeigen", d: "Antwortvorschläge mit nachvollziehbaren Fundstellen aufbereiten." },
      { icon: Lock, t: "Grenzen beachten", d: "Berechtigungen, unvollständige Quellen und unsichere Antworten berücksichtigen." },
    ],
    stepsLabel: "Voraussetzungen", stepsHead: "Bedarf, Prüfung, Entscheidung.",
    steps: [
      { t: "Bedarf belegen", d: "Suchaufwand und konkrete Fragen mit den zuständigen Menschen aufnehmen." },
      { t: "Quellen prüfen", d: "Qualität, Nutzungsrechte und fachliche Abdeckung der Unterlagen bewerten." },
      { t: "Auftrag entscheiden", d: "Nur bei bezahltem Bedarf einen begrenzten Umfang und ein Abnahmeziel festlegen." },
    ],
    outcomesHead: "Mögliche Bewertungskriterien.",
    outcomes: ["Zeit bis zur gefundenen Information", "Qualität und Nachprüfbarkeit der Antworten", "Erkennbare Grenzen bei fehlendem Wissen", "Aufwand für die Aktualisierung der Quellen"],
    related: [HOW, REFERENCE, { label: "Technisches Beispiel: Dokumentensuche", href: "/agenten/dokumenten-intelligenz" }],
    status: "bedarfsabhaengig", ctaPrimary: CONTACT, ctaSecondary: HOW,
  },
  {
    slug: "prozessautomatisierung", category: "produkte", icon: Workflow,
    card: "Nach bezahlter Analyse genau einen dokumentenbasierten Arbeitsprozess mit klaren Freigaben umsetzen.",
    eyebrow: "Beispiellösung · Prozessbezogene Umsetzung", title: "Ein Prozess,", titleDim: "ein klarer Auftrag.",
    lead: "Synotix analysiert einen wiederkehrenden dokumentenbasierten Ablauf und setzt bei Eignung genau diesen Prozess um: eine Eingangsquelle, eine zentrale Integration, ein verantwortlicher Mensch und eine Kennzahl.",
    metaDesc: "Bezahlte Prozessanalyse, Umsetzung eines begrenzten KI-Arbeitsprozesses und vereinbarte Begleitung für den Mittelstand.",
    intro: {
      h: "Vom beobachtbaren Problem zum Auftrag.",
      body: "Manuelle Übertragungen und wiederkehrende Prüfungen können Zeit kosten. Die Analyse zeigt, ob eine Umsetzung wirtschaftlich sinnvoll und lieferbar ist. Zusätzliche Prozesse und Erweiterungen brauchen einen eigenen Auftrag.",
      points: ["Bezahlte Analyse mit umsetzbarem Ergebnis", "Ein abgegrenzter Arbeitsprozess", "Menschliche Freigaben und vereinbarte Abnahme", "Betrieb, Reaktionszeiten und Änderungen begrenzen"],
    },
    featuresLabel: "Leistungsumfang", featuresHead: "Was im Auftrag festgelegt wird.",
    features: [
      { icon: Search, t: "Ausgangslage", d: "Heutigen Ablauf, Zeitaufwand und Fehler mit den zuständigen Menschen erfassen." },
      { icon: Workflow, t: "Umsetzung", d: "Die notwendige Anbindung und Prüflogik für genau einen Prozess vereinbaren." },
      { icon: CheckSquare, t: "Abnahme", d: "Repräsentative Fälle und ein messbares Abnahmekriterium gemeinsam festlegen." },
      { icon: Activity, t: "Begrenzter Betrieb", d: "Qualität, Fehler, Kosten und Pflege innerhalb ausdrücklich vereinbarter Grenzen begleiten." },
    ],
    stepsLabel: "Zusammenarbeit", stepsHead: "Von der Analyse zum begrenzten Betrieb.", steps: PROCESS_STEPS,
    outcomesHead: "Das Ergebnis eines passenden Auftrags.",
    outcomes: ["Ein klar beschriebener Prozessumfang", "Dokumentierte Verantwortlichkeiten", "Eine überprüfbare Ausgangslage und Abnahme", "Ein begrenztes Betriebs- und Änderungsmodell"],
    related: [{ label: "Unsere Leistungen", href: "/dienstleistungen" }, REFERENCE, { label: "Begleitung", href: "/dienstleistungen/managed-services" }],
    status: "prozessbezogen", ctaPrimary: CONTACT, ctaSecondary: HOW,
  },
  {
    slug: "rfq-machbarkeit", category: "produkte", icon: FileSearch,
    card: "Perspektive für die Vorprüfung technischer Anfragen. Derzeit zurückgestellt; kein aktuelles Produktangebot.",
    eyebrow: "Perspektive · Technische Anfragen", title: "Anfragen vorprüfen,", titleDim: "als mögliche spätere Erweiterung.",
    lead: "Die Unterstützung bei technischen Anfragen und Lastenheften ist eine spätere Perspektive. Dieses Thema ist zurückgestellt, bis das Kernangebot zahlende Kunden hat. Ein aktueller Lieferumfang ist damit nicht zugesagt.",
    metaDesc: "RFQ- und Machbarkeitsprüfung als spätere Perspektive von Synotix. Derzeit zurückgestellt und kein aktuelles Produktangebot.",
    intro: {
      h: "Erst den Bedarf und die Daten belegen.",
      body: "Eine sinnvolle Vorprüfung würde aktuelle technische Unterlagen, verlässliche Kapazitätsdaten und fachliche Kriterien benötigen. Über Machbarkeit, Preise und Angebote müssten weiterhin verantwortliche Menschen entscheiden.",
      points: ["Derzeit zurückgestellte Perspektive", "Kundenbedarf und Datenzugang noch zu validieren", "Keine Liefer- oder Zeitersparniszusage", "Fachliche Entscheidungen bleiben beim Betrieb"],
    },
    featuresLabel: "Offene Voraussetzungen", featuresHead: "Was vor einer Entwicklung zu klären wäre.",
    features: [
      { icon: FileSearch, t: "Anfrageunterlagen", d: "Welche Formate und Anforderungen kommen tatsächlich vor?" },
      { icon: Factory, t: "Betriebsdaten", d: "Sind Fähigkeiten und Kapazitäten aktuell und ausreichend dokumentiert?" },
      { icon: CheckSquare, t: "Prüfkriterien", d: "Welche Fragen lassen sich vorbereiten, welche brauchen eine fachliche Einzelfallentscheidung?" },
      { icon: Handshake, t: "Verantwortung", d: "Wer prüft eine Einschätzung und verantwortet die anschließende Angebotsentscheidung?" },
    ],
    stepsLabel: "Möglicher Entwicklungsweg", stepsHead: "Nur aus belegtem Bedarf.",
    steps: [
      { t: "Kernangebot belegen", d: "Zuerst zahlende Kunden und messbaren Nutzen mit Analyse und Umsetzung gewinnen." },
      { t: "Nachfrage prüfen", d: "Wiederkehrenden, bezahlten Bedarf für eine konkrete Vorprüfung feststellen." },
      { t: "Umfang entscheiden", d: "Erst mit geeigneten Daten, Fachwissen und Testfällen über eine Umsetzung entscheiden." },
    ],
    outcomesHead: "Heute festgehalten.",
    outcomes: ["Ein möglicher späterer Anwendungsfall", "Offene fachliche und technische Voraussetzungen", "Keine Zusage eines verfügbaren Produkts", "Einstieg immer über die Analyse"],
    related: [HOW, { label: "Unser Entwicklungsweg", href: "/ueber-uns" }, { label: "Einsatzkontext Maschinenbau", href: "/branchen/maschinenbau" }],
    status: "perspektive", ctaPrimary: CONTACT, ctaSecondary: HOW,
  },
];

export const CATALOG: CatalogEntry[] = [...AGENTEN_ENTRIES, ...DIENSTLEISTUNGEN_ENTRIES, ...BRANCHEN_ENTRIES, ...PRODUKTE_ENTRIES];
export const AGENTEN = AGENTEN_ENTRIES;
export const DIENSTLEISTUNGEN = DIENSTLEISTUNGEN_ENTRIES;
export const BRANCHEN = BRANCHEN_ENTRIES;
export const PRODUKTE = PRODUKTE_ENTRIES;

export function entriesFor(category: Category): CatalogEntry[] {
  return CATALOG.filter((e) => e.category === category);
}
export function getEntry(category: Category, slug: string): CatalogEntry | undefined {
  return CATALOG.find((e) => e.category === category && e.slug === slug);
}
export function slugsFor(category: Category): { slug: string }[] {
  return entriesFor(category).map((e) => ({ slug: e.slug }));
}
