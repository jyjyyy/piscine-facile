"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { formatNumber, parseInput } from "@/lib/format";
import { averageDepth, OVAL_COEFFICIENT, poolVolume, type PoolShape } from "@/lib/poolCalc";
import { ResultBox } from "./ResultBox";

const shapes: Array<{ value: PoolShape; label: string }> = [
  { value: "rectangulaire", label: "Rectangulaire ou carrée" },
  { value: "ronde", label: "Ronde" },
  { value: "ovale", label: "Ovale" },
  { value: "libre", label: "Forme libre (haricot, L…)" },
];

const formulas: Record<PoolShape, string> = {
  rectangulaire: "Longueur × largeur × profondeur moyenne",
  ronde: "π × rayon² × profondeur moyenne (rayon = diamètre / 2)",
  ovale: `Longueur × largeur × profondeur moyenne × ${String(OVAL_COEFFICIENT).replace(".", ",")}`,
  libre: "Surface du plan d'eau × profondeur moyenne",
};

/** Calculateur de volume de piscine */
export function VolumeCalculator() {
  const [shape, setShape] = useState<PoolShape>("rectangulaire");
  const [v, setV] = useState({ length: "", width: "", diameter: "", surface: "", minDepth: "", maxDepth: "" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const n = (s: string) => parseInput(s) ?? undefined;
  const minD = n(v.minDepth);
  const maxD = n(v.maxDepth) ?? minD;
  const depthError = minD !== undefined && maxD !== undefined && maxD < minD ? "La profondeur maximale doit être supérieure ou égale à la minimale." : undefined;

  const volume =
    minD !== undefined && maxD !== undefined
      ? poolVolume({ shape, length: n(v.length), width: n(v.width), diameter: n(v.diameter), surface: n(v.surface), minDepth: minD, maxDepth: maxD })
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
        <Select id="shape" label="Forme du bassin" value={shape} onChange={(e) => setShape(e.target.value as PoolShape)} options={shapes} />
        {(shape === "rectangulaire" || shape === "ovale") && (
          <div className="grid grid-cols-2 gap-4">
            <Input id="length" label="Longueur" unit="m" inputMode="decimal" value={v.length} onChange={set("length")} placeholder="ex : 8" />
            <Input id="width" label="Largeur" unit="m" inputMode="decimal" value={v.width} onChange={set("width")} placeholder="ex : 4" />
          </div>
        )}
        {shape === "ronde" && <Input id="diameter" label="Diamètre" unit="m" inputMode="decimal" value={v.diameter} onChange={set("diameter")} placeholder="ex : 4,6" />}
        {shape === "libre" && (
          <Input
            id="surface"
            label="Surface du plan d'eau"
            unit="m²"
            inputMode="decimal"
            value={v.surface}
            onChange={set("surface")}
            placeholder="ex : 30"
            hint="Indiquée par le fabricant, ou décomposez le bassin en rectangles et cercles."
          />
        )}
        <div className="grid grid-cols-2 gap-4">
          <Input id="minDepth" label="Profondeur min." unit="m" inputMode="decimal" value={v.minDepth} onChange={set("minDepth")} placeholder="ex : 1,2" />
          <Input
            id="maxDepth"
            label="Profondeur max."
            unit="m"
            inputMode="decimal"
            value={v.maxDepth}
            onChange={set("maxDepth")}
            placeholder="ex : 1,8"
            hint="Laissez vide si le fond est plat."
            error={depthError}
          />
        </div>
        <p className="text-sm text-slate-600">
          Mesurez la hauteur d&apos;<strong>eau</strong> (pas la hauteur des parois). Formule : {formulas[shape]}.
        </p>
      </form>

      <div className="space-y-4">
        {volume !== null && !depthError ? (
          <ResultBox label="Volume estimé" value={`${formatNumber(volume, 1)} m³`}>
            Soit environ {formatNumber(Math.round(volume * 1000), 0)} litres
            {minD !== undefined && maxD !== undefined && ` · profondeur moyenne ${formatNumber(averageDepth(minD, maxD), 2)} m`}
          </ResultBox>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-eau-200 p-6 text-center text-slate-600">
            Renseignez les dimensions pour afficher le volume.
          </div>
        )}
        {shape === "ovale" && (
          <Alert tone="info" title={`Pourquoi ${String(OVAL_COEFFICIENT).replace(".", ",")} ?`}>
            Les piscines dites « ovales » ont en général des côtés droits et des extrémités arrondies : le coefficient 0,89
            utilisé par la profession en tient compte. Pour une ellipse parfaite, le coefficient serait 0,785 (π / 4).
          </Alert>
        )}
        {shape === "libre" && (
          <Alert tone="info">Pour une forme libre, le résultat est une approximation : fiez-vous au volume du fabricant s&apos;il est connu.</Alert>
        )}
      </div>
    </div>
  );
}
