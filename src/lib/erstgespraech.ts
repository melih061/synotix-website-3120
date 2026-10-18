/* Auswahlwerte des Erstgespräch-Formulars. Ohne Abhängigkeiten, damit
   Formular (Client) und API (Server, node:test) dieselbe Liste nutzen. */

export const ANLIEGEN = [
  "Einen Ablauf analysieren lassen",
  "Maßgeschneiderte Lösung",
  "Schulung für mein Team",
  "Noch unklar, ich möchte mich orientieren",
] as const;

export const MITARBEITENDE = ["unter 10", "10–25", "26–75", "über 75"] as const;

export const BRANCHE_MAX = 80;
