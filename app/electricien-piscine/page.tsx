import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { departmentSlug, electricianService } from "@/config/serviceArea";
import { electricianFaq } from "@/lib/electricianFaq";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ElectricianServices } from "@/components/ElectricianServices";
import { FaqSection } from "@/components/FaqSection";
import { QuoteForm } from "@/components/QuoteForm";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "Électricien piscine : mise aux normes, dépannage, éclairage, PAC",
  description:
    "Électricien qualifié pour votre piscine : mise en conformité NF C 15-100, disjoncteur qui saute, coffret de filtration, éclairage 12 V, raccordement de pompe à chaleur. Devis gratuit.",
  path: "/electricien-piscine",
});

export default function ElectricienPiscinePage() {
  if (!electricianService.enabled) notFound();
  const { departments, qualifications, insurance } = electricianService;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Électricien piscine",
          serviceType: "Installation et dépannage électrique de piscine",
          provider: { "@id": `${siteConfig.url}/#organisation` },
          areaServed: departments.length > 0 ? departments.map((d) => ({ "@type": "AdministrativeArea", name: d.name })) : { "@type": "Country", name: "France" },
          url: `${siteConfig.url}/electricien-piscine`,
        }}
      />
      <PageHeader title="Électricien pour votre piscine" intro="Mise aux normes, dépannage, éclairage, pompe à chaleur : confiez l'électricité de votre piscine à un professionnel qualifié.">
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/electricien-piscine", label: "Électricien piscine" }]} />
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {(qualifications.length > 0 || insurance) && (
          <div className="flex flex-wrap gap-2">
            {qualifications.map((q) => (
              <span key={q} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" /> {q}
              </span>
            ))}
            {insurance && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800">{insurance}</span>}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-eau-950">Nos interventions</h2>
          <ElectricianServices />
        </section>

        <section className="prose-piscine max-w-3xl">
          <h2>Pourquoi un électricien spécialisé piscine ?</h2>
          <p>
            Eau et électricité ne font pas bon ménage : autour d&apos;un bassin, une fuite de courant de quelques milliampères peut être
            dangereuse. La norme NF C 15-100 consacre donc une partie entière aux piscines (partie 7-702) : volumes de sécurité, très basse tension
            pour l&apos;éclairage immergé, différentiel 30 mA, liaison équipotentielle des éléments conducteurs.
          </p>
          <p>
            Un électricien qui connaît les équipements de piscine (pompes, pompes à chaleur, électrolyseurs, projecteurs) diagnostique plus vite et
            installe des protections adaptées à chaque appareil. Pour en savoir plus, consultez notre <Link href="/guide-electrique">guide électrique de la piscine</Link>.
          </p>
        </section>

        {departments.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-eau-950">Zones d&apos;intervention</h2>
            <ul className="flex flex-wrap gap-2">
              {departments.map((d) => (
                <li key={d.code}>
                  <Link href={`/electricien-piscine/${departmentSlug(d)}`} className="inline-flex items-center gap-1.5 rounded-full bg-eau-50 px-4 py-2 text-sm font-medium text-eau-900 hover:bg-eau-100">
                    <MapPin className="h-4 w-4" aria-hidden="true" /> {d.name} ({d.code})
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="devis-elec" className="grid gap-8 rounded-3xl border border-eau-100 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="devis-elec" className="text-2xl font-bold text-eau-950">
              Demander un devis
            </h2>
            <p className="mt-2 text-slate-700">Décrivez votre installation et le problème rencontré. Réponse rapide, devis gratuit.</p>
          </div>
          <QuoteForm initialNeed="electricite" />
        </section>

        <FaqSection faq={electricianFaq} />
        <RelatedLinks
          links={[
            { href: "/depannage/disjoncteur-differentiel-saute", label: "Assistant : le disjoncteur ou le différentiel saute" },
            { href: "/blog/norme-electrique-piscine", label: "Norme électrique piscine : l'essentiel" },
            { href: "/calculateurs/pompe-a-chaleur", label: "Calculer la puissance d'une pompe à chaleur" },
          ]}
        />
      </div>
    </>
  );
}
