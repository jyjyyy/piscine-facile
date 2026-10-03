import Link from "next/link";
import { Children, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { ProductRecommendation } from "@/components/ProductRecommendation";
import { ElectricalWarning, SafetyWarning } from "@/components/SafetyWarning";

/** Encadré renvoyant vers un outil du site, utilisable dans les articles MDX */
function ToolCta({ href, title, children }: { href: string; title: string; children?: ReactNode }) {
  return (
    <div className="not-prose my-6 flex flex-col gap-3 rounded-2xl bg-eau-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-eau-950">{title}</p>
        {/* div et non p : MDX enveloppe déjà le texte dans un <p> */}
        {children && <div className="mt-1 text-sm text-slate-700 [&>p]:m-0">{children}</div>}
      </div>
      <Link href={href} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-eau-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-eau-800">
        Utiliser l&apos;outil <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/**
 * Supprime les nœuds texte vides (retours à la ligne) à l'intérieur des tableaux :
 * le navigateur les déplace hors du tableau, ce qui provoque une erreur d'hydratation React.
 */
function stripWhitespace(children: ReactNode): ReactNode[] {
  return Children.toArray(children).filter((c) => !(typeof c === "string" && c.trim() === ""));
}

/** Wrapper "not-prose" pour les composants insérés dans le texte */
function NotProse({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6">{children}</div>;
}

/**
 * Composants disponibles dans les fichiers MDX :
 *  <Callout tone="info|success|warning|danger" title="…">…</Callout>
 *  <Product id="cle-affiliation" />
 *  <ToolCta href="/analyse-eau" title="…">…</ToolCta>
 *  <SafetyWarning /> et <ElectricalWarning />
 */
export const mdxComponents = {
  Callout: ({ tone, title, children }: { tone?: "info" | "success" | "warning" | "danger"; title?: string; children: ReactNode }) => (
    <NotProse>
      <Alert tone={tone} title={title}>
        {children}
      </Alert>
    </NotProse>
  ),
  Product: ({ id }: { id: string }) => (
    <NotProse>
      <ProductRecommendation productKey={id} />
    </NotProse>
  ),
  ToolCta,
  SafetyWarning: () => (
    <NotProse>
      <SafetyWarning />
    </NotProse>
  ),
  ElectricalWarning: () => (
    <NotProse>
      <ElectricalWarning />
    </NotProse>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="overflow-x-auto">
      <table>{stripWhitespace(children)}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => <thead>{stripWhitespace(children)}</thead>,
  tbody: ({ children }: { children?: ReactNode }) => <tbody>{stripWhitespace(children)}</tbody>,
  tr: ({ children }: { children?: ReactNode }) => <tr>{stripWhitespace(children)}</tr>,
  a: ({ href = "", children }: { href?: string; children?: ReactNode }) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
};
