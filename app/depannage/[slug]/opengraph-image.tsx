import { renderOgImage, ogSize } from "@/lib/og/ogTemplate";
import { getProblem, problems } from "@/lib/troubleshooting";

export const alt = "Assistant de dépannage piscine";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProblem(slug);
  return renderOgImage(p?.question ?? "Dépannage piscine", "Assistant de dépannage");
}
