import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getProblem, problems } from "@/lib/troubleshooting";
import { getArticle } from "@/lib/blog";
import { PageHeader } from "@/components/PageHeader";
import { TroubleshootingWizard } from "@/components/tools/TroubleshootingWizard";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FaqSection } from "@/components/FaqSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";

type Props = { params: Promise<{ slug: string }> };

/** Toutes les pages de dépannage sont générées au build (SSG) */
export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProblem(slug);
  if (!p) return {};
  return buildMetadata({ title: `${p.title} : causes et solutions`, description: p.metaDescription, path: `/depannage/${p.slug}`, image: `/depannage/${p.slug}/opengraph-image` });
}

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const article = problem.relatedArticle ? getArticle(problem.relatedArticle) : undefined;
  const others = problems.filter((p) => p.slug !== problem.slug).slice(0, 3);
  const hasProducts = Object.values(problem.nodes).some((n) => n.type === "result" && n.products.length > 0);

  return (
    <>
      <PageHeader title={problem.question} intro={problem.shortDescription}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Accueil" },
            { href: "/depannage", label: "Dépannage" },
            { href: `/depannage/${problem.slug}`, label: problem.title },
          ]}
        />
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        <TroubleshootingWizard problem={problem} />
        {hasProducts && <AffiliateDisclosure />}
        <AdSlot />

        <FaqSection faq={problem.faq} />

        <RelatedLinks
          links={[
            ...(article ? [{ href: `/blog/${article.slug}`, label: article.title }] : []),
            { href: "/analyse-eau", label: "Analyser mon eau et calculer les doses" },
            ...others.map((o) => ({ href: `/depannage/${o.slug}`, label: o.question })),
          ]}
        />
      </div>
    </>
  );
}
