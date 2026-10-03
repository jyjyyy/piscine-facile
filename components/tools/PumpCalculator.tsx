"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { PUMP_TABLE, pumpSizing } from "@/lib/poolCalc";
import { ResultBox } from "./ResultBox";

/** Calculateur de dimensionnement de pompe */
export function PumpCalculator() {
  const [volume, setVolume] = useState("");
  const v = parseInput(volume);
  const vError = v !== null && (v <= 0 || v > 1000) ? "Indiquez un volume entre 1 et 1 000 m³." : undefined;
  const res = v !== null && !vError ? pumpSizing(v) : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <Input id="pvolume" label="Volume du bassin" unit="m³" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex : 48" error={vError} hint="Inconnu ? Utilisez le calculateur de volume." />
        </form>
        <div className="space-y-4">
          {res ? (
            <>
              <ResultBox label="Débit conseillé" value={`${formatNumber(res.minFlow, 1)} à ${formatNumber(res.maxFlow, 1)} m³/h`}>
                Pour filtrer tout le volume en 6 h (minimum) à 4 h (confort).
              </ResultBox>
              {res.pump ? (
                <div className="rounded-2xl border border-eau-100 bg-white p-5">
                  <p className="text-sm text-slate-600">Pompe indicative</p>
                  <p className="text-2xl font-bold text-eau-950">
                    {formatNumber(res.pump.cv, 2)} CV <span className="text-base font-medium text-slate-600">(≈ {res.pump.watts} W)</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Débit typique ≈ {res.pump.flow} m³/h à 10 mCE. Filtre à sable associé : Ø {res.sandFilterDiameterMm} mm minimum.
                  </p>
                </div>
              ) : (
                <Alert tone="warning">Pour ce volume, le dimensionnement doit être étudié par un professionnel (plusieurs pompes ou pompe triphasée possibles).</Alert>
              )}
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">Indiquez le volume du bassin.</div>
          )}
        </div>
      </div>

      <Alert tone="info" title="La puissance n'est qu'indicative">
        Le débit réel d&apos;une pompe dépend de la <strong>perte de charge</strong> de votre installation : longueur et
        diamètre des canalisations, coudes, filtre, hauteur entre la pompe et le bassin. Vérifiez toujours sur la courbe du
        fabricant que la pompe fournit le débit voulu à la hauteur manométrique de votre installation, et que le filtre
        accepte ce débit. Une pompe surdimensionnée consomme plus et filtre moins bien.
      </Alert>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <caption className="bg-eau-50 px-4 py-3 text-left font-semibold text-eau-950">Correspondances indicatives (pompes monovitesse, ≈ 10 mCE)</caption>
          <thead>
            <tr className="border-t border-slate-200">
              <th scope="col" className="px-4 py-2">Puissance</th>
              <th scope="col" className="px-4 py-2">Watts (P2)</th>
              <th scope="col" className="px-4 py-2">Débit typique</th>
              <th scope="col" className="px-4 py-2">Volume en 5 h</th>
            </tr>
          </thead>
          <tbody>
            {PUMP_TABLE.map((p) => (
              <tr key={p.cv} className="border-t border-slate-200">
                <th scope="row" className="px-4 py-2 font-medium">{formatNumber(p.cv, 2)} CV</th>
                <td className="px-4 py-2">{p.watts} W</td>
                <td className="px-4 py-2">{p.flow} m³/h</td>
                <td className="px-4 py-2">jusqu&apos;à {p.flow * 5} m³</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
