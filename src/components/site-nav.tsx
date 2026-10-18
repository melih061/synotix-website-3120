"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { SynotixLogo } from "./im-brand";

const PRIMARY = [
  { label: "Startseite", href: "/" },
  { label: "Leistungen", href: "/dienstleistungen" },
  { label: "Lösungen", href: "/loesungen" },
  { label: "Branchen", href: "/branchen" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Demo", href: "/demo" },
  { label: "Kontakt", href: "/kontakt" },
];

const GROUPS = [
  {
    title: "Leistungen",
    links: [
      { label: "Analyse & Strategie", href: "/dienstleistungen/ki-agenten" },
      { label: "Maßgeschneiderte Lösungen", href: "/dienstleistungen/n8n-workflows" },
      { label: "Schulung & Enablement", href: "/dienstleistungen/schulung" },
      { label: "Begleitung", href: "/dienstleistungen/managed-services" },
    ],
  },
  {
    title: "Beispiellösungen",
    links: [
      { label: "DataSynth: Rechnungsprüfung", href: "/produkte/datensynth" },
      { label: "Wissenssuche", href: "/produkte/wissens-agent" },
      { label: "Alle Beispiellösungen", href: "/produkte" },
      { label: "Technische Beispiele", href: "/agenten" },
    ],
  },
  {
    title: "Branchen",
    links: [
      { label: "Produktion & Fertigung", href: "/branchen/produktion" },
      { label: "Maschinenbau", href: "/branchen/maschinenbau" },
      { label: "Logistik & Supply Chain", href: "/branchen/logistik" },
      { label: "Qualitätssicherung", href: "/branchen/qualitaetssicherung" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { label: "Über uns", href: "/ueber-uns" },
      { label: "So beginnt die Zusammenarbeit", href: "/#zusammenarbeit" },
      { label: "Technischer Hintergrund", href: "/plattform" },
      { label: "Karriere", href: "/karriere" },
    ],
  },
];

/* Desktop-Leiste: Kategorien oben, jede klappt nach unten auf. */
type DropItem = { label: string; href: string; d?: string };
const TOPNAV: { title: string; href: string; items: DropItem[]; all: DropItem }[] = [
  {
    title: "Leistungen", href: "/dienstleistungen",
    items: [
      { label: "Analyse & Strategie", href: "/dienstleistungen/ki-agenten", d: "Bezahlte Prozessanalyse mit Empfehlung nach Bedarf" },
      { label: "Maßgeschneiderte Lösungen", href: "/dienstleistungen/n8n-workflows", d: "KI-Lösung oder Digitalisierungsschritt für Ihren Prozess" },
      { label: "Schulung & Enablement", href: "/dienstleistungen/schulung", d: "Workshops für Geschäftsführung und Teams" },
      { label: "Begleitung", href: "/dienstleistungen/managed-services", d: "Nach der Abnahme, in vereinbarten Grenzen" },
    ],
    all: { label: "Alle Leistungen im Überblick", href: "/dienstleistungen" },
  },
  {
    title: "Lösungen", href: "/loesungen",
    items: [
      { label: "DataSynth: Rechnungsprüfung", href: "/produkte/datensynth", d: "Beispiellösung, technisch vorbereitet" },
      { label: "Wissenssuche", href: "/produkte/wissens-agent", d: "Firmenwissen finden, mit Quellen" },
      { label: "Prozessautomatisierung", href: "/produkte/prozessautomatisierung", d: "Ein Prozess, ein klarer Auftrag" },
      { label: "Demo mit Beispieldaten", href: "/demo", d: "Eine Lösung im Ablauf ansehen" },
    ],
    all: { label: "Alle Lösungen im Überblick", href: "/loesungen" },
  },
  {
    title: "Branchen", href: "/branchen",
    items: [
      { label: "Produktion & Fertigung", href: "/branchen/produktion" },
      { label: "Maschinenbau", href: "/branchen/maschinenbau" },
      { label: "Logistik & Supply Chain", href: "/branchen/logistik" },
      { label: "Qualitätssicherung", href: "/branchen/qualitaetssicherung" },
    ],
    all: { label: "Alle Branchen, auch Ihre", href: "/branchen" },
  },
  {
    title: "Unternehmen", href: "/ueber-uns",
    items: [
      { label: "Über uns", href: "/ueber-uns", d: "Melih Dönmez, Gründer und Ansprechpartner" },
      { label: "So beginnt die Zusammenarbeit", href: "/#zusammenarbeit", d: "Erstgespräch, Analyse, Umsetzung" },
      { label: "Technischer Hintergrund", href: "/plattform" },
      { label: "Karriere", href: "/karriere" },
    ],
    all: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
];

function TopNav({ pathname }: { pathname: string }) {
  const [drop, setDrop] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => { setDrop(null); }, [pathname]);
  useEffect(() => {
    if (drop === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrop(null); };
    const onDown = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setDrop(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [drop]);

  return (
    <nav ref={navRef} className="im-topnav" aria-label="Hauptnavigation">
      <ul>
        {TOPNAV.map((g, i) => {
          const active = pathname === g.href || g.items.some((it) => it.href === pathname);
          return (
            <li
              key={g.title}
              className={drop === i ? "is-drop" : undefined}
              onMouseEnter={() => setDrop(i)}
              onMouseLeave={() => setDrop((d) => (d === i ? null : d))}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrop((d) => (d === i ? null : d)); }}
            >
              <button
                type="button"
                className={`im-topnav-btn${active ? " is-active" : ""}`}
                aria-expanded={drop === i}
                aria-controls={`im-drop-${i}`}
                onClick={() => setDrop((d) => (d === i ? null : i))}
              >
                {g.title} <ChevronDown size={14} aria-hidden="true" />
              </button>
              <div id={`im-drop-${i}`} className="im-drop" hidden={drop !== i}>
                <ul>
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <Link href={it.href} aria-current={pathname === it.href ? "page" : undefined}>
                        <b>{it.label}</b>
                        {it.d && <small>{it.d}</small>}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className="im-drop-all" href={g.all.href}>
                  {g.all.label} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </li>
          );
        })}
        <li>
          <Link href="/kontakt" className={`im-topnav-btn${pathname === "/kontakt" ? " is-active" : ""}`}>Kontakt</Link>
        </li>
      </ul>
    </nav>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü schließen, wenn die Route wechselt
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return () => { document.body.style.overflow = ""; };
    const menu = menuRef.current;
    menu?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !menu) return;
      const items = [burgerRef.current, ...menu.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`im-nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <a className="im-skip" href="#main-content">Zum Inhalt</a>
      <div className="im-nav-in">
        <Link href="/" className="im-nav-brand" aria-label="Synotix – Startseite">
          <SynotixLogo />
        </Link>
        <TopNav pathname={pathname} />
        <div className="im-nav-right">
          <Link className="im-pill im-pill-glass im-nav-cta" href="/kontakt">
            Erstgespräch vereinbaren <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={burgerRef}
            className="im-burger"
            aria-expanded={open}
            aria-controls="im-menu"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div id="im-menu" ref={menuRef} className="im-menu" role="dialog" aria-modal="true" aria-label="Hauptmenü" hidden={!open}>
        <div className="im-menu-in">
          <nav aria-label="Hauptnavigation (Menü)">
            <ul className="im-menu-primary">
              {PRIMARY.map((l, i) => (
                <li key={l.href} style={{ ["--i" as string]: i }}>
                  <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                    <span className="im-menu-n">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="im-menu-groups">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <p className="im-menu-lbl">{g.title}</p>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="im-menu-foot">
          <span>Direkter Ansprechpartner: Melih Dönmez</span>
          <Link className="im-pill im-pill-light" href="/kontakt">Erstgespräch vereinbaren <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </header>
  );
}
