export const ANALYTICS_EVENTS = [
  "primary_cta_click",
  "contact_form_start",
  "contact_form_success",
  "contact_form_error",
  "demo_start",
  "demo_complete",
  "booking_click",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

declare global {
  interface Window {
    plausible?: (event: AnalyticsEvent, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, props?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.plausible !== "function") return;
  window.plausible(event, props ? { props } : undefined);
}
