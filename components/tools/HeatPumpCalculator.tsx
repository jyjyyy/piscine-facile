"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { heatPumpSizing, type Cover, type Region, type Season } from "@/lib/heatPumpCalc";
import { ResultBox } from "./ResultBox";

/** Calculateur de puissance de pompe à chaleur */
export function HeatPumpCalculator() {
  const [volume, setVolume] = useState("");
  const [region, setRegion] = useState<Region>("centre-ouest");
  const [season, setSeason] = useState<Season>("mai-sept");
  const [cover, setCover] = useState<Cover>("bache");
  const [target, setTarget] = useState("27");
  const [start, setStart] = useState("15");
  const [windy, setWindy] = useState(false);

  const v = parseInput(volume);
  const t = parseInput(target);
  const s = parseInput(start);
  const tError = t !== null && (t < 24 || t > 32) ? "Entre 24 et 32 °C." : undefined;
  const res = v !== null && v > 0 && t !== null && !tError ? heatPumpSizing({ volume: v, region, season, cover, targetTemp: t, windy, startTemp: s ?? undefined }) : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
          <Input id="hp-volume" label="Volume du bassin" unit="m³" inputMode="decimal" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex : 50" />
          <Input id="hp-target" label="Température souhaitée" unit="°C" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} error={tError} />
          <Select
            id="hp-region"
            label="Région"
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            options={[
              { value: "nord-est", label: "Nord, Est, montagne" },
              { value: "centre-ouest", label: "Centre, Ouest, Île-de-France" },
              { value: "sud-ouest", label: "Sud-Ouest" },
              { value: "mediterranee", label: "Pourtour méditerranéen" },
            ]}
          />
          <Select
            id="hp-season"
            label="Période de baignade"
            value={season}
            onChange={(e) => setSeason(e.target.value as Season)}
            options={[
              { value: "ete", label: "Juin à août" },
              { value: "mai-sept", label: "Mai à septembre" },
              { value: "avril-oct", label: "Avril à octobre" },
              { value: "mars-nov", label: "Mars à novembre" },
            ]}
          />
          <Select
            id="hp-cover"
            label="Couverture la nuit"
            value={cover}
            onChange={(e) => setCover(e.target.value as Cover)}
            options={[
              { value: "aucune", label: "Aucune" },
              { value: "bache", label: "Bâche à bulles" },
              { value: "volet", label: "Volet roulant / couverture isotherme" },
              { value: "abri", label: "Abri de piscine" },
            ]}
          />
          <Input id="hp-start" label="Température de l'eau au démarrage" unit="°C" inputMode="decimal" value={start} onChange={(e) => setStart(e.target.value)} hint="Pour estimer la mise en température." />
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm sm:col-span-2">
            <input type="checkbox" className="h-5 w-5 accent-eau-700" checked={windy} onChange={(e) => setWindy(e.target.checked)} />
            Piscine exposée au vent
          </label>
        </form>
        <div className="space-y-4">
          {res ? (
            <>
              <ResultBox
                label="Pompe à chaleur conseillée"
                value={res.commercialSize ? `${res.commercialSize} kW` : `${formatNumber(res.power, 1)} kW`}
              >
                Besoin calculé : {formatNumber(res.power, 1)} kW (puissance restituée, air 15 °C / eau 26 °C)
              </ResultBox>
              {!res.commercialSize && <Alert tone="warning">Au-delà de 35 kW, faites réaliser une étude par un professionnel (plusieurs PAC ou PAC triphasée).</Alert>}
              <ul className="space-y-2 text-sm text-slate-700">
                {res.heatUpHours !== null && (
                  <li className="rounded-xl bg-slate-50 p-3">
                    Mise en température : environ <strong>{formatNumber(res.heatUpHours / 24, 1)} jours</strong> en continu, bassin couvert ({formatNumber(res.heatUpHours, 0)} h).
                  </li>
                )}
                <li className="rounded-xl bg-slate-50 p-3">
                  Puissance électrique absorbée : environ <strong>{formatNumber(res.electricalKw, 1)} kW</strong> (COP 5), soit ≈ {formatNumber(res.currentA, 0)} A en monophasé.
                </li>
              </ul>
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">Indiquez le volume du bassin.</div>
          )}
        </div>
      </div>

      <Alert tone="info" title="Comment lire les fiches techniques">
        Les fabricants annoncent souvent la puissance à <strong>air 27 °C / eau 26 °C</strong>, des conditions estivales flatteuses. Comparez plutôt la
        puissance à <strong>air 15 °C / eau 26 °C</strong>, représentative du printemps et de l&apos;automne. Une PAC « Full Inverter » module sa puissance et
        consomme moins une fois l&apos;eau à température. Ce calcul est indicatif : il ne remplace pas une étude de déperditions.
      </Alert>
      <Alert tone="warning" title="Raccordement électrique">
        Une pompe à chaleur se raccorde sur un circuit dédié, protégé par un dispositif différentiel 30 mA dont le type est indiqué par le fabricant, avec un
        câble et une protection dimensionnés selon la notice. Ce raccordement doit être réalisé par un électricien qualifié.
      </Alert>
    </div>
  );
}
