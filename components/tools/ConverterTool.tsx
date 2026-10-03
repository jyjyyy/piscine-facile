"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { formatNumber, parseInput } from "@/lib/format";
import { chlorine, hardness } from "@/lib/treatmentCalc";

type HardUnit = "mg" | "f" | "dh" | "mmol";
const hardToMg: Record<HardUnit, (v: number) => number> = {
  mg: (v) => v,
  f: hardness.frenchToMg,
  dh: hardness.germanToMg,
  mmol: hardness.mmolToMg,
};

/** Convertisseur d'unités (dureté / TAC et chlore liquide) */
export function ConverterTool() {
  const [hValue, setHValue] = useState("");
  const [hUnit, setHUnit] = useState<HardUnit>("f");
  const [cValue, setCValue] = useState("");

  const hv = parseInput(hValue);
  const mg = hv !== null ? hardToMg[hUnit](hv) : null;
  const deg = parseInput(cValue);
  const gl = deg !== null ? chlorine.degreesToGPerL(deg) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-eau-100 bg-white p-5">
        <h2 className="text-lg font-semibold text-eau-950">TAC et TH (dureté)</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input id="c-h" label="Valeur" inputMode="decimal" value={hValue} onChange={(e) => setHValue(e.target.value)} placeholder="ex : 12" />
          <Select
            id="c-hu"
            label="Unité"
            value={hUnit}
            onChange={(e) => setHUnit(e.target.value as HardUnit)}
            options={[
              { value: "f", label: "°f (degré français)" },
              { value: "mg", label: "mg/L (ppm) CaCO3" },
              { value: "dh", label: "°dH (degré allemand)" },
              { value: "mmol", label: "mmol/L" },
            ]}
          />
        </div>
        {mg !== null && (
          <dl className="grid grid-cols-2 gap-2 text-sm" aria-live="polite">
            {[
              ["mg/L (ppm)", formatNumber(mg, 1)],
              ["°f", formatNumber(hardness.mgToFrench(mg), 1)],
              ["°dH", formatNumber(hardness.mgToGerman(mg), 1)],
              ["mmol/L", formatNumber(hardness.mgToMmol(mg), 2)],
            ].map(([k, val]) => (
              <div key={k} className="rounded-xl bg-eau-50 p-3">
                <dt className="text-slate-600">{k}</dt>
                <dd className="text-lg font-bold text-eau-950">{val}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="text-xs text-slate-600">1 °f = 10 mg/L de CaCO3 · 1 °dH = 1,78 °f · 1 ppm = 1 mg/L</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-eau-100 bg-white p-5">
        <h2 className="text-lg font-semibold text-eau-950">Chlore liquide</h2>
        <Input id="c-chl" label="Degré chlorométrique" unit="°chl" inputMode="decimal" value={cValue} onChange={(e) => setCValue(e.target.value)} placeholder="ex : 48" />
        {gl !== null && (
          <dl className="grid grid-cols-2 gap-2 text-sm" aria-live="polite">
            <div className="rounded-xl bg-eau-50 p-3">
              <dt className="text-slate-600">Chlore actif</dt>
              <dd className="text-lg font-bold text-eau-950">{formatNumber(gl, 1)} g/L</dd>
            </div>
            <div className="rounded-xl bg-eau-50 p-3">
              <dt className="text-slate-600">% chlore actif (≈)</dt>
              <dd className="text-lg font-bold text-eau-950">{formatNumber(chlorine.gPerLToPercent(gl), 1)} %</dd>
            </div>
          </dl>
        )}
        <p className="text-xs text-slate-600">
          1 °chl ≈ 3,17 g/L de chlore actif. Repère : l&apos;eau de Javel du commerce à 9,6 % de chlore actif titre 36 °chl. Le pourcentage massique
          dépend de la densité de la solution (valeur approchée).
        </p>
      </section>
    </div>
  );
}
