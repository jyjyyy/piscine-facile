"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { formatNumber, parseInput } from "@/lib/format";
import { filtrationTime } from "@/lib/poolCalc";
import { ResultBox } from "./ResultBox";

const modeLabel = {
  "hors-gel": "Risque de gel",
  "hivernage-actif": "Hivernage actif",
  saison: "Saison de baignade",
  "forte-chaleur": "Forte chaleur",
} as const;

/** Calculateur de temps de filtration */
export function FiltrationCalculator() {
  const [temp, setTemp] = useState("");
  const [heavy, setHeavy] = useState(false);
  const [volume, setVolume] = useState("");
  const [flow, setFlow] = useState("");

  const t = parseInput(temp);
  const tError = t !== null && (t < 0 || t > 40) ? "Indiquez une température entre 0 et 40 °C." : undefined;
  const res =
    t !== null && !tError
      ? filtrationTime({ temperature: t, heavyUse: heavy, volume: parseInput(volume) ?? undefined, flow: parseInput(flow) ?? undefined })
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
        <Input id="temp" label="Température de l'eau" unit="°C" inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="ex : 24" error={tError} />
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
          <input type="checkbox" className="h-5 w-5 accent-eau-700" checked={heavy} onChange={(e) => setHeavy(e.target.checked)} />
          Forte fréquentation (nombreux baigneurs)
        </label>
        <fieldset className="space-y-3 rounded-2xl bg-eau-50 p-4">
          <legend className="text-sm font-semibold text-eau-950">Facultatif : vérifier le nombre de cycles</legend>
          <div className="grid grid-cols-2 gap-4">
            <Input id="fvolume" label="Volume" unit="m³" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex : 48" />
            <Input id="fflow" label="Débit de la pompe" unit="m³/h" inputMode="decimal" value={flow} onChange={(e) => setFlow(e.target.value)} placeholder="ex : 11" />
          </div>
        </fieldset>
      </form>
      <div className="space-y-4">
        {res ? (
          <>
            <ResultBox label={`Filtration conseillée · ${modeLabel[res.mode]}`} value={`${formatNumber(res.hours, 1)} h / jour`}>
              {res.turnovers !== null && <>Votre volume est filtré environ {formatNumber(res.turnovers, 1)} fois par jour.</>}
            </ResultBox>
            <ul className="space-y-2 text-sm text-slate-700">
              {res.tips.map((tip) => (
                <li key={tip} className="rounded-xl bg-slate-50 p-3">
                  {tip}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">
            Indiquez la température de l&apos;eau.
          </div>
        )}
      </div>
    </div>
  );
}
