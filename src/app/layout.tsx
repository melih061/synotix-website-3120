import type { Metadata } from "next";
import { Figtree, JetBrains_Mono, Hanken_Grotesk, Manrope, Sora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { KONTAKT_EMAIL, SEO } from "@/lib/angebot";

const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-hanken" });
const figtree = Figtree({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-figtree" });
const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sora" });
/* Variable Schrift, wird beim Build selbst gehostet (kein Aufruf an Google beim Besuch). */
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains" });

const SITE_URL = "https://www.synotix.de";
const TITLE = SEO.title;
const DESCRIPTION = SEO.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s" },
  description: DESCRIPTION,
  keywords: SEO.keywords,
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: "Synotix",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "Synotix",
  description: DESCRIPTION,
  url: SITE_URL,
  email: KONTAKT_EMAIL,
  areaServed: "DE",
  inLanguage: "de-DE",
  slogan: SEO.slogan,
  founder: { "@type": "Person", name: "Melih Dönmez" },
  knowsAbout: ["KI-Beratung", "Prozessanalyse", "KI-Schulung", "Maßgeschneiderte KI-Lösungen", "Digitalisierung im Mittelstand"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [manrope.variable, sora.variable, hanken.variable, figtree.variable, jetbrains.variable].join(" ");

  return (
    <html lang="de" className={`dark scroll-smooth ${fontVars}`}>
      <body>
        {children}
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </body>
    </html>
  );
}
