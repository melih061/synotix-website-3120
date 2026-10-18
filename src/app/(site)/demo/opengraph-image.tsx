import { ImageResponse } from "next/og";

export const alt = "DataSynth-Demo — Beispiel für eine maßgeschneiderte KI-Lösung mit menschlicher Freigabe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CARDS = [
  { num: "01", label: "Auslesen", metric: "Musterdaten" },
  { num: "02", label: "Prüfhinweise", metric: "Abweichungen markieren" },
  { num: "03", label: "Freigabe", metric: "Mensch entscheidet" },
];

export default function DemoOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0C0A14",
          backgroundImage:
            "radial-gradient(900px 600px at 78% 12%, rgba(62,91,166,0.35), transparent 60%)",
          color: "#F4F2FC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, backgroundColor: "#3E5BA6", borderRadius: 3 }} />
          <div style={{ fontSize: 28, letterSpacing: 8, color: "#C9C6DA" }}>SYNOTIX</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2, maxWidth: 960 }}>
            DataSynth-Demo.
          </div>
          <div style={{ marginTop: 20, fontSize: 28, color: "#A4A0BA", maxWidth: 860 }}>
            Beispiel für eine maßgeschneiderte Lösung · Freigabe durch Menschen
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {CARDS.map((card) => (
            <div
              key={card.num}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "20px 22px",
                backgroundColor: "#100E1A",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 18, color: "#6E6A86", letterSpacing: 3 }}>{card.num}</div>
              <div style={{ marginTop: 8, fontSize: 26, fontWeight: 600 }}>{card.label}</div>
              <div style={{ marginTop: 6, fontSize: 20, color: "#5A7AD0" }}>{card.metric}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
