import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { problems } from "@/lib/troubleshooting";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProblemIcon } from "@/components/tools/ProblemIcon";
import { ProCta } from "@/components/ProCta";

export const metadata = buildMetadata({
  title: "Assistant de dépannage piscine : trouvez la cause de votre problème",
  description:
    "Eau verte, eau trouble, pompe en panne, disjoncteur qui saute, fuite… Répondez à quelques questions et obtenez les causes probables et les étapes pour résoudre le problème.",
  path: "/depannage",
});

export default function DepannagePage() {
  return (
    <>
      <PageHeader
        title="Assistant de dépannage"
        intro="Choisissez votre problème, répondez à quelques questions simples : nous vous indiquons les causes probables et quoi faire."
      >
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/depannage", label: "Dépannage" }]} />
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/depannage/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-eau-100 bg-white p-5 shadow-sm transition hover:border-eau-400 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-eau-50 text-eau-700">
                  <ProblemIcon name={p.icon} />
                </span>
                <span className="mt-3 text-lg font-semibold text-eau-950">{p.title}</span>
                <span className="mt-1 flex-1 text-sm text-slate-700">{p.shortDescription}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-eau-700 group-hover:gap-2">
                  Lancer le diagnostic <ArrowRight className="h-4 w-4 transition-all" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ProCta />
      </div>
    </>
  );
}
