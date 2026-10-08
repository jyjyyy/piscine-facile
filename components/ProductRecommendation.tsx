import { ExternalLink, ShoppingCart } from "lucide-react";
import { getAffiliate } from "@/config/affiliates";

/**
 * Carte "produit conseillé" avec lien d'affiliation.
 * Les données viennent de config/affiliates.ts (clé `productKey`).
 * Si le lien n'est pas encore renseigné, aucun lien n'est affiché.
 */
export function ProductRecommendation({ productKey, compact = false }: { productKey: string; compact?: boolean }) {
  const product = getAffiliate(productKey);
  if (!product) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-turquoise-200 bg-turquoise-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0 text-turquoise-700" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-turquoise-800">Produit conseillé</p>
          <p className="font-semibold text-slate-900">{product.name}</p>
          {!compact && <p className="text-sm text-slate-700">{product.description}</p>}
        </div>
      </div>
      {product.url ? (
        <a
          href={product.url}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-turquoise-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-turquoise-800"
        >
          Voir le prix
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">(lien affilié, nouvel onglet)</span>
        </a>
      ) : (
        <span className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-center text-sm text-slate-600">
          Lien bientôt disponible
        </span>
      )}
    </div>
  );
}

/** Liste de produits conseillés */
export function ProductList({ keys, compact = false }: { keys: readonly string[]; compact?: boolean }) {
  if (keys.length === 0) return null;
  return (
    <div className="space-y-3">
      {keys.map((k) => (
        <ProductRecommendation key={k} productKey={k} compact={compact} />
      ))}
    </div>
  );
}
