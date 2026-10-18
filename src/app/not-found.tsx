import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        background: "#0C0A14",
        color: "#F4F2FC",
        fontFamily: "var(--font-hanken), sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 13,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#3E5BA6",
          marginBottom: 18,
        }}
      >
        Fehler 404
      </div>
      <h1 style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: "18ch" }}>
        Diese Seite gibt es nicht.
      </h1>
      <p style={{ marginTop: 18, fontSize: 18, color: "#A4A0BA", maxWidth: "44ch", lineHeight: 1.6 }}>
        Der Link ist veraltet oder die Adresse wurde falsch eingegeben. Kein Problem — zurück zur
        konkreten Industrieprozessen.
      </p>
      <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            background: "#22386F",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            padding: "13px 24px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Zur Startseite →
        </Link>
        <Link
          href="/demo"
          style={{
            border: "1px solid rgba(255,255,255,0.16)",
            color: "#F4F2FC",
            fontWeight: 600,
            fontSize: 15,
            padding: "13px 24px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Beispiel-Demo ansehen
        </Link>
      </div>
    </main>
  );
}
