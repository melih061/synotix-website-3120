import type { NextConfig } from "next";

function analyticsOrigin() {
  const configuredSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim();
  const src = configuredSrc || "https://plausible.io/js/script.js";

  try {
    const url = new URL(src);
    return url.protocol === "https:" ? url.origin : "https://plausible.io";
  } catch {
    return "https://plausible.io";
  }
}

const approvedAnalyticsOrigin = analyticsOrigin();

// Staging (STAGING=1): nie indexieren und ohne upgrade-insecure-requests, weil das
// lokale Staging nur über http läuft (Safari würde sonst CSS/Fonts per https anfragen).
// headers() wird beim Build ausgewertet → STAGING als Build-Arg setzen.
const isStaging = process.env.STAGING === "1";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' ${approvedAnalyticsOrigin}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${approvedAnalyticsOrigin}`,
  ...(isStaging ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // Schlankes Runtime-Image: .next/standalone enthält server.js + nur die
  // tatsächlich importierten Module (kein vollständiges node_modules).
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          ...(isStaging ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
