import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { departmentSlug, electricianService } from "@/config/serviceArea";
import { electricianFaq } from "@/lib/electricianFaq";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ElectricianServices } from "@/components/ElectricianServices";
import { FaqSection } from "@/components/FaqSection";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ departement: string }> };

const find = (slug: string) => electricianService.departments.find((d) => departmentSlug(d) === slug);

/** Une page par département déclaré dans config/serviceArea.ts */
export function generateStaticParams() {
  if (!electricianService.enabled) return [];
  return electricianService.departments.map((d) => ({ departement: departmentSlug(d) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { departement } = await params;
  const d = find(departement);
  if (!d) return {};
  return buildMetadata({
    title: `Électricien piscine ${d.name} (${d.code}) : mise aux normes et dépannage`,
    description: `Électricien pour piscine dans le ${d.name} : ${d.cities.slice(0, 3).join(", ")}… Mise en conformité NF C 15-100, disjoncteur qui saute, éclairage, pompe à chaleur. Devis gratuit.`,
    path: `/electricien-piscine/${departmentSlug(d)}`,
  });
}

export default async function DepartementPage({ params }: Props) {
  const { departement } = await params;
  const d = find(departement);
  if (!d || !electricianService.enabled) notFound();

  const climateText =
    d.climate === "froid"
      ? `Dans le ${d.name}, les hivers rigoureux imposent de protéger l'installation du gel : sonde hors-gel sur le coffret de filtration, vidange des équipements en hivernage passif, et un local technique sain et ventilé pour éviter les défauts d'isolement dus à l'humidité.`
      : `Dans le ${d.name}, la saison de baignade est longue : pompes à chaleur, éclairage et filtration fonctionnent de nombreux mois par an. Des protections bien dimensionnées et un local technique ventilé évitent les déclenchements intempestifs et l'usure prématurée des équipements.`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Électricien piscine – ${d.name}`,
          serviceType: "Installation et dépannage électrique de piscine",
          provider: { "@id": `${siteConfig.url}/#organisation` },
          areaServed: { "@type": "AdministrativeArea", name: d.name },
          url: `${siteConfig.url}/electricien-piscine/${departmentSlug(d)}`,
        }}
      />
      <PageHeader title={`Électricien piscine dans le ${d.name} (${d.code})`} intro={d.localNote}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Accueil" },
            { href: "/electricien-piscine", label: "Électricien piscine" },
            { href: `/electricien-piscine/${departmentSlug(d)}`, label: d.name },
          ]}
        />
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        <section className="prose-piscine max-w-3xl">
          <h2>L&apos;électricité de votre piscine dans le {d.name}</h2>
          <p>{climateText}</p>
          <p>
            Mise en conformité selon la norme NF C 15-100, recherche de panne quand le différentiel saute, remplacement du coffret de filtration,
            éclairage LED en 12 V ou raccordement d&apos;une pompe à chaleur : chaque intervention est réalisée par un électricien qualifié.
          </p>
        </section>

        {d.cities.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-eau-950">Communes desservies</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {d.cities.map((c) => (
                <li key={c} className="inline-flex items-center gap-1 rounded-full bg-eau-50 px-3 py-1.5 text-sm text-eau-900">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-eau-950">Nos interventions</h2>
          <ElectricianServices />
        </section>

        <section className="grid gap-8 rounded-3xl border border-eau-100 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-2xl font-bold text-eau-950">Devis gratuit dans le {d.name}</h2>
            <p className="mt-2 text-slate-700">Décrivez votre installation : nous vous recontactons rapidement.</p>
          </div>
          <QuoteForm initialNeed="electricite" />
        </section>

        <FaqSection faq={electricianFaq} />
      </div>
    </>
  );
}
