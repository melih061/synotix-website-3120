import type { Metadata } from "next";
import { DemoHub } from "@/components/demo-hub";

export const metadata: Metadata = {
  title: "Demo: Beispiel für eine maßgeschneiderte KI-Lösung — Synotix",
  description:
    "Beispiele für maßgeschneiderte KI-Lösungen mit Musterdaten: betreute Rechnungsprüfung mit DataSynth, ein technischer Wissens-Assistent und der Vergleich Ihrer Prozessmesswerte.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <div className="demo-skin">
      <DemoHub />
    </div>
  );
}
