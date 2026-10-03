import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageSeo {
  title: string;
  description: string;
  /** Chemin de la page, ex : "/analyse-eau" */
  path: string;
  /** Type Open Graph */
  type?: "website" | "article";
  /** Date de publication (articles) */
  publishedTime?: string;
  /** Empêche l'indexation (ex : page Premium non lancée) */
  noIndex?: boolean;
  /** Chemin de l'image de partage (par défaut : image générale du site) */
  image?: string;
}

/** Génère des métadonnées uniques (title, description, canonical, Open Graph, Twitter) */
export function buildMetadata({ title, description, path, type = "website", publishedTime, noIndex, image = "/opengraph-image" }: PageSeo): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      // Image générée par un fichier opengraph-image.tsx (image générale ou image propre à la page)
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** URL absolue à partir d'un chemin */
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}
