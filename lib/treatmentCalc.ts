/**
 * Calculs de traitement : sel pour électrolyseur, traitement choc au chlore, conversions d'unités.
 * Fonctions pures, testées dans tests/treatmentCalc.test.ts.
 */

import { doseChlorine, type Dose } from "./waterCalc";

// ─────────────────────────────────────────────────────────────
// Sel (électrolyseur)
// ─────────────────────────────────────────────────────────────

export const SALT_BAG_KG = 25;

export interface SaltResult {
  /** Sel à ajouter (kg) */
  kg: number;
  /** Nombre de sacs de 25 kg (arrondi au supérieur) */
  bags: number;
}

/** Sel à ajouter (kg) = (taux visé − taux mesuré) en g/L × volume en m³ */
export function saltDose(volume: number, current: number, target: number): SaltResult | null {
  if (!(volume > 0) || !(target > 0) || current < 0) return null;
  const kg = Math.max(0, (target - current) * volume);
  return { kg, bags: Math.ceil(kg / SALT_BAG_KG) };
}

// ─────────────────────────────────────────────────────────────
// Traitement choc
// ─────────────────────────────────────────────────────────────

export type ShockSituation = "preventif" | "trouble" | "verte-claire" | "verte-foncee";
export type ShockProduct = "dichlore" | "hypochlorite" | "liquide";

/** Chlore libre visé (mg/L) par situation, sans stabilisant */
export const SHOCK_TARGETS: Record<ShockSituation, number> = {
  preventif: 5,
  trouble: 10,
  "verte-claire": 15,
  "verte-foncee": 20,
};

/** Stabilisant apporté par le dichlore : 0,9 mg/L par mg/L de chlore (NaDCC dihydraté, 56 %) */
export const DICHLOR_CYA_PER_FC = 0.9;
/** Dureté apportée par l'hypochlorite de calcium : ≈ 0,7 mg/L CaCO3 par mg/L de chlore */
export const CAL_HYPO_TH_PER_FC = 0.7;

export interface ShockInput {
  volume: number;
  currentFc: number;
  situation: ShockSituation;
  product: ShockProduct;
  /** % de chlore disponible (granulés) ou °chl (liquide) ; null = inconnu */
  concentration: number | null;
  /** Stabilisant actuel (mg/L) */
  cya: number | null;
}

export interface ShockResult {
  target: number;
  dose: Dose | null;
  /** Stabilisant ajouté par le choc (mg/L), dichlore uniquement */
  addedCya: number;
  /** Dureté ajoutée (mg/L CaCO3), hypochlorite de calcium uniquement */
  addedTh: number;
  warnings: string[];
}

/**
 * Chlore visé : valeur de la situation, relevée en présence de stabilisant
 * (en cas d'algues, on vise au moins 40 % du taux de stabilisant, car le stabilisant freine le chlore).
 */
export function shockTarget(situation: ShockSituation, cya: number | null): number {
  const base = SHOCK_TARGETS[situation];
  if (!cya || cya <= 0) return base;
  const ratio = situation === "verte-claire" || situation === "verte-foncee" ? 0.4 : situation === "trouble" ? 0.25 : 0.15;
  return Math.max(base, Math.round(cya * ratio));
}

export function shockDose(input: ShockInput): ShockResult | null {
  const { volume, currentFc, situation, product, concentration, cya } = input;
  if (!(volume > 0) || currentFc < 0) return null;
  const target = shockTarget(situation, cya);
  const delta = Math.max(0, target - currentFc);

  let dose: Dose | null;
  if (product === "hypochlorite" && concentration === null) {
    // Hypochlorite de calcium de concentration inconnue : fourchette 65 à 70 %
    const lo = doseChlorine(volume, currentFc, target, { form: "granules", value: 70 });
    const hi = doseChlorine(volume, currentFc, target, { form: "granules", value: 65 });
    dose = lo && hi ? { product: "Hypochlorite de calcium", min: lo.min, max: hi.max, unit: "g", exact: false } : null;
  } else {
    // Dichlore de concentration inconnue : 56 % (valeur standard du dichloroisocyanurate de sodium dihydraté)
    const value = concentration ?? (product === "dichlore" ? 56 : null);
    dose = doseChlorine(volume, currentFc, target, { form: product === "liquide" ? "liquide" : "granules", value });
    if (dose) {
      dose = {
        ...dose,
        product:
          product === "dichlore"
            ? `Chlore choc dichlore (${value} %)`
            : product === "hypochlorite"
              ? `Hypochlorite de calcium (${value} %)`
              : dose.product,
      };
    }
  }
  const addedCya = product === "dichlore" ? delta * DICHLOR_CYA_PER_FC : 0;
  const addedTh = product === "hypochlorite" ? delta * CAL_HYPO_TH_PER_FC : 0;

  const warnings: string[] = [];
  if (product === "dichlore" && cya !== null && cya + addedCya > 50) {
    warnings.push(
      `Ce choc au dichlore ajoutera environ ${Math.round(addedCya)} mg/L de stabilisant (total ≈ ${Math.round(cya + addedCya)} mg/L) : préférez un chlore non stabilisé (liquide ou hypochlorite de calcium).`,
    );
  }
  if (product === "hypochlorite") {
    warnings.push("L'hypochlorite de calcium augmente le pH et la dureté : en eau dure, prédissolvez-le et laissez décanter avant de verser le liquide clair.");
  }
  if (product === "liquide") {
    warnings.push("Le chlore liquide fait monter le pH : recontrôlez-le le lendemain. Il se dégrade avec le temps et la chaleur : utilisez un bidon récent.");
  }
  if (delta === 0) warnings.push("Le chlore libre est déjà au niveau visé : aucun apport n'est nécessaire.");

  return { target, dose, addedCya, addedTh, warnings };
}

// ─────────────────────────────────────────────────────────────
// Conversions
// ─────────────────────────────────────────────────────────────

/** Dureté / alcalinité : mg/L de CaCO3 ↔ degrés français, allemands, mmol/L */
export const hardness = {
  mgToFrench: (mg: number) => mg / 10,
  frenchToMg: (f: number) => f * 10,
  mgToGerman: (mg: number) => mg / 17.848,
  germanToMg: (d: number) => d * 17.848,
  mgToMmol: (mg: number) => mg / 100.09,
  mmolToMg: (m: number) => m * 100.09,
};

/** Chlore liquide : degré chlorométrique ↔ g/L de chlore actif ↔ % de chlore actif (massique) */
export const chlorine = {
  degreesToGPerL: (deg: number) => deg * 3.17,
  gPerLToDegrees: (g: number) => g / 3.17,
  /** Densité approximative d'une solution d'hypochlorite de sodium selon sa concentration */
  density: (gPerL: number) => 1 + 0.00166 * gPerL,
  gPerLToPercent: (g: number) => g / (10 * (1 + 0.00166 * g)),
};
