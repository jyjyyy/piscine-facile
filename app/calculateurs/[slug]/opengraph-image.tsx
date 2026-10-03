import { renderOgImage, ogSize } from "@/lib/og/ogTemplate";
import { calculators, getCalculator } from "@/lib/calculators";

export const alt = "Calculateur piscine";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCalculator(slug);
  return renderOgImage(c?.h1 ?? "Calculateur piscine", "Calculateur gratuit");
}
