"use client";

import Script from "next/script";
import { useEffect } from "react";
import { ANALYTICS_EVENTS, type AnalyticsEvent, trackEvent } from "@/lib/analytics-events";

/** Optionale Reichweitenmessung; wird nur bei gesetzter Domain eingebunden. */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const configuredSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim();
  const src = configuredSrc || "https://plausible.io/js/script.js";
  let approvedSrc: string | null = null;

  try {
    const url = new URL(src);
    approvedSrc = url.protocol === "https:" ? url.toString() : null;
  } catch {
    approvedSrc = null;
  }

  useEffect(() => {
    const allowedEvents = new Set<string>(ANALYTICS_EVENTS);
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      const eventName = target?.dataset.analyticsEvent;
      if (eventName && allowedEvents.has(eventName)) trackEvent(eventName as AnalyticsEvent);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return domain && approvedSrc
    ? <Script defer data-domain={domain} src={approvedSrc} strategy="afterInteractive" />
    : null;
}
