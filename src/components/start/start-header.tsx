"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SynotixMark } from "@/components/im-brand";

const LINKS = [
  { label: "Leistungen", href: "/dienstleistungen" },
  { label: "Lösungen", href: "/loesungen" },
  { label: "Branchen", href: "/branchen" },
  { label: "Unternehmen", href: "/ueber-uns" },
  { label: "Demo", href: "/demo" },
  { label: "Kontakt", href: "/kontakt" },
];

export function StartHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const aufStart = pathname === "/";
  const ctaHref = aufStart ? "#kontakt" : "/kontakt";
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 981px)");
    const zu = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", zu);
    return () => mq.removeEventListener("change", zu);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="st-header">
      <div className="st-header-in">
        <Link href="/" className="st-marke" aria-label="Synotix, zur Startseite">
          <SynotixMark size={22} />
          <span>Synotix</span>
        </Link>

        <nav className="st-nav" aria-label="Hauptnavigation">
          {LINKS.map((l) => <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>{l.label}</Link>)}
        </nav>

        <Link className="st-knopf st-knopf-klein" href={ctaHref} data-analytics-event="primary_cta_click">Erstgespräch</Link>

        <button
          ref={buttonRef}
          type="button"
          className="st-menue"
          aria-expanded={open}
          aria-controls="st-mobilmenue"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="st-sr">Menü</span>
          <span aria-hidden="true" className="st-menue-balken" />
        </button>
      </div>

      <nav id="st-mobilmenue" className="st-mobil" aria-label="Mobile Navigation" hidden={!open}>
        {LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>{l.label}</Link>)}
        <Link href={ctaHref} onClick={() => setOpen(false)}>Erstgespräch vereinbaren</Link>
      </nav>
    </header>
  );
}
