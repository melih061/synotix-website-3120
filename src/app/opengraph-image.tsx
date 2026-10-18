import { ImageResponse } from "next/og";

export const alt = "Synotix — KI-Beratung und Umsetzung für den Mittelstand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0C0A14",
          backgroundImage:
            "radial-gradient(900px 600px at 78% 18%, rgba(62,91,166,0.35), transparent 60%)",
          color: "#F4F2FC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, backgroundColor: "#3E5BA6", borderRadius: 3 }} />
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#C9C6DA" }}>SYNOTIX</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 74, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2, maxWidth: 940 }}>
            Erst analysieren, dann bauen.
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#A4A0BA", maxWidth: 820 }}>
            KI-Beratung · Maßgeschneiderte Lösungen · Schulung · Begleitung
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#6E6A86" }}>
          <div style={{ width: 12, height: 12, backgroundColor: "#3E5BA6", borderRadius: 999 }} />
          <div>synotix.de</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
