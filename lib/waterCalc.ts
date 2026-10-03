/**
 * Logique de calcul de l'analyse de l'eau.
 *
 * Toutes les fonctions sont PURES (aucun effet de bord) et testées dans tests/waterCalc.test.ts.
 *
 * Unités :
 *  - volume : m³ (1 m³ = 1 000 L)
 *  - concentrations dans l'eau : mg/L (= g/m³)
 *  - TAC et TH exprimés en mg/L de CaCO3 (1 °f = 10 mg/L)
 *
 * Deux types de coefficients sont utilisés :
 *  1. Coefficients STŒCHIOMÉTRIQUES (exacts) : TAC plus, baisse du TAC à l'acide, chlore, stabilisant.
 *  2. Coefficients EMPIRIQUES (pH plus / pH moins) : l'effet sur le pH dépend du pouvoir tampon de l'eau
 *     (TAC, stabilisant, température…). On utilise les valeurs moyennes des étiquettes fabricants
 *     (≈ 100 g pour 10 m³ pour 0,1 unité de pH), corrigées selon le TAC.
 */

import { formatMass, formatNumber, formatVolumeLiquid } from "./format";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type Disinfection = "chlore" | "brome" | "sel";
export type Status = "bon" | "a-corriger" | "critique";

export interface ProductSettings {
  /** pH moins : poudre (bisulfate de sodium, pureté en %) ou liquide (acide sulfurique, concentration en %) */
  phMinus: { form: "poudre" | "liquide"; percent: number | null };
  /** pH plus : carbonate de sodium, pureté en % */
  phPlus: { percent: number | null };
  /** TAC plus : bicarbonate de sodium, pureté en % */
  tacPlus: { percent: number | null };
  /**
   * Chlore choc :
   *  - granulés : % de chlore disponible (dichlore ≈ 56 %, hypochlorite de calcium ≈ 65-70 %)
   *  - liquide : degré chlorométrique (°chl) indiqué sur l'étiquette (1 °chl ≈ 3,17 g/L de chlore actif)
   */
  chlorine: { form: "granules" | "liquide"; value: number | null };
}

export interface WaterInput {
  /** Volume du bassin en m³ */
  volume: number;
  disinfection: Disinfection;
  ph: number;
  /** Chlore libre (chlore / sel) ou brome total (brome), en mg/L */
  sanitizer: number;
  /** TAC en mg/L CaCO3 */
  tac: number;
  /** Stabilisant (acide cyanurique) en mg/L – null si non mesuré */
  cya: number | null;
  /** TH en mg/L CaCO3 – facultatif */
  th: number | null;
  products: ProductSettings;
}

export interface ParamResult {
  key: "ph" | "sanitizer" | "tac" | "cya" | "th";
  label: string;
  value: number;
  unit: string;
  status: Status;
  /** Plage idéale lisible */
  idealRange: string;
  message: string;
}

export interface Dose {
  /** Nom du produit à utiliser */
  product: string;
  /** Quantité minimale (si exacte : min = max) */
  min: number;
  max: number;
  unit: "g" | "mL";
  /** true si la concentration du produit était connue */
  exact: boolean;
}

export interface Action {
  step: number;
  title: string;
  detail: string;
  dose?: Dose;
  /** Clés de config/affiliates.ts */
  productKeys: string[];
}

export interface WaterAnalysis {
  params: ParamResult[];
  actions: Action[];
  /** Alertes générales (baignade déconseillée, etc.) */
  alerts: string[];
  /** true si au moins un paramètre est critique */
  hasCritical: boolean;
}

// ─────────────────────────────────────────────────────────────
// Valeurs de référence
// ─────────────────────────────────────────────────────────────

export const REFERENCES = {
  ph: { min: 7.2, max: 7.4, acceptableMin: 7.0, acceptableMax: 7.6, target: 7.3 },
  chlorine: { min: 1, max: 3, target: 2 },
  bromine: { min: 2, max: 4, target: 3 },
  tac: { min: 80, max: 150, target: 100 },
  cya: { min: 20, max: 50, renewal: 75, target: 30, renewalTarget: 40 },
  th: { min: 150, max: 250 },
} as const;

// Coefficients stœchiométriques (g de produit PUR par m³ et par mg/L de variation)
/** Bicarbonate de sodium : 84,01 / 50,04 = 1,679 g/m³ pour +1 mg/L de TAC */
export const BICARBONATE_PER_TAC = 84.01 / 50.04;
/** Bisulfate de sodium : 120,06 / 50,04 = 2,399 g/m³ pour −1 mg/L de TAC */
export const BISULFATE_PER_TAC = 120.06 / 50.04;
/** Équivalence acide sulfurique / bisulfate de sodium (masses équivalentes 49,04 / 120,06) */
export const SULFURIC_PER_BISULFATE = 49.04 / 120.06;
/** 1 degré chlorométrique ≈ 3,17 g de chlore actif par litre */
export const G_PER_L_PER_CHLOROMETRIC_DEGREE = 3.17;

// Coefficients empiriques (étiquettes fabricants) pour 0,1 unité de pH, à TAC = 100 mg/L
/** pH moins, équivalent bisulfate PUR, g/m³ */
export const PH_MINUS_PURE_PER_TENTH = 8.5;
/** pH moins en poudre de pureté inconnue : fourchette g/m³ */
export const PH_MINUS_UNKNOWN_RANGE: readonly [number, number] = [7, 10];
/** pH plus, équivalent carbonate PUR, g/m³ */
export const PH_PLUS_PURE_PER_TENTH = 8;
/** pH plus de pureté inconnue : fourchette g/m³ */
export const PH_PLUS_UNKNOWN_RANGE: readonly [number, number] = [6, 10];

// Fourchettes de concentration utilisées quand le produit est inconnu
const UNKNOWN = {
  bicarbonatePurity: [95, 100] as const,
  bisulfatePurity: [90, 98] as const,
  sulfuricPercent: [15, 37] as const,
  chlorineGranules: [55, 70] as const,
  chlorineLiquidDegrees: [36, 50] as const,
};

// ─────────────────────────────────────────────────────────────
// Outils internes
// ─────────────────────────────────────────────────────────────

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Facteur de pouvoir tampon : plus le TAC est haut, plus il faut de produit pour bouger le pH */
export function bufferFactor(tac: number): number {
  return clamp(tac / 100, 0.5, 2);
}

/** Densité approximative d'une solution d'acide sulfurique selon sa concentration (15 % ≈ 1,10 ; 37 % ≈ 1,28) */
export function sulfuricDensity(percent: number): number {
  return 1 + 0.0075 * percent;
}

/** Convertit une masse d'acide sulfurique pur (g) en volume de solution (mL) */
function sulfuricMassToMl(pureGrams: number, percent: number): number {
  return pureGrams / (percent / 100) / sulfuricDensity(percent);
}

function validPercent(p: number | null): p is number {
  return p !== null && Number.isFinite(p) && p > 0 && p <= 100;
}

// ─────────────────────────────────────────────────────────────
// Évaluation des paramètres
// ─────────────────────────────────────────────────────────────

export function evaluatePh(ph: number): ParamResult {
  const r = REFERENCES.ph;
  let status: Status;
  let message: string;
  if (ph >= r.min && ph <= r.max) {
    status = "bon";
    message = "pH idéal : le désinfectant est efficace et l'eau est confortable.";
  } else if (ph >= r.acceptableMin && ph <= r.acceptableMax) {
    status = "a-corriger";
    message =
      ph < r.min
        ? "pH un peu bas (acceptable) : léger ajustement conseillé pour éviter la corrosion et les irritations."
        : "pH un peu haut (acceptable) : le chlore perd en efficacité, léger ajustement conseillé.";
  } else if (ph < 6.8 || ph > 8.0) {
    status = "critique";
    message =
      ph < 6.8
        ? "pH très bas : eau agressive (corrosion des équipements, irritations). Correction nécessaire avant baignade."
        : "pH très haut : chlore quasi inefficace, risque d'eau trouble et d'entartrage. Correction nécessaire.";
  } else {
    status = "a-corriger";
    message =
      ph < r.acceptableMin
        ? "pH trop bas : eau agressive pour le revêtement et les équipements."
        : "pH trop haut : le chlore est beaucoup moins efficace, risque de tartre et d'eau trouble.";
  }
  return {
    key: "ph",
    label: "pH",
    value: ph,
    unit: "",
    status,
    idealRange: "7,2 à 7,4",
    message,
  };
}

export function evaluateSanitizer(value: number, disinfection: Disinfection, cya: number | null): ParamResult {
  if (disinfection === "brome") {
    const r = REFERENCES.bromine;
    let status: Status = "bon";
    let message = "Taux de brome correct.";
    if (value < 1) {
      status = "critique";
      message = "Brome très insuffisant : l'eau n'est plus désinfectée. Baignade déconseillée.";
    } else if (value < r.min) {
      status = "a-corriger";
      message = "Brome un peu bas : augmentez le réglage du brominateur.";
    } else if (value > 6) {
      status = "critique";
      message = "Brome très élevé : irritations possibles. Baignade déconseillée jusqu'au retour sous 4 mg/L.";
    } else if (value > r.max) {
      status = "a-corriger";
      message = "Brome un peu élevé : réduisez le réglage du brominateur.";
    }
    return { key: "sanitizer", label: "Brome total", value, unit: "mg/L", status, idealRange: "2 à 4 mg/L", message };
  }

  const r = REFERENCES.chlorine;
  let status: Status = "bon";
  let message = "Chlore libre correct : l'eau est bien désinfectée.";
  if (value < 0.5) {
    status = "critique";
    message = "Chlore quasi absent : l'eau n'est plus désinfectée, les algues peuvent apparaître très vite. Baignade déconseillée.";
  } else if (value < r.min) {
    status = "a-corriger";
    message = "Chlore insuffisant : la désinfection n'est pas assurée.";
  } else if (value > 5) {
    status = "critique";
    message = "Chlore très élevé : irritations des yeux et de la peau. Baignade déconseillée jusqu'au retour sous 3 mg/L.";
  } else if (value > r.max) {
    status = "a-corriger";
    message = "Chlore un peu élevé : cessez les ajouts, le taux va redescendre naturellement.";
  }

  // Avec beaucoup de stabilisant, le chlore est moins actif : on le signale
  if (status === "bon" && cya !== null && cya > 0 && value < cya * 0.05) {
    message = `Chlore dans la plage, mais avec ${formatNumber(cya, 0)} mg/L de stabilisant il est moins actif : visez plutôt le haut de la fourchette (${formatNumber(Math.min(3, cya * 0.05), 1)} mg/L).`;
  }

  return {
    key: "sanitizer",
    label: "Chlore libre",
    value,
    unit: "mg/L",
    status,
    idealRange: "1 à 3 mg/L",
    message,
  };
}

export function evaluateTac(tac: number): ParamResult {
  const r = REFERENCES.tac;
  let status: Status = "bon";
  let message = "TAC correct : le pH est bien stabilisé.";
  if (tac < 50) {
    status = "critique";
    message = "TAC très bas : le pH va varier fortement et sera impossible à stabiliser.";
  } else if (tac < r.min) {
    status = "a-corriger";
    message = "TAC trop bas : le pH risque d'être instable.";
  } else if (tac > 250) {
    status = "critique";
    message = "TAC très élevé : pH bloqué vers le haut, risque important de tartre et d'eau trouble.";
  } else if (tac > r.max) {
    status = "a-corriger";
    message = "TAC trop élevé : le pH aura tendance à remonter et sera difficile à baisser.";
  }
  return { key: "tac", label: "TAC (alcalinité)", value: tac, unit: "mg/L", status, idealRange: "80 à 150 mg/L", message };
}

export function evaluateCya(cya: number, disinfection: Disinfection): ParamResult {
  const r = REFERENCES.cya;
  let status: Status = "bon";
  let message = "Stabilisant correct : le chlore est protégé des UV sans être bloqué.";

  if (disinfection === "brome") {
    return {
      key: "cya",
      label: "Stabilisant",
      value: cya,
      unit: "mg/L",
      status: "bon",
      idealRange: "Non utile avec le brome",
      message: "Le stabilisant ne protège pas le brome : ce paramètre n'est pas pris en compte.",
    };
  }

  if (cya < r.min) {
    status = "a-corriger";
    message = "Stabilisant faible : le soleil détruit le chlore très rapidement.";
  } else if (cya > r.renewal) {
    status = "critique";
    message = "Stabilisant excessif (au-delà de 75 mg/L) : le chlore est « bloqué ». Un renouvellement partiel de l'eau est recommandé.";
  } else if (cya > r.max) {
    status = "a-corriger";
    message = "Stabilisant élevé : utilisez un chlore non stabilisé pour ne pas l'augmenter davantage.";
  }
  return { key: "cya", label: "Stabilisant (acide cyanurique)", value: cya, unit: "mg/L", status, idealRange: "20 à 50 mg/L", message };
}

export function evaluateTh(th: number): ParamResult {
  const r = REFERENCES.th;
  let status: Status = "bon";
  let message = "Dureté correcte.";
  if (th < 100) {
    status = "critique";
    message = "Eau très douce : agressive pour les joints, le liner et les éléments métalliques.";
  } else if (th < r.min) {
    status = "a-corriger";
    message = "Eau un peu douce : légèrement agressive.";
  } else if (th > 400) {
    status = "critique";
    message = "Eau très dure : entartrage important (parois, filtre, cellule d'électrolyseur).";
  } else if (th > r.max) {
    status = "a-corriger";
    message = "Eau dure : risque de tartre, surtout si le pH monte.";
  }
  return {
    key: "th",
    label: "TH (dureté)",
    value: th,
    unit: "mg/L",
    status,
    idealRange: `150 à 250 mg/L (15 à 25 °f)`,
    message: `${message} Soit ${formatNumber(th / 10, 1)} °f.`,
  };
}

// ─────────────────────────────────────────────────────────────
// Calcul des doses
// ─────────────────────────────────────────────────────────────

/**
 * Dose de pH moins pour passer de `ph` à `target`.
 * Formule : (écart / 0,1) × coefficient × facteur TAC × volume.
 */
export function dosePhMinus(
  volume: number,
  ph: number,
  target: number,
  tac: number,
  product: ProductSettings["phMinus"],
): Dose | null {
  const delta = ph - target;
  if (delta <= 0 || volume <= 0) return null;
  const tenths = delta / 0.1;
  const factor = bufferFactor(tac);
  const purePowderGrams = tenths * PH_MINUS_PURE_PER_TENTH * factor * volume;

  if (product.form === "liquide") {
    const pureSulfuric = purePowderGrams * SULFURIC_PER_BISULFATE;
    if (validPercent(product.percent)) {
      const ml = sulfuricMassToMl(pureSulfuric, product.percent);
      return { product: `pH moins liquide (${formatNumber(product.percent, 1)} %)`, min: ml, max: ml, unit: "mL", exact: true };
    }
    const [lo, hi] = UNKNOWN.sulfuricPercent;
    return {
      product: "pH moins liquide",
      min: sulfuricMassToMl(pureSulfuric, hi),
      max: sulfuricMassToMl(pureSulfuric, lo),
      unit: "mL",
      exact: false,
    };
  }

  if (validPercent(product.percent)) {
    const g = purePowderGrams / (product.percent / 100);
    return { product: `pH moins en poudre (${formatNumber(product.percent, 1)} %)`, min: g, max: g, unit: "g", exact: true };
  }
  const [lo, hi] = PH_MINUS_UNKNOWN_RANGE;
  return {
    product: "pH moins en poudre",
    min: tenths * lo * factor * volume,
    max: tenths * hi * factor * volume,
    unit: "g",
    exact: false,
  };
}

/** Dose de pH plus (carbonate de sodium) pour passer de `ph` à `target` */
export function dosePhPlus(
  volume: number,
  ph: number,
  target: number,
  tac: number,
  product: ProductSettings["phPlus"],
): Dose | null {
  const delta = target - ph;
  if (delta <= 0 || volume <= 0) return null;
  const tenths = delta / 0.1;
  const factor = bufferFactor(tac);
  if (validPercent(product.percent)) {
    const g = (tenths * PH_PLUS_PURE_PER_TENTH * factor * volume) / (product.percent / 100);
    return { product: `pH plus (${formatNumber(product.percent, 1)} %)`, min: g, max: g, unit: "g", exact: true };
  }
  const [lo, hi] = PH_PLUS_UNKNOWN_RANGE;
  return {
    product: "pH plus",
    min: tenths * lo * factor * volume,
    max: tenths * hi * factor * volume,
    unit: "g",
    exact: false,
  };
}

/** Dose de TAC plus (bicarbonate de sodium) – calcul stœchiométrique */
export function doseTacPlus(volume: number, tac: number, target: number, product: ProductSettings["tacPlus"]): Dose | null {
  const delta = target - tac;
  if (delta <= 0 || volume <= 0) return null;
  const pure = delta * BICARBONATE_PER_TAC * volume;
  if (validPercent(product.percent)) {
    const g = pure / (product.percent / 100);
    return { product: `TAC plus (${formatNumber(product.percent, 1)} %)`, min: g, max: g, unit: "g", exact: true };
  }
  const [lo, hi] = UNKNOWN.bicarbonatePurity;
  return { product: "TAC plus", min: pure / (hi / 100), max: pure / (lo / 100), unit: "g", exact: false };
}

/**
 * Quantité TOTALE d'acide (pH moins) pour baisser le TAC de `tac` à `target` – calcul stœchiométrique.
 * À répartir en plusieurs apports (méthode acide + aération).
 */
export function doseTacMinus(volume: number, tac: number, target: number, product: ProductSettings["phMinus"]): Dose | null {
  const delta = tac - target;
  if (delta <= 0 || volume <= 0) return null;
  const pureBisulfate = delta * BISULFATE_PER_TAC * volume;

  if (product.form === "liquide") {
    const pureSulfuric = pureBisulfate * SULFURIC_PER_BISULFATE;
    if (validPercent(product.percent)) {
      const ml = sulfuricMassToMl(pureSulfuric, product.percent);
      return { product: `pH moins liquide (${formatNumber(product.percent, 1)} %)`, min: ml, max: ml, unit: "mL", exact: true };
    }
    const [lo, hi] = UNKNOWN.sulfuricPercent;
    return {
      product: "pH moins liquide",
      min: sulfuricMassToMl(pureSulfuric, hi),
      max: sulfuricMassToMl(pureSulfuric, lo),
      unit: "mL",
      exact: false,
    };
  }

  if (validPercent(product.percent)) {
    const g = pureBisulfate / (product.percent / 100);
    return { product: `pH moins en poudre (${formatNumber(product.percent, 1)} %)`, min: g, max: g, unit: "g", exact: true };
  }
  const [lo, hi] = UNKNOWN.bisulfatePurity;
  return { product: "pH moins en poudre", min: pureBisulfate / (hi / 100), max: pureBisulfate / (lo / 100), unit: "g", exact: false };
}

/** Dose de chlore pour passer de `current` à `target` mg/L (1 mg/L = 1 g/m³ de chlore actif) */
export function doseChlorine(volume: number, current: number, target: number, product: ProductSettings["chlorine"]): Dose | null {
  const delta = target - current;
  if (delta <= 0 || volume <= 0) return null;
  const pureGrams = delta * volume;

  if (product.form === "liquide") {
    if (product.value !== null && product.value > 0 && product.value <= 100) {
      const ml = (pureGrams / (product.value * G_PER_L_PER_CHLOROMETRIC_DEGREE)) * 1000;
      return { product: `Chlore liquide (${formatNumber(product.value, 0)} °chl)`, min: ml, max: ml, unit: "mL", exact: true };
    }
    const [lo, hi] = UNKNOWN.chlorineLiquidDegrees;
    return {
      product: "Chlore liquide",
      min: (pureGrams / (hi * G_PER_L_PER_CHLOROMETRIC_DEGREE)) * 1000,
      max: (pureGrams / (lo * G_PER_L_PER_CHLOROMETRIC_DEGREE)) * 1000,
      unit: "mL",
      exact: false,
    };
  }

  if (validPercent(product.value)) {
    const g = pureGrams / (product.value / 100);
    return { product: `Chlore choc en granulés (${formatNumber(product.value, 0)} %)`, min: g, max: g, unit: "g", exact: true };
  }
  const [lo, hi] = UNKNOWN.chlorineGranules;
  return { product: "Chlore choc en granulés", min: pureGrams / (hi / 100), max: pureGrams / (lo / 100), unit: "g", exact: false };
}

/** Stabilisant (acide cyanurique ≈ 100 %) : 1 g/m³ = +1 mg/L */
export function doseStabilizer(volume: number, cya: number, target: number): Dose | null {
  const delta = target - cya;
  if (delta <= 0 || volume <= 0) return null;
  const g = delta * volume;
  return { product: "Stabilisant (acide cyanurique)", min: g, max: g, unit: "g", exact: true };
}

/**
 * Part d'eau à renouveler pour faire baisser une concentration (dilution simple).
 * fraction = 1 − cible / actuel. Renvoie 0 si aucune dilution n'est nécessaire.
 */
export function renewalFraction(current: number, target: number): number {
  if (current <= target || current <= 0) return 0;
  return 1 - target / current;
}

/** Texte lisible d'une dose ("450 g" ou "entre 380 g et 540 g") */
export function formatDose(d: Dose): string {
  const fmt = (v: number) => (d.unit === "g" ? formatMass(v) : formatVolumeLiquid(v));
  if (d.exact || Math.abs(d.max - d.min) < 1e-9) return fmt(d.min);
  const a = fmt(d.min);
  const b = fmt(d.max);
  return a === b ? a : `entre ${a} et ${b}`;
}

// ─────────────────────────────────────────────────────────────
// Analyse complète
// ─────────────────────────────────────────────────────────────

/**
 * Analyse complète de l'eau.
 * Ordre des corrections : (renouvellement si nécessaire) → TAC → pH → désinfection → stabilisant → dureté.
 */
export function analyzeWater(input: WaterInput): WaterAnalysis {
  const { volume, disinfection, ph, sanitizer, tac, cya, th, products } = input;
  const usesChlorine = disinfection !== "brome";

  const params: ParamResult[] = [evaluateTac(tac), evaluatePh(ph), evaluateSanitizer(sanitizer, disinfection, cya)];
  if (cya !== null) params.push(evaluateCya(cya, disinfection));
  if (th !== null) params.push(evaluateTh(th));

  const actions: Omit<Action, "step">[] = [];
  const alerts: string[] = [];

  // ── 0. Renouvellement partiel si stabilisant excessif ──
  if (usesChlorine && cya !== null && cya > REFERENCES.cya.renewal) {
    const fraction = renewalFraction(cya, REFERENCES.cya.renewalTarget);
    const m3 = fraction * volume;
    actions.push({
      title: "Renouveler une partie de l'eau",
      detail: `Le stabilisant ne s'élimine pas avec des produits : seule la dilution le fait baisser. Pour revenir vers ${REFERENCES.cya.renewalTarget} mg/L, remplacez environ ${formatNumber(fraction * 100, 0)} % de l'eau (≈ ${formatNumber(m3, 1)} m³), en une ou plusieurs fois. Refaites ensuite une analyse complète avant toute autre correction : les autres valeurs vont changer. Vérifiez les règles locales de vidange (réseau d'eaux pluviales, restrictions d'eau).`,
      productKeys: ["chlore-liquide"],
    });
  }

  // ── 1. TAC ──
  const tacRef = REFERENCES.tac;
  let tacLowering = false;
  if (tac < tacRef.min) {
    const dose = doseTacPlus(volume, tac, tacRef.target, products.tacPlus);
    actions.push({
      title: "Remonter le TAC",
      detail: `Objectif : ${tacRef.target} mg/L. Dissolvez le produit dans un seau d'eau et répartissez-le devant les buses de refoulement. Attendez 6 heures environ (filtration en marche) avant de mesurer le pH : le TAC plus le fait légèrement remonter.`,
      dose: dose ?? undefined,
      productKeys: ["tac-plus"],
    });
  } else if (tac > tacRef.max) {
    tacLowering = true;
    const target = 120;
    const dose = doseTacMinus(volume, tac, target, products.phMinus);
    actions.push({
      title: "Faire baisser le TAC (méthode acide + aération)",
      detail: `Objectif : ${target} mg/L. La quantité indiquée est le TOTAL à apporter : répartissez-la sur plusieurs jours. À chaque fois, faites descendre le pH vers 7,0 avec le pH moins (filtration en marche), puis aérez l'eau (jets de refoulement orientés vers la surface, cascade) pour faire remonter le pH sans remonter le TAC. Ne descendez jamais sous pH 6,8. Mesurez TAC et pH chaque jour.`,
      dose: dose ?? undefined,
      productKeys: ["ph-minus"],
    });
  }

  // ── 2. pH ──
  const phRef = REFERENCES.ph;
  // Si le TAC est corrigé à l'étape 1, le pouvoir tampon utilisé pour le pH est celui du TAC corrigé
  const tacForPh = tac < tacRef.min ? tacRef.target : tac;
  if (ph > phRef.max) {
    if (tacLowering) {
      actions.push({
        title: "Ajuster le pH",
        detail: "La baisse du TAC à l'acide va aussi faire baisser le pH : ne faites pas d'apport supplémentaire. Visez 7,2 à 7,4 une fois le TAC corrigé.",
        productKeys: [],
      });
    } else {
      const dose = dosePhMinus(volume, ph, phRef.target, tacForPh, products.phMinus);
      const tenths = (ph - phRef.target) / 0.1;
      actions.push({
        title: "Baisser le pH",
        detail: `Objectif : ${formatNumber(phRef.target, 1)}. ${
          tenths > 3 ? "L'écart est important : faites au moins deux apports espacés de 4 à 6 heures. " : ""
        }Diluez le pH moins dans un seau d'eau (le produit dans l'eau, jamais l'inverse) et versez devant les refoulements.${
          disinfection === "sel" ? " Avec un électrolyseur, le pH a naturellement tendance à monter : une régulation automatique du pH est vivement conseillée." : ""
        }`,
        dose: dose ?? undefined,
        productKeys: ["ph-minus"],
      });
    }
  } else if (ph < phRef.min) {
    const dose = dosePhPlus(volume, ph, phRef.target, tacForPh, products.phPlus);
    actions.push({
      title: "Remonter le pH",
      detail: `Objectif : ${formatNumber(phRef.target, 1)}.${
        tac < tacRef.min ? " Mesurez d'abord le pH après la correction du TAC : il aura déjà remonté, la dose pourra être réduite." : ""
      } Diluez le pH plus dans un seau d'eau et versez devant les refoulements.`,
      dose: dose ?? undefined,
      productKeys: ["ph-plus"],
    });
  }

  // ── 3. Désinfection ──
  if (disinfection === "brome") {
    const b = REFERENCES.bromine;
    if (sanitizer < b.min) {
      actions.push({
        title: "Remonter le taux de brome",
        detail: `Objectif : ${b.min} à ${b.max} mg/L. Ouvrez davantage le brominateur et vérifiez qu'il contient suffisamment de pastilles. ${
          sanitizer < 1 ? "Le taux étant très bas, faites aussi un traitement choc (oxydant ou chlore choc non stabilisé) en suivant l'étiquette du fabricant. " : ""
        }Le dosage du brome dépend du réglage du brominateur : suivez la notice du fabricant.`,
        productKeys: ["brome"],
      });
    } else if (sanitizer > b.max) {
      actions.push({
        title: "Laisser redescendre le brome",
        detail: "Réduisez le réglage du brominateur et laissez la filtration tourner, bâche ouverte. Recontrôlez le lendemain.",
        productKeys: [],
      });
    }
  } else {
    const c = REFERENCES.chlorine;
    const target = clamp(cya !== null ? Math.max(c.target, cya * 0.05) : c.target, c.target, c.max);
    const highCya = cya !== null && cya > REFERENCES.cya.max;
    if (sanitizer < c.min) {
      if (disinfection === "sel") {
        const dose = sanitizer < 0.5 ? doseChlorine(volume, sanitizer, target, products.chlorine) : null;
        actions.push({
          title: "Relancer la production de chlore",
          detail: `Vérifiez le taux de sel (généralement 3 à 5 g/L selon le modèle), l'état de la cellule (tartre), le pourcentage de production et la durée de filtration (l'électrolyseur ne produit que lorsque la pompe tourne). ${
            dose
              ? `Le chlore étant quasi absent, faites un apport de chlore ${highCya ? "non stabilisé (liquide) " : "choc non stabilisé "}pour atteindre ${formatNumber(target, 1)} mg/L en attendant.`
              : "Augmentez la production ou activez le mode « boost » si votre appareil en dispose."
          }`,
          dose: dose ?? undefined,
          productKeys: dose ? ["chlore-liquide", "testeur-sel", "nettoyant-cellule"] : ["testeur-sel", "nettoyant-cellule"],
        });
      } else {
        const dose = doseChlorine(volume, sanitizer, target, products.chlorine);
        actions.push({
          title: "Remonter le chlore",
          detail: `Objectif : ${formatNumber(target, 1)} mg/L.${
            highCya
              ? " Votre stabilisant est déjà élevé : utilisez un chlore NON stabilisé (chlore liquide ou hypochlorite de calcium), pas de dichlore ni de galets de trichlore."
              : ""
          } Faites l'apport de préférence le soir (le soleil détruit le chlore), filtration en marche, jamais en même temps qu'un produit acide. Vérifiez ensuite que le diffuseur ou le skimmer contient des galets de chlore lent pour l'entretien.`,
          dose: dose ?? undefined,
          productKeys: highCya ? ["chlore-liquide"] : ["chlore-choc", "chlore-lent"],
        });
      }
    } else if (sanitizer > c.max) {
      actions.push({
        title: "Laisser redescendre le chlore",
        detail: `Cessez tout apport de chlore${disinfection === "sel" ? " et baissez la production de l'électrolyseur" : ""}. Laissez la filtration tourner, bâche ouverte : le soleil fera baisser le taux en 1 à 2 jours. Recontrôlez avant de vous baigner.`,
        productKeys: [],
      });
    }
  }

  // ── 4. Stabilisant trop bas ──
  if (usesChlorine && cya !== null && cya < REFERENCES.cya.min) {
    const dose = doseStabilizer(volume, cya, REFERENCES.cya.target);
    actions.push({
      title: "Ajouter du stabilisant",
      detail: `Objectif : ${REFERENCES.cya.target} mg/L. Placez le produit dans une chaussette dans le panier du skimmer (il se dissout lentement). Recontrôlez après 48 heures. Si vous utilisez des galets de chlore stabilisé, le taux montera aussi tout seul au fil de la saison.`,
      dose: dose ?? undefined,
      productKeys: ["stabilisant"],
    });
  }

  // ── 5. Dureté ──
  if (th !== null) {
    if (th > REFERENCES.th.max) {
      actions.push({
        title: "Limiter le tartre",
        detail:
          "Maintenez le pH entre 7,2 et 7,3 (le tartre se forme surtout quand le pH monte) et utilisez un séquestrant calcaire. Si l'eau est très dure, un appoint avec une eau plus douce aide à long terme.",
        productKeys: ["anti-calcaire"],
      });
    } else if (th < REFERENCES.th.min) {
      const delta = REFERENCES.th.min + 20 - th;
      // Chlorure de calcium dihydraté (≈ 77 % CaCl2) : 110,98 / 100,09 / 0,77 ≈ 1,44 g/m³ par mg/L
      const g = delta * (110.98 / 100.09 / 0.77) * volume;
      actions.push({
        title: "Augmenter la dureté",
        detail:
          "Une eau trop douce attaque les joints et les parties métalliques. Le « dureté plus » (chlorure de calcium) se dissout dans un seau d'eau avant d'être versé, en plusieurs fois. Dose calculée pour du chlorure de calcium en paillettes à 77 % ; suivez l'étiquette si votre produit est différent.",
        dose: { product: "Dureté plus (chlorure de calcium)", min: g, max: g, unit: "g", exact: true },
        productKeys: ["calcium-plus"],
      });
    }
  }

  // ── Alertes ──
  const hasCritical = params.some((p) => p.status === "critique");
  if (usesChlorine && sanitizer < 0.5) alerts.push("Baignade déconseillée : l'eau n'est pas désinfectée.");
  if (usesChlorine && sanitizer > 5) alerts.push("Baignade déconseillée tant que le chlore dépasse 5 mg/L (idéalement attendre moins de 3 mg/L).");
  if (disinfection === "brome" && (sanitizer < 1 || sanitizer > 6)) alerts.push("Baignade déconseillée tant que le taux de brome n'est pas corrigé.");
  if (ph < 6.8 || ph > 8.0) alerts.push("pH hors limites : corrigez-le avant de vous baigner.");

  return {
    params,
    actions: actions.map((a, i) => ({ ...a, step: i + 1 })),
    alerts,
    hasCritical,
  };
}
