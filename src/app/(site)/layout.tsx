import "../blau.css";
import "./site-chrome.css";
import "./infinity.css";
import "./neu.css";
import "../(start)/start.css";
import { StartHeader } from "@/components/start/start-header";
import { StartFooter } from "@/components/start/start-footer";
import { SmoothScroll } from "@/components/start/smooth-scroll";

/* Alle Unterseiten teilen sich Kopfzeile, Fuß und Schrift mit der Startseite. neu.css stellt das alte Design um. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="st-shell">
      <a className="st-skip" href="#main-content">Zum Inhalt springen</a>
      <SmoothScroll />
      <StartHeader />
      <div id="main-content" tabIndex={-1}>{children}</div>
      <StartFooter />
    </div>
  );
}
