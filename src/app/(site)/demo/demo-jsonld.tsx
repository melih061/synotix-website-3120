const BASE = "https://www.synotix.de";

const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: BASE },
        { "@type": "ListItem", position: 2, name: "DataSynth-Demo", item: `${BASE}/demo` },
      ],
    },
    {
      "@type": "WebPage",
      name: "DataSynth-Demo — Beispiel für eine maßgeschneiderte KI-Lösung",
      url: `${BASE}/demo`,
      inLanguage: "de-DE",
      description:
        "Beispiel für eine maßgeschneiderte KI-Lösung: interaktive Vorschau einer betreuten Rechnungsprüfung mit Musterdaten und menschlicher Freigabe.",
      isPartOf: { "@id": `${BASE}/#website` },
    },
  ],
};

export function DemoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAPH) }}
    />
  );
}
