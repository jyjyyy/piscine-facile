import Link from "next/link";
import { Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { formatDateFr, getAllArticles } from "@/lib/blog";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Guides piscine : entretien, traitement de l'eau, équipements",
  description:
    "Nos guides pratiques pour entretenir votre piscine : eau verte, pH, TAC, filtration, hivernage, électrolyseur, électricité, sécurité et guides d'achat.",
  path: "/blog",
});

/** Slug d'ancre pour une catégorie */
const anchor = (c: string) =>
  c
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function BlogPage() {
  const articles = getAllArticles();
  // Catégories dans l'ordre de première apparition (articles les plus récents d'abord)
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <>
      <PageHeader title="Guides et conseils" intro={`${articles.length} guides clairs pour entretenir votre piscine sereinement.`}>
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/blog", label: "Guides" }]} />
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <nav aria-label="Catégories" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c} href={`#${anchor(c)}`} className="rounded-full bg-eau-50 px-4 py-2 text-sm font-semibold text-eau-900 hover:bg-eau-100">
              {c}
            </a>
          ))}
        </nav>
        {categories.map((c) => (
          <section key={c} id={anchor(c)} aria-labelledby={`${anchor(c)}-titre`} className="scroll-mt-24">
            <h2 id={`${anchor(c)}-titre`} className="text-2xl font-bold text-eau-950">
              {c}
            </h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles
                .filter((a) => a.category === c)
                .map((a) => (
                  <li key={a.slug}>
                    <Link href={`/blog/${a.slug}`} className="flex h-full flex-col rounded-2xl border border-eau-100 bg-white p-5 shadow-sm transition hover:border-eau-400 hover:shadow-md">
                      <h3 className="text-lg font-semibold leading-snug text-eau-950">{a.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-slate-700">{a.description}</p>
                      <p className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                        <time dateTime={a.date}>{formatDateFr(a.date)}</time> ·
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {a.readingMinutes} min
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
