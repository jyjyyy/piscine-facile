import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";

export interface Crumb {
  href: string;
  label: string;
}

/**
 * Fil d'Ariane visible + données structurées BreadcrumbList (affiché par Google sous le titre).
 * Conçu pour être placé dans le bandeau bleu (PageHeader).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${siteConfig.url}${c.href === "/" ? "" : c.href}`,
          })),
        }}
      />
      <nav aria-label="Fil d'Ariane" className="mt-5 text-sm text-eau-100">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="font-medium text-white">
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="hover:text-white hover:underline">
                      {c.label}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
