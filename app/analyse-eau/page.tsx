import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SafetyWarning } from "@/components/SafetyWarning";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { WaterAnalysisForm } from "@/components/tools/WaterAnalysisForm";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { siteConfig } from "@/config/site";

export const metadata = buildMetadata({
  title: "Analyse de l'eau de piscine : calcul des doses (pH, chlore, TAC)",
  description:
    "Saisissez pH, chlore, TAC et stabilisant : l'outil indique ce qui est à corriger, dans quel ordre, et calcule les quantités de produit pour votre volume.",
  path: "/analyse-eau",
});

const references = [
  ["pH", "7,2 à 7,4", "acceptable de 7,0 à 7,6"],
  ["Chlore libre", "1 à 3 mg/L", "brome : 2 à 4 mg/L"],
  ["TAC", "80 à 150 mg/L", "8 à 15 °f"],
  ["Stabilisant", "20 à 50 mg/L", "renouveler l'eau au-delà de 75 mg/L"],
  ["TH", "150 à 250 mg/L", "15 à 25 °f"],
];

export default function AnalyseEauPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `Analyse de l'eau de piscine – ${siteConfig.name}`,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Tous",
          inLanguage: "fr-FR",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          url: `${siteConfig.url}/analyse-eau`,
        }}
      />
      <PageHeader
        title="Analyse de l'eau de votre piscine"
        intro="Entrez vos mesures : nous vous disons ce qui ne va pas, dans quel ordre corriger, et combien de produit ajouter."
      >
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/analyse-eau", label: "Analyse de l'eau" }]} />
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        <SafetyWarning />
        <WaterAnalysisForm />
        <AdSlot />
        <section aria-labelledby="valeurs-ref" className="space-y-3">
          <h2 id="valeurs-ref" className="text-xl font-bold text-eau-950">
            Valeurs de référence utilisées
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-eau-50 text-eau-950">
                <tr>
                  <th scope="col" className="px-4 py-3">Paramètre</th>
                  <th scope="col" className="px-4 py-3">Valeur idéale</th>
                  <th scope="col" className="px-4 py-3">Remarque</th>
                </tr>
              </thead>
              <tbody>
                {references.map(([p, v, r]) => (
                  <tr key={p} className="border-t border-slate-200">
                    <th scope="row" className="px-4 py-3 font-medium">{p}</th>
                    <td className="px-4 py-3">{v}</td>
                    <td className="px-4 py-3 text-slate-600">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-600">
            Les doses de TAC plus, de chlore et de stabilisant sont calculées à partir de la chimie du produit. Les
            doses de pH plus et pH moins reposent sur les valeurs moyennes des fabricants (environ 100 g pour 10 m³ pour
            0,1 unité de pH), ajustées selon votre TAC : l&apos;effet réel varie d&apos;une eau à l&apos;autre.
          </p>
        </section>
        <AffiliateDisclosure />
        <RelatedLinks
          links={[
            { href: "/blog/baisser-monter-ph-piscine", label: "Comment baisser ou monter le pH de sa piscine" },
            { href: "/blog/tac-piscine-explique", label: "Le TAC de la piscine expliqué simplement" },
            { href: "/depannage/eau-verte", label: "Ma piscine est verte : que faire ?" },
            { href: "/calculateurs/volume", label: "Calculer le volume de ma piscine" },
          ]}
        />
      </div>
    </>
  );
}
