import type { MetadataRoute } from "next";

// Zur Laufzeit auswerten, damit STAGING=1 ohne Neubau greift.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (process.env.STAGING === "1") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: "/api/" },
      { userAgent: "GPTBot", disallow: "/" },
    ],
    sitemap: "https://www.synotix.de/sitemap.xml",
  };
}
