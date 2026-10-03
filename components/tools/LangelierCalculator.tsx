"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { estimateTds, langelier, type LsiStatus } from "@/lib/langelier";
import { ResultBox } from "./ResultBox";

const statusText: Record<LsiStatus, { title: string; text: string; tone: "warning" | "success" }> = {
  agressive: {
    title: "Eau agressive (corrosive)",
    text: "L'eau cherche à dissoudre du calcaire : elle attaque joints de carrelage, enduits, métaux et peut détendre le liner. Remontez progressivement le pH (dans la plage 7,2–7,6), le TAC ou la dureté calcique.",
    tone: "warning",
  },
  equilibree: {
    title: "Eau équilibrée",
    text: "Ni agressive ni entartrante : c'est l'objectif. Maintenez pH, TAC et dureté à ces niveaux.",
    tone: "success",
  },
  entartrante: {
    title: "Eau entartrante",
    text: "Le calcaire tend à se déposer : eau trouble, tartre sur la ligne d'eau, le filtre, la cellule d'électrolyseur ou l'échangeur de la PAC. Baissez le pH vers 7,2, et le TAC s'il est élevé ; utilisez un séquestrant calcaire.",
    tone: "warning",
  },
};

/** Calculateur d'indice de Langelier */
export function LangelierCalculator() {
  const [v, setV] = useState({ ph: "", temp: "", calcium: "", tac: "", cya: "", salt: "" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  const n = (k: keyof typeof v) => parseInput(v[k]);

  const ph = n("ph");
  const temp = n("temp");
  const calcium = n("calcium");
  const tac = n("tac");
  const res =
    ph !== null && temp !== null && calcium !== null && tac !== null
      ? langelier({ ph, temperature: temp, calcium, tac, cya: n("cya") ?? 0, tds: estimateTds(n("salt")) })
      : null;

  // Position du curseur sur la jauge (−1 à +1)
  const pos = res ? Math.min(1, Math.max(-1, res.lsi)) : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
          <Input id="l-ph" label="pH" inputMode="decimal" value={v.ph} onChange={set("ph")} placeholder="ex : 7,4" />
          <Input id="l-temp" label="Température de l'eau" unit="°C" inputMode="decimal" value={v.temp} onChange={set("temp")} placeholder="ex : 27" />
          <Input id="l-ca" label="Dureté calcique (ou TH)" unit="mg/L" inputMode="decimal" value={v.calcium} onChange={set("calcium")} placeholder="ex : 250" hint="En °f ? Multipliez par 10." />
          <Input id="l-tac" label="TAC" unit="mg/L" inputMode="decimal" value={v.tac} onChange={set("tac")} placeholder="ex : 100" />
          <Input id="l-cya" label="Stabilisant" unit="mg/L" inputMode="decimal" value={v.cya} onChange={set("cya")} placeholder="facultatif" />
          <Input id="l-salt" label="Taux de sel (électrolyseur)" unit="g/L" inputMode="decimal" value={v.salt} onChange={set("salt")} placeholder="facultatif" />
        </form>
        <div className="space-y-4">
          {res ? (
            <>
              <ResultBox label="Indice de Langelier" value={`${res.lsi > 0 ? "+" : ""}${formatNumber(res.lsi, 2)}`}>
                pH d&apos;équilibre pour cette eau : {formatNumber(res.phs, 2)}
              </ResultBox>
              <div aria-hidden="true">
                <div className="relative h-3 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400">
                  <span className="absolute -top-1 h-5 w-1.5 rounded bg-eau-950" style={{ left: `calc(${((pos + 1) / 2) * 100}% - 3px)` }} />
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-600">
                  <span>Agressive</span>
                  <span>−0,3 · équilibrée · +0,3</span>
                  <span>Entartrante</span>
                </div>
              </div>
              <Alert tone={statusText[res.status].tone} title={statusText[res.status].title}>
                {statusText[res.status].text}
              </Alert>
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">Renseignez pH, température, dureté et TAC.</div>
          )}
        </div>
      </div>
      <Alert tone="info" title="Comment c'est calculé">
        Formule de Carrier : ISL = pH − pHs, avec pHs = (9,3 + A + B) − (C + D), où A dépend des solides dissous, B de la température, C de la dureté calcique et
        D de l&apos;alcalinité carbonatée (TAC diminué de la part due au stabilisant). Entre −0,3 et +0,3, l&apos;eau est considérée comme équilibrée. Les
        trousses courantes mesurent le TH total : s&apos;il contient beaucoup de magnésium, la dureté calcique réelle est plus faible.
      </Alert>
    </div>
  );
}
