import type { Metadata } from "next";

export const SITE_URL = "https://www.synotix.de";
export const SITE_NAME = "Synotix";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  image?: string;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
