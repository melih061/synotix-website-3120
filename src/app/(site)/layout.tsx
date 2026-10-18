import "../blau.css";
import "./site-chrome.css";
import "./infinity.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div id="main-content" tabIndex={-1}>{children}</div>
      <SiteFooter />
    </>
  );
}
