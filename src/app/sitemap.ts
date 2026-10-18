import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.synotix.de";
  const main = [
    "", "/dienstleistungen", "/dienstleistungen/ki-agenten", "/dienstleistungen/n8n-workflows",
    "/dienstleistungen/schulung", "/dienstleistungen/managed-services", "/loesungen", "/branchen",
    "/produkte", "/produkte/datensynth", "/demo", "/ueber-uns", "/kontakt",
  ];
  return main.map((r) => ({
      url: `${base}${r}`,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : r.startsWith("/dienstleistungen") || r === "/kontakt" ? 0.9 : 0.7,
    }));
}
