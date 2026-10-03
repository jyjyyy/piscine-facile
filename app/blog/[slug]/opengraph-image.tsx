import { renderOgImage, ogSize } from "@/lib/og/ogTemplate";
import { getAllArticles, getArticle } from "@/lib/blog";

export const alt = "Guide piscine";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return renderOgImage(a?.title ?? "Guide piscine", a?.category ?? "Guide");
}
