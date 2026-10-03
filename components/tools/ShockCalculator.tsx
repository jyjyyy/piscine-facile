"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { formatDose } from "@/lib/waterCalc";
import { shockDose, type ShockProduct, type ShockSituation } from "@/lib/treatmentCalc";
import { ResultBox } from "./ResultBox";

/** Calculateur de traitement choc au chlore */
export function ShockCalculator() {
  const [volume, setVolume] = useState("");
  const [fc, setFc] = useState("");
  const [cya, setCya] = useState("");
  const [situation, setSituation] = useState<ShockSituation>("trouble");
  const [product, setProduct] = useState<ShockProduct>("dichlore");
  const [conc, setConc] = useState("");

  const v = parseInput(volume);
  const res =
    v !== null
      ? shockDose({ volume: v, currentFc: parseInput(fc) ?? 0, situation, product, concentration: parseInput(conc), cya: parseInput(cya) })
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <Input id="sh-volume" label="Volume du bassin" unit="m³" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex : 50" />
        <Select
          id="sh-situation"
          label="Situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value as ShockSituation)}
          options={[
            { value: "preventif", label: "Choc préventif (après orage, forte chaleur)" },
            { value: "trouble", label: "Eau trouble, odeur de chlore" },
            { value: "verte-claire", label: "Eau vert clair (fond visible)" },
            { value: "verte-foncee", label: "Eau vert foncé (fond invisible)" },
          ]}
        />
        <Input id="sh-fc" label="Chlore libre actuel" unit="mg/L" inputMode="decimal" value={fc} onChange={(e) => setFc(e.target.value)} placeholder="0 si inconnu" />
        <Input id="sh-cya" label="Stabilisant" unit="mg/L" inputMode="decimal" value={cya} onChange={(e) => setCya(e.target.value)} placeholder="si mesuré" />
        <Select
          id="sh-product"
          label="Produit"
          value={product}
          onChange={(e) => setProduct(e.target.value as ShockProduct)}
          options={[
            { value: "dichlore", label: "Chlore choc dichlore (stabilisé)" },
            { value: "hypochlorite", label: "Hypochlorite de calcium (non stabilisé)" },
            { value: "liquide", label: "Chlore liquide (non stabilisé)" },
          ]}
        />
        <Input
          id="sh-conc"
          label={product === "liquide" ? "Degré chlorométrique" : "Chlore disponible"}
          unit={product === "liquide" ? "°chl" : "%"}
          inputMode="decimal"
          value={conc}
          onChange={(e) => setConc(e.target.value)}
          placeholder={product === "dichlore" ? "56 par défaut" : product === "hypochlorite" ? "ex : 65" : "ex : 48"}
        />
      </form>
      <div className="space-y-4">
        {res && res.dose ? (
          <ResultBox label={res.dose.product} value={formatDose(res.dose)}>
            Pour atteindre {formatNumber(res.target, 0)} mg/L de chlore libre
          </ResultBox>
        ) : (
          !res && <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">Indiquez le volume du bassin.</div>
        )}
        {res?.warnings.map((w) => (
          <Alert key={w} tone="warning">
            {w}
          </Alert>
        ))}
        {res?.dose && (
          <Alert tone="info" title="Mode d'emploi">
            <ul className="list-disc space-y-1 pl-4">
              <li>Ajustez d&apos;abord le pH vers 7,0–7,2, puis attendez 4 à 6 h.</li>
              <li>Faites le choc le soir, filtration en marche 24 h/24 pendant 48 h.</li>
              <li>Prédiluez les granulés dans un seau d&apos;eau, jamais de granulés à même le liner.</li>
              <li className="flex gap-1">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Baignade possible quand le chlore est redescendu entre 1 et 3 mg/L.
              </li>
            </ul>
          </Alert>
        )}
      </div>
    </div>
  );
}
