import { Bell, History, Layers, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";

/*
 * Page préparée pour une future offre Premium.
 * Elle n'est pas liée dans le menu et n'est pas indexée (noIndex).
 * Pour l'afficher dans le menu : passez siteConfig.features.premium à true et ajoutez le lien dans config/site.ts.
 */
export const metadata = buildMetadata({
  title: "PiscineFacile Premium (bientôt)",
  description: "Historique des analyses, rappels personnalisés, gestion de plusieurs bassins : découvrez la future offre Premium.",
  path: "/premium",
  noIndex: true,
});

const features = [
  { icon: History, title: "Historique des analyses", text: "Retrouvez toutes vos mesures et suivez l'évolution de votre eau sous forme de graphiques." },
  { icon: Bell, title: "Rappels personnalisés", text: "Recevez un rappel pour contrôler l'eau, laver le filtre ou préparer l'hivernage, au bon moment." },
  { icon: Layers, title: "Plusieurs bassins", text: "Piscine, spa, bassin de location : gérez-les tous depuis un seul compte." },
  { icon: Sparkles, title: "Conseils sur mesure", text: "Des recommandations adaptées à votre équipement et à votre région." },
];

export default function PremiumPage() {
  return (
    <>
      <PageHeader title="PiscineFacile Premium" intro="Bientôt disponible : l'assistant qui suit votre piscine toute l'année." />
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
        <ul className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-eau-100 bg-white p-5 shadow-sm">
              <Icon className="h-7 w-7 text-turquoise-600" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-semibold text-eau-950">{title}</h2>
              <p className="mt-1 text-sm text-slate-700">{text}</p>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl bg-eau-50 p-6 text-center">
          <p className="text-lg font-semibold text-eau-950">Offre en préparation</p>
          <p className="mt-1 text-slate-700">Les outils gratuits restent et resteront accessibles à tous.</p>
        </div>
      </div>
    </>
  );
}
