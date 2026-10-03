import { CircleCheck, Clock, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ProductRecommendation } from "@/components/ProductRecommendation";
import { formatNumber } from "@/lib/format";
import { formatDose, type ParamResult, type Status, type WaterAnalysis } from "@/lib/waterCalc";

const statusLabel: Record<Status, string> = {
  bon: "Bon",
  "a-corriger": "À corriger",
  critique: "Critique",
};

const statusTone: Record<Status, "good" | "warning" | "critical"> = {
  bon: "good",
  "a-corriger": "warning",
  critique: "critical",
};

const statusBorder: Record<Status, string> = {
  bon: "border-l-emerald-500",
  "a-corriger": "border-l-amber-500",
  critique: "border-l-red-600",
};

function ParamCard({ p }: { p: ParamResult }) {
  const decimals = p.key === "ph" || p.key === "sanitizer" ? 2 : 0;
  return (
    <li className={`rounded-2xl border border-l-4 border-slate-200 bg-white p-4 ${statusBorder[p.status]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-slate-900">{p.label}</p>
        <Badge tone={statusTone[p.status]}>{statusLabel[p.status]}</Badge>
      </div>
      <p className="mt-1 text-2xl font-bold text-eau-950">
        {formatNumber(p.value, decimals)} <span className="text-sm font-medium text-slate-600">{p.unit}</span>
      </p>
      <p className="text-xs text-slate-600">Idéal : {p.idealRange}</p>
      <p className="mt-2 text-sm text-slate-700">{p.message}</p>
    </li>
  );
}

/** Affichage des résultats de l'analyse de l'eau */
export function WaterResults({ analysis, volume }: { analysis: WaterAnalysis; volume: number }) {
  const { params, actions, alerts } = analysis;

  return (
    <section aria-labelledby="titre-resultats" className="space-y-6">
      <h2 id="titre-resultats" className="text-2xl font-bold text-eau-950">
        Résultats pour {formatNumber(volume, 1)} m³
      </h2>

      {alerts.map((a) => (
        <Alert key={a} tone="danger" title="Attention">
          {a}
        </Alert>
      ))}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {params.map((p) => (
          <ParamCard key={p.key} p={p} />
        ))}
      </ul>

      {actions.length === 0 ? (
        <Alert tone="success" title="Votre eau est bien équilibrée">
          Aucune correction nécessaire. Continuez à contrôler pH et désinfectant 2 fois par semaine en saison.
        </Alert>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-eau-950">Corrections à faire, dans cet ordre</h3>
          <p className="text-sm text-slate-700">
            L&apos;ordre compte : le TAC stabilise le pH, et un pH correct rend le désinfectant efficace. Attendez
            quelques heures entre deux étapes et refaites une mesure.
          </p>
          <ol className="space-y-4">
            {actions.map((a) => (
              <li key={a.step} className="rounded-2xl border border-eau-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eau-700 font-bold text-white"
                    aria-hidden="true"
                  >
                    {a.step}
                  </span>
                  <div className="flex-1 space-y-3">
                    <h4 className="text-lg font-semibold text-slate-900">
                      <span className="sr-only">Étape {a.step} : </span>
                      {a.title}
                    </h4>
                    {a.dose && (
                      <div className="rounded-xl bg-eau-50 p-4">
                        <p className="flex items-center gap-2 text-sm font-medium text-eau-900">
                          <Droplets className="h-4 w-4" aria-hidden="true" />
                          {a.dose.product}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-eau-950">{formatDose(a.dose)}</p>
                        {!a.dose.exact && (
                          <p className="mt-1 text-xs text-slate-700">
                            Fourchette indicative (concentration du produit non renseignée) : suivez
                            l&apos;étiquette du fabricant et commencez par la valeur basse.
                          </p>
                        )}
                        <p className="mt-2 flex items-start gap-2 text-xs font-medium text-eau-900">
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          Ajoutez en plusieurs fois, filtration en marche, recontrôlez après quelques heures.
                        </p>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed text-slate-700">{a.detail}</p>
                    {a.productKeys.length > 0 && (
                      <div className="space-y-2">
                        {a.productKeys.map((k) => (
                          <ProductRecommendation key={k} productKey={k} compact />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="flex items-start gap-2 text-sm text-slate-700">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            Les quantités sont calculées pour votre volume et arrondies. Elles ne sont jamais absolues : chaque eau
            réagit différemment. Mieux vaut sous-doser puis compléter que l&apos;inverse.
          </p>
        </div>
      )}
    </section>
  );
}
