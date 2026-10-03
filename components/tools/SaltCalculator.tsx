"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { saltDose } from "@/lib/treatmentCalc";
import { ResultBox } from "./ResultBox";

/** Calculateur de sel pour électrolyseur */
export function SaltCalculator() {
  const [volume, setVolume] = useState("");
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("4");

  const v = parseInput(volume);
  const c = parseInput(current) ?? 0;
  const t = parseInput(target);
  const res = v !== null && t !== null ? saltDose(v, c, t) : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
          <Input id="s-volume" label="Volume du bassin" unit="m³" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex : 50" />
          <div className="grid grid-cols-2 gap-4">
            <Input id="s-current" label="Taux mesuré" unit="g/L" inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0 si eau neuve" />
            <Input id="s-target" label="Taux conseillé" unit="g/L" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} hint="Voir la notice de l'appareil." />
          </div>
        </form>
        <div>
          {res ? (
            res.kg > 0 ? (
              <ResultBox label="Sel à ajouter" value={`${formatNumber(res.kg, 1)} kg`}>
                Soit {res.bags} sac{res.bags > 1 ? "s" : ""} de 25 kg (gardez le surplus pour plus tard).
              </ResultBox>
            ) : (
              <Alert tone="success" title="Aucun ajout nécessaire">Le taux mesuré atteint déjà la valeur conseillée.</Alert>
            )
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">Indiquez le volume et les taux de sel.</div>
          )}
        </div>
      </div>
      <Alert tone="info" title="Comment ajouter le sel">
        <ol className="list-decimal space-y-1 pl-4">
          <li>Arrêtez l&apos;électrolyseur et laissez tourner la filtration.</li>
          <li>Répartissez le sel côté profond, jamais dans le skimmer, et brossez le fond.</li>
          <li>Filtrez 24 h pour le dissoudre, puis remettez l&apos;électrolyseur en marche.</li>
          <li>Recontrôlez le taux le lendemain. Utilisez un sel spécial piscine, sans antimottant.</li>
        </ol>
        <p className="mt-2">Trop de sel ne s&apos;enlève qu&apos;en renouvelant de l&apos;eau : en cas de doute, ajoutez-en un peu moins et complétez.</p>
      </Alert>
    </div>
  );
}
