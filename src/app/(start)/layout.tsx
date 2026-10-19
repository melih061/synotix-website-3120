import "./start.css";
import { StartHeader } from "@/components/start/start-header";
import { StartFooter } from "@/components/start/start-footer";
import { SmoothScroll } from "@/components/start/smooth-scroll";

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="st-root st-shell">
      <a className="st-skip" href="#main-content">Zum Inhalt springen</a>
      <SmoothScroll />
      <StartHeader />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <StartFooter />
    </div>
  );
}
