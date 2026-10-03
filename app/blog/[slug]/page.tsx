import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Clock } from "lucide-react";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { formatDateFr, getAllArticles, getArticle } from "@/lib/blog";
import { siteConfig } from "@/config/site";
import { mdxComponents } from "@/components/mdx";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductList } from "@/components/ProductRecommendation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ProCta } from "@/components/ProCta";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.description, path: `/blog/${a.slug}`, type: "article", publishedTime: a.date, image: `/blog/${a.slug}/opengraph-image` });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
    // remark-gfm : active les tableaux Markdown
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  const others = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);
  const hasAffiliates = (article.products?.length ?? 0) > 0 || article.content.includes("<Product");

  const jsonLd: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.updated ?? article.date,
      inLanguage: "fr-FR",
      author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
    },
  ];
  if (article.howTo) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: article.howTo.name,
      inLanguage: "fr-FR",
      step: article.howTo.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    });
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader title={article.title} intro={article.description}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Accueil" },
            { href: "/blog", label: "Guides" },
            { href: `/blog/${article.slug}`, label: article.title },
          ]}
        />
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-eau-100">
          <span>{article.category}</span> ·<time dateTime={article.date}>{formatDateFr(article.date)}</time> ·
          <Clock className="h-4 w-4" aria-hidden="true" /> {article.readingMinutes} min de lecture
        </p>
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        {hasAffiliates && <AffiliateDisclosure />}
        <article className="prose-piscine">{content}</article>
        <AdSlot />
        {article.products && article.products.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-eau-950">Produits utiles</h2>
            <ProductList keys={article.products} />
          </section>
        )}
        <ProCta />
        <RelatedLinks
          links={[
            ...(article.tool ? [article.tool] : []),
            ...others.map((o) => ({ href: `/blog/${o.slug}`, label: o.title })),
          ]}
        />
      </div>
    </>
  );
}
