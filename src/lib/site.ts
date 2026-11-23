import type { Metadata } from "next";

export const SITE_URL = "https://himanshumendapara.com";
export const SITE_HOST = "himanshumendapara.com";
export const SITE_NAME = "Himanshu Mendapara";

/**
 * Title, description and the Open Graph / X tags for a page. A child's
 * `openGraph` replaces its parent's whole, so every page needs its own.
 * The share image itself comes from the route's `opengraph-image.tsx`.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
