import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/detail-page";
import { getEntry, slugsFor } from "@/lib/catalog";

export function generateStaticParams() {
  return slugsFor("agenten");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntry("agenten", slug);
  if (!e) return {};
  return {
    title: `${e.eyebrow.split(" · ").slice(1).join(" · ")} — Synotix`,
    description: e.metaDesc,
    alternates: { canonical: `/agenten/${slug}` },
  };
}

export default async function AgentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEntry("agenten", slug);
  if (!e) notFound();
  return <DetailPage e={e} />;
}
