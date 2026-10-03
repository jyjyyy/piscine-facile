"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { DEFAULT_KWH_PRICE, electricityConsumption } from "@/lib/poolCalc";
import { ResultBox } from "./ResultBox";

/** Calculateur de consommation électrique de la pompe */
export function ConsumptionCalculator() {
  const [v, setV] = useState({ power: "", hours: "", days: "150", price: String(DEFAULT_KWH_PRICE).replace(".", ",") });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const power = parseInput(v.power);
  const hours = parseInput(v.hours);
  const days = parseInput(v.days);
  const price = parseInput(v.price);
  const hoursError = hours !== null && (hours <= 0 || hours > 24) ? "Entre 0 et 24 heures." : undefined;
  const res = power !== null && hours !== null && days !== null && price !== null ? electricityConsumption(power, hours, days, price) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <Input id="power" label="Puissance absorbée de la pompe" unit="W" inputMode="decimal" value={v.power} onChange={set("power")} placeholder="ex : 750" hint="Valeur P1 sur la plaque du moteur." />
        <Input id="hours" label="Filtration par jour" unit="h" inputMode="decimal" value={v.hours} onChange={set("hours")} placeholder="ex : 10" error={hoursError} />
        <Input id="days" label="Jours de saison" unit="jours" inputMode="numeric" value={v.days} onChange={set("days")} hint="Mai à septembre ≈ 150 jours." />
        <Input id="price" label="Prix du kWh" unit="€" inputMode="decimal" value={v.price} onChange={set("price")} hint="Valeur par défaut à adapter à votre contrat." />
      </form>
      <div className="space-y-4">
        {res && !hoursError ? (
          <ResultBox label="Coût estimé sur la saison" value={`${formatNumber(res.costSeason, 0)} €`}>
            {formatNumber(res.kwhSeason, 0)} kWh sur la saison · {formatNumber(res.kwhPerDay, 2)} kWh et {formatNumber(res.costPerDay, 2)} € par jour
          </ResultBox>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">Renseignez la puissance et la durée de filtration.</div>
        )}
        <Alert tone="info" title="Pour réduire la facture">
          <ul className="list-disc space-y-1 pl-4">
            <li>Adaptez la durée de filtration à la température de l&apos;eau (règle : température / 2).</li>
            <li>Une pompe à vitesse variable peut réduire fortement la consommation à débit réduit.</li>
            <li>Si vous avez un contrat heures creuses, placez une partie de la filtration sur ces plages.</li>
            <li>Si l&apos;étiquette indique seulement des CV : 1 CV ≈ 736 W de puissance utile ; la puissance absorbée (P1) est plus élevée.</li>
          </ul>
        </Alert>
      </div>
    </div>
  );
}
