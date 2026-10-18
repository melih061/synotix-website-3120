import { Manrope } from "next/font/google";
import "./start.css";
import { StartHeader } from "@/components/start/start-header";
import { StartFooter } from "@/components/start/start-footer";
import { SmoothScroll } from "@/components/start/smooth-scroll";

/* Variable Schrift, wird beim Build selbst gehostet (kein Aufruf an Google beim Besuch). */
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`st-root ${manrope.variable}`}>
      <a className="st-skip" href="#main-content">Zum Inhalt springen</a>
      <SmoothScroll />
      <StartHeader />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <StartFooter />
    </div>
  );
}
