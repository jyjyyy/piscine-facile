import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { calculators, getCalculator } from "@/lib/calculators";
import { PageHeader } from "@/components/PageHeader";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { VolumeCalculator } from "@/components/tools/VolumeCalculator";
import { FiltrationCalculator } from "@/components/tools/FiltrationCalculator";
import { PumpCalculator } from "@/components/tools/PumpCalculator";
import { ConsumptionCalculator } from "@/components/tools/ConsumptionCalculator";
import { HeatPumpCalculator } from "@/components/tools/HeatPumpCalculator";
import { SaltCalculator } from "@/components/tools/SaltCalculator";
import { ShockCalculator } from "@/components/tools/ShockCalculator";
import { ConverterTool } from "@/components/tools/ConverterTool";
import { LangelierCalculator } from "@/components/tools/LangelierCalculator";

/** Association slug → composant de l'outil */
const tools: Record<string, ComponentType> = {
  volume: VolumeCalculator,
  filtration: FiltrationCalculator,
  pompe: PumpCalculator,
  consommation: ConsumptionCalculator,
  "pompe-a-chaleur": HeatPumpCalculator,
  sel: SaltCalculator,
  "chlore-choc": ShockCalculator,
  convertisseur: ConverterTool,
  "indice-langelier": LangelierCalculator,
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = getCalculator(slug);
  if (!c) return {};
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: `/calculateurs/${c.slug}`, image: `/calculateurs/${c.slug}/opengraph-image` });
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const info = getCalculator(slug);
  const Tool = tools[slug];
  if (!info || !Tool) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: info.h1,
          description: info.metaDescription,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Tous",
          inLanguage: "fr-FR",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          url: `${siteConfig.url}/calculateurs/${info.slug}`,
        }}
      />
      <PageHeader title={info.h1} intro={info.intro}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Accueil" },
            { href: "/calculateurs", label: "Calculateurs" },
            { href: `/calculateurs/${info.slug}`, label: info.name },
          ]}
        />
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        <Tool />
        <section className="prose-piscine max-w-3xl">
          <h2>Comment ça marche ?</h2>
          {info.explanation.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <FaqSection faq={info.faq} />
        <RelatedLinks links={info.related} />
      </div>
    </>
  );
}
