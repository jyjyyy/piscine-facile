"use client";

import { useState, type FormEvent } from "react";
import { FlaskConical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { parseInput } from "@/lib/format";
import { analyzeWater, type Disinfection, type WaterAnalysis, type WaterInput } from "@/lib/waterCalc";
import { WaterResults } from "./WaterResults";

type FieldKey = "volume" | "ph" | "sanitizer" | "tac" | "cya" | "th" | "phMinusPercent" | "phPlusPercent" | "tacPlusPercent" | "chlorineValue";

interface FormState {
  volume: string;
  disinfection: Disinfection;
  ph: string;
  sanitizer: string;
  tac: string;
  cya: string;
  th: string;
  phMinusForm: "poudre" | "liquide";
  phMinusPercent: string;
  phPlusPercent: string;
  tacPlusPercent: string;
  chlorineForm: "granules" | "liquide";
  chlorineValue: string;
}

const initialState: FormState = {
  volume: "",
  disinfection: "chlore",
  ph: "",
  sanitizer: "",
  tac: "",
  cya: "",
  th: "",
  phMinusForm: "poudre",
  phMinusPercent: "",
  phPlusPercent: "",
  tacPlusPercent: "",
  chlorineForm: "granules",
  chlorineValue: "",
};

/** Bornes de validation (valeurs physiquement plausibles) */
const LIMITS: Record<FieldKey, { min: number; max: number; required: boolean; label: string }> = {
  volume: { min: 1, max: 2000, required: true, label: "Le volume" },
  ph: { min: 5, max: 9.5, required: true, label: "Le pH" },
  sanitizer: { min: 0, max: 20, required: true, label: "Le taux de désinfectant" },
  tac: { min: 0, max: 500, required: true, label: "Le TAC" },
  cya: { min: 0, max: 300, required: false, label: "Le stabilisant" },
  th: { min: 0, max: 1000, required: false, label: "Le TH" },
  phMinusPercent: { min: 1, max: 100, required: false, label: "La concentration" },
  phPlusPercent: { min: 1, max: 100, required: false, label: "La pureté" },
  tacPlusPercent: { min: 1, max: 100, required: false, label: "La pureté" },
  chlorineValue: { min: 1, max: 100, required: false, label: "La concentration" },
};

/** Formulaire de l'outil "Analyse de l'eau" */
export function WaterAnalysisForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [result, setResult] = useState<WaterAnalysis | null>(null);
  const [volumeUsed, setVolumeUsed] = useState(0);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<FieldKey, string>> = {};
    const values: Partial<Record<FieldKey, number | null>> = {};

    (Object.keys(LIMITS) as FieldKey[]).forEach((key) => {
      const rule = LIMITS[key];
      const v = parseInput(form[key]);
      if (v === null) {
        if (rule.required) newErrors[key] = "Champ obligatoire.";
        values[key] = null;
        return;
      }
      if (v < rule.min || v > rule.max) {
        newErrors[key] = `${rule.label} doit être compris entre ${String(rule.min).replace(".", ",")} et ${String(rule.max).replace(".", ",")}.`;
      }
      values[key] = v;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }

    const input: WaterInput = {
      volume: values.volume as number,
      disinfection: form.disinfection,
      ph: values.ph as number,
      sanitizer: values.sanitizer as number,
      tac: values.tac as number,
      cya: values.cya ?? null,
      th: values.th ?? null,
      products: {
        phMinus: { form: form.phMinusForm, percent: values.phMinusPercent ?? null },
        phPlus: { percent: values.phPlusPercent ?? null },
        tacPlus: { percent: values.tacPlusPercent ?? null },
        chlorine: { form: form.chlorineForm, value: values.chlorineValue ?? null },
      },
    };
    setVolumeUsed(input.volume);
    setResult(analyzeWater(input));
    // Amène l'utilisateur aux résultats (utile sur mobile)
    requestAnimationFrame(() => document.getElementById("resultats")?.scrollIntoView({ behavior: "smooth" }));
  };

  const reset = () => {
    setForm(initialState);
    setErrors({});
    setResult(null);
  };

  const sanitizerLabel = form.disinfection === "brome" ? "Brome total" : "Chlore libre";
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {hasErrors && (
          <Alert tone="danger" title="Certaines valeurs sont à vérifier">
            Corrigez les champs signalés en rouge ci-dessous.
          </Alert>
        )}

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-eau-950">1. Votre bassin</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="volume"
              label="Volume du bassin"
              unit="m³"
              inputMode="decimal"
              required
              value={form.volume}
              onChange={(e) => set("volume", e.target.value)}
              error={errors.volume}
              hint="Inconnu ? Utilisez notre calculateur de volume."
            />
            <Select
              id="disinfection"
              label="Type de désinfection"
              value={form.disinfection}
              onChange={(e) => set("disinfection", e.target.value as Disinfection)}
              options={[
                { value: "chlore", label: "Chlore (galets, granulés, liquide)" },
                { value: "sel", label: "Électrolyseur au sel" },
                { value: "brome", label: "Brome" },
              ]}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-eau-950">2. Vos mesures</legend>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input id="ph" label="pH" inputMode="decimal" required value={form.ph} onChange={(e) => set("ph", e.target.value)} error={errors.ph} placeholder="ex : 7,4" />
            <Input
              id="sanitizer"
              label={sanitizerLabel}
              unit="mg/L"
              inputMode="decimal"
              required
              value={form.sanitizer}
              onChange={(e) => set("sanitizer", e.target.value)}
              error={errors.sanitizer}
              placeholder="ex : 1,5"
            />
            <Input id="tac" label="TAC" unit="mg/L" inputMode="decimal" required value={form.tac} onChange={(e) => set("tac", e.target.value)} error={errors.tac} placeholder="ex : 100" hint="Si votre test indique des °f, multipliez par 10." />
            <Input
              id="cya"
              label="Stabilisant (acide cyanurique)"
              unit="mg/L"
              inputMode="decimal"
              value={form.cya}
              onChange={(e) => set("cya", e.target.value)}
              error={errors.cya}
              placeholder="ex : 30"
              hint={form.disinfection === "brome" ? "Non utile avec le brome." : "Laissez vide si non mesuré."}
            />
            <Input id="th" label="TH (dureté) – facultatif" unit="mg/L" inputMode="decimal" value={form.th} onChange={(e) => set("th", e.target.value)} error={errors.th} placeholder="ex : 200" hint="En °f ? Multipliez par 10." />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl bg-eau-50 p-5">
          <legend className="text-lg font-semibold text-eau-950">3. Vos produits (facultatif mais recommandé)</legend>
          <p className="text-sm text-slate-700">
            La concentration est indiquée sur l&apos;étiquette. Si vous la laissez vide, nous donnons une fourchette
            indicative : suivez alors l&apos;étiquette du fabricant.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              id="phMinusForm"
              label="Mon pH moins est…"
              value={form.phMinusForm}
              onChange={(e) => set("phMinusForm", e.target.value as FormState["phMinusForm"])}
              options={[
                { value: "poudre", label: "En poudre / granulés" },
                { value: "liquide", label: "Liquide (acide sulfurique)" },
              ]}
            />
            <Input
              id="phMinusPercent"
              label={form.phMinusForm === "poudre" ? "Pureté du pH moins" : "Concentration du pH moins liquide"}
              unit="%"
              inputMode="decimal"
              value={form.phMinusPercent}
              onChange={(e) => set("phMinusPercent", e.target.value)}
              error={errors.phMinusPercent}
              placeholder={form.phMinusForm === "poudre" ? "ex : 95" : "ex : 37"}
            />
            <Input id="phPlusPercent" label="Pureté du pH plus" unit="%" inputMode="decimal" value={form.phPlusPercent} onChange={(e) => set("phPlusPercent", e.target.value)} error={errors.phPlusPercent} placeholder="ex : 99" />
            <Input id="tacPlusPercent" label="Pureté du TAC plus" unit="%" inputMode="decimal" value={form.tacPlusPercent} onChange={(e) => set("tacPlusPercent", e.target.value)} error={errors.tacPlusPercent} placeholder="ex : 99" />
            <Select
              id="chlorineForm"
              label="Mon chlore choc est…"
              value={form.chlorineForm}
              onChange={(e) => set("chlorineForm", e.target.value as FormState["chlorineForm"])}
              options={[
                { value: "granules", label: "En granulés / poudre" },
                { value: "liquide", label: "Liquide" },
              ]}
            />
            <Input
              id="chlorineValue"
              label={form.chlorineForm === "granules" ? "Chlore disponible" : "Degré chlorométrique"}
              unit={form.chlorineForm === "granules" ? "%" : "°chl"}
              inputMode="decimal"
              value={form.chlorineValue}
              onChange={(e) => set("chlorineValue", e.target.value)}
              error={errors.chlorineValue}
              placeholder={form.chlorineForm === "granules" ? "ex : 56" : "ex : 48"}
              hint={form.chlorineForm === "granules" ? "Dichlore ≈ 56 %, hypochlorite de calcium ≈ 65-70 %." : "Indiqué en « °chl » sur le bidon."}
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" size="lg">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
            Analyser mon eau
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={reset}>
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Réinitialiser
          </Button>
        </div>
      </form>

      <div id="resultats" aria-live="polite" className="scroll-mt-24">
        {result && <WaterResults analysis={result} volume={volumeUsed} />}
      </div>
    </div>
  );
}
