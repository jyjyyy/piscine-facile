"use client";

import { useRef, useState } from "react";
import { ArrowLeft, CircleCheck, ListOrdered, RotateCcw, Search } from "lucide-react";
import type { TsProblem, TsResult } from "@/lib/troubleshooting";
import { Badge } from "@/components/ui/Badge";
import { ProductRecommendation } from "@/components/ProductRecommendation";
import { ElectricalWarning } from "@/components/SafetyWarning";
import { ProCta } from "@/components/ProCta";

const severityInfo: Record<TsResult["severity"], { label: string; tone: "good" | "warning" | "critical" }> = {
  diy: { label: "Réalisable vous-même", tone: "good" },
  pro: { label: "Professionnel conseillé", tone: "warning" },
  electricien: { label: "Électricien obligatoire", tone: "critical" },
};

/** Assistant de dépannage interactif : parcourt l'arbre de décision d'un problème */
export function TroubleshootingWizard({ problem }: { problem: TsProblem }) {
  const [path, setPath] = useState<string[]>([problem.startNode]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const currentId = path[path.length - 1];
  const node = problem.nodes[currentId];

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());
  const go = (next: string) => {
    setPath((p) => [...p, next]);
    focusHeading();
  };
  const back = () => {
    setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
    focusHeading();
  };
  const restart = () => {
    setPath([problem.startNode]);
    focusHeading();
  };

  if (!node) return null;
  const questionNumber = path.length;

  return (
    <div className="rounded-3xl border border-eau-100 bg-white p-5 shadow-sm sm:p-8">
      {node.type === "question" ? (
        <div>
          <p className="text-sm font-semibold text-turquoise-700">Question {questionNumber}</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-xl font-bold text-eau-950 sm:text-2xl">
            {node.text}
          </h2>
          {node.help && <p className="mt-2 text-sm text-slate-600">{node.help}</p>}
          <div className="mt-6 grid gap-3">
            {node.options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => go(o.next)}
                className="rounded-2xl border-2 border-eau-100 bg-eau-50/40 px-5 py-4 text-left text-base font-medium text-slate-900 transition-colors hover:border-eau-500 hover:bg-eau-50"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <Badge tone={severityInfo[node.severity].tone}>{severityInfo[node.severity].label}</Badge>
            <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-bold text-eau-950 sm:text-2xl">
              {node.title}
            </h2>
          </div>

          {node.severity === "electricien" && <ElectricalWarning />}

          <section>
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Search className="h-5 w-5 text-eau-700" aria-hidden="true" /> Causes probables
            </h3>
            <ul className="mt-2 space-y-1.5">
              {node.causes.map((c) => (
                <li key={c} className="flex gap-2 text-slate-700">
                  <CircleCheck className="mt-1 h-4 w-4 shrink-0 text-turquoise-600" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <ListOrdered className="h-5 w-5 text-eau-700" aria-hidden="true" /> Étapes de résolution
            </h3>
            <ol className="mt-3 space-y-3">
              {node.steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-eau-700 text-sm font-bold text-white" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-slate-800">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {node.products.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-slate-900">Produits utiles</h3>
              {node.products.map((k) => (
                <ProductRecommendation key={k} productKey={k} />
              ))}
            </section>
          )}

          {(node.showPro || node.severity !== "diy") && (
            <ProCta
              need={problem.proNeed}
              title={node.severity === "electricien" ? "Faire intervenir un électricien qualifié" : "Le problème persiste ?"}
              text={
                node.severity === "electricien"
                  ? "Décrivez la situation : nous transmettons votre demande à un électricien près de chez vous."
                  : "Si ces étapes ne suffisent pas, un professionnel peut établir un diagnostic sur place."
              }
            />
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        {path.length > 1 && (
          <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-eau-800 hover:bg-eau-50">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Question précédente
          </button>
        )}
        {path.length > 1 && (
          <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-eau-800 hover:bg-eau-50">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Recommencer
          </button>
        )}
      </div>
    </div>
  );
}
