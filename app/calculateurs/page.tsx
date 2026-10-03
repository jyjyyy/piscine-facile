import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { calculators } from "@/lib/calculators";
import { PageHeader } from "@/components/PageHeader";
import { CalculatorIcon } from "@/components/CalculatorIcon";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Calculateurs piscine gratuits : volume, filtration, PAC, sel, chlore choc",
  description:
    "9 calculateurs gratuits pour votre piscine : volume, temps de filtration, pompe, consommation, pompe à chaleur, sel, chlore choc, conversions et indice de Langelier.",
  path: "/calculateurs",
});

export default function CalculateursPage() {
  return (
    <>
      <PageHeader title="Calculateurs piscine" intro="Des outils précis pour bien dimensionner, traiter et piloter votre piscine.">
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/calculateurs", label: "Calculateurs" }]} />
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c) => (
            <li key={c.slug}>
              <Link href={`/calculateurs/${c.slug}`} className="group flex h-full gap-4 rounded-2xl border border-eau-100 bg-white p-5 shadow-sm transition hover:border-eau-400 hover:shadow-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-turquoise-50 text-turquoise-700">
                  <CalculatorIcon name={c.icon} />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-eau-950">{c.name}</span>
                  <span className="mt-1 block text-sm text-slate-700">{c.short}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-eau-700">
                    Calculer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
