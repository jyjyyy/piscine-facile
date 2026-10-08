import { CircleCheck, ExternalLink, Plus } from "lucide-react";
import { getAffiliate } from "@/config/affiliates";

/** Bouton / mention de lien affilié */
function PriceLink({ url, discreet = false }: { url: string; discreet?: boolean }) {
  if (!url) {
    return <span className="shrink-0 text-xs text-slate-500">Lien bientôt disponible</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={
        discreet
          ? "inline-flex shrink-0 items-center gap-1 text-sm font-medium text-eau-700 underline-offset-2 hover:underline"
          : "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      }
    >
      Voir le prix
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">(lien affilié, nouvel onglet)</span>
    </a>
  );
}

/**
 * Produits d'une saison du calendrier :
 *  - les indispensables, mis en avant (cartes vertes cochées) ;
 *  - les options, repliées par défaut et présentées discrètement.
 */
export function SeasonProducts({ essentials, options, note }: { essentials: string[]; options: string[]; note?: string }) {
  const must = essentials.map((k) => ({ key: k, p: getAffiliate(k) })).filter((x) => x.p);
  const extra = options.map((k) => ({ key: k, p: getAffiliate(k) })).filter((x) => x.p);

  return (
    <div className="space-y-4">
      <section aria-label="Produits indispensables" className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
        <h3 className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-bold text-emerald-900">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
          Les indispensables
          <span className="whitespace-nowrap text-sm font-normal text-emerald-800">({must.length} produits)</span>
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {must.map(({ key, p }) => (
            <li key={key} className="flex flex-col justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-emerald-100">
              <div>
                <p className="font-semibold text-slate-900">{p!.name}</p>
                <p className="mt-0.5 text-sm text-slate-600">{p!.description}</p>
              </div>
              <PriceLink url={p!.url} />
            </li>
          ))}
        </ul>
        {note && <p className="mt-3 text-sm text-emerald-950">{note}</p>}
      </section>

      {extra.length > 0 && (
        <details className="group rounded-2xl border border-slate-200 bg-white">
          <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-3 text-sm font-semibold text-slate-700 marker:hidden">
            <Plus className="h-4 w-4 transition-transform group-open:rotate-45" aria-hidden="true" />
            En option : {extra.length} produits pour plus de confort
            <span className="whitespace-nowrap font-normal text-slate-500">(facultatif)</span>
          </summary>
          <ul className="divide-y divide-slate-100 px-4 pb-2">
            {extra.map(({ key, p }) => (
              <li key={key} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-sm">
                  <span className="font-medium text-slate-800">{p!.name}</span>
                  <span className="text-slate-500"> – {p!.description}</span>
                </span>
                <PriceLink url={p!.url} discreet />
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
