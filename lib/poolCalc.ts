/**
 * Calculs liés au bassin : volume, filtration, pompe, consommation électrique.
 * Fonctions pures, testées dans tests/poolCalc.test.ts.
 */

// ─────────────────────────────────────────────────────────────
// Volume
// ─────────────────────────────────────────────────────────────

export type PoolShape = "rectangulaire" | "ronde" | "ovale" | "libre";

/** Coefficient d'usage de la profession pour les bassins ovales (≈ rectangle aux bouts arrondis) */
export const OVAL_COEFFICIENT = 0.89;

/** Profondeur moyenne = (profondeur min + profondeur max) / 2 */
export function averageDepth(minDepth: number, maxDepth: number): number {
  return (minDepth + maxDepth) / 2;
}

export interface VolumeInput {
  shape: PoolShape;
  /** Longueur (m) – rectangulaire, ovale */
  length?: number;
  /** Largeur (m) – rectangulaire, ovale */
  width?: number;
  /** Diamètre (m) – ronde */
  diameter?: number;
  /** Surface du plan d'eau (m²) – forme libre */
  surface?: number;
  minDepth: number;
  maxDepth: number;
}

/** Volume en m³ (renvoie null si une dimension nécessaire est manquante ou invalide) */
export function poolVolume(input: VolumeInput): number | null {
  const { shape, length, width, diameter, surface, minDepth, maxDepth } = input;
  if (!(minDepth > 0) || !(maxDepth > 0) || maxDepth < minDepth) return null;
  const h = averageDepth(minDepth, maxDepth);
  const ok = (v: number | undefined): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

  switch (shape) {
    case "rectangulaire":
      return ok(length) && ok(width) ? length * width * h : null;
    case "ronde": {
      if (!ok(diameter)) return null;
      const r = diameter / 2;
      return Math.PI * r * r * h;
    }
    case "ovale":
      return ok(length) && ok(width) ? length * width * h * OVAL_COEFFICIENT : null;
    case "libre":
      return ok(surface) ? surface * h : null;
  }
}

// ─────────────────────────────────────────────────────────────
// Temps de filtration
// ─────────────────────────────────────────────────────────────

export interface FiltrationInput {
  /** Température de l'eau (°C) */
  temperature: number;
  /** Forte fréquentation (baigneurs nombreux, pool party…) */
  heavyUse?: boolean;
  /** Volume (m³) et débit de la pompe (m³/h), facultatifs, pour calculer le nombre de cycles */
  volume?: number;
  flow?: number;
}

export interface FiltrationResult {
  /** Heures de filtration conseillées par jour (arrondi à la demi-heure) */
  hours: number;
  /** Mode de fonctionnement */
  mode: "hors-gel" | "hivernage-actif" | "saison" | "forte-chaleur";
  /** Nombre de fois où le volume est filtré par jour (si volume et débit fournis) */
  turnovers: number | null;
  tips: string[];
}

const roundHalf = (h: number) => Math.round(h * 2) / 2;

/**
 * Règle usuelle : heures de filtration = température de l'eau / 2.
 *  - < 5 °C : mode hors-gel (filtration asservie à la température ou en continu pendant le gel)
 *  - 5 à 12 °C : hivernage actif, règle température / 3 (minimum 3 h)
 *  - ≥ 12 °C : température / 2 (minimum 6 h)
 *  - ≥ 28 °C : forte chaleur, 24 h/24 conseillé au-delà de 30 °C
 *  - forte fréquentation : + 2 h
 */
export function filtrationTime(input: FiltrationInput): FiltrationResult {
  const { temperature: t, heavyUse = false, volume, flow } = input;
  const tips: string[] = [];
  let hours: number;
  let mode: FiltrationResult["mode"];

  if (t < 5) {
    mode = "hors-gel";
    hours = 3;
    tips.push(
      "Risque de gel : en hivernage actif, faites fonctionner la filtration en continu pendant les nuits de gel (ou utilisez un coffret avec sonde hors-gel).",
      "Ne laissez jamais de l'eau immobile dans les canalisations par grand froid.",
    );
  } else if (t < 12) {
    mode = "hivernage-actif";
    hours = Math.max(3, roundHalf(t / 3));
    tips.push("En dessous de 12 °C, l'activité des algues est faible : on applique la règle « température / 3 » (hivernage actif).");
  } else {
    hours = Math.max(6, roundHalf(t / 2));
    mode = t >= 28 ? "forte-chaleur" : "saison";
    if (t >= 30) {
      hours = 24;
      tips.push("Au-delà de 30 °C, filtrez en continu (24 h/24) : les algues se développent très vite.");
    } else if (t >= 28) {
      tips.push("Forte chaleur : surveillez le chlore tous les jours et passez en filtration continue si l'eau dépasse 30 °C.");
    }
    tips.push("Répartissez la filtration sur les heures les plus chaudes de la journée, avec au moins une plage en plein après-midi.");
  }

  if (heavyUse && hours < 24) {
    hours = Math.min(24, hours + 2);
    tips.push("Forte fréquentation : +2 heures, et prolongez la filtration après la baignade.");
  }

  tips.push("Après un orage, une forte pluie ou un traitement choc, filtrez 24 h en continu.");

  let turnovers: number | null = null;
  if (volume && flow && volume > 0 && flow > 0) {
    turnovers = (flow * hours) / volume;
    if (turnovers < 2 && mode !== "hors-gel" && mode !== "hivernage-actif") {
      tips.push("Le volume n'est pas filtré au moins 2 fois par jour : augmentez la durée de filtration ou vérifiez le débit réel de la pompe.");
    }
  }

  return { hours, mode, turnovers, tips };
}

// ─────────────────────────────────────────────────────────────
// Dimensionnement de pompe
// ─────────────────────────────────────────────────────────────

/**
 * Tableau indicatif de pompes monovitesse courantes.
 * Débit approximatif à une hauteur manométrique d'environ 10 mCE (installation standard).
 * Les valeurs réelles dépendent de la courbe du fabricant.
 */
export const PUMP_TABLE = [
  { cv: 0.33, watts: 250, flow: 5 },
  { cv: 0.5, watts: 370, flow: 7 },
  { cv: 0.75, watts: 550, flow: 11 },
  { cv: 1, watts: 750, flow: 14 },
  { cv: 1.5, watts: 1100, flow: 18 },
  { cv: 2, watts: 1500, flow: 23 },
  { cv: 3, watts: 2200, flow: 30 },
] as const;

/** Vitesse de filtration maximale conseillée pour un filtre à sable (m³/h par m² de surface filtrante) */
export const SAND_FILTER_MAX_SPEED = 50;

export interface PumpResult {
  /** Débit minimal : renouvellement en 6 h (m³/h) */
  minFlow: number;
  /** Débit maximal : renouvellement en 4 h (m³/h) */
  maxFlow: number;
  /** Pompe indicative conseillée (null si le volume dépasse le tableau) */
  pump: (typeof PUMP_TABLE)[number] | null;
  /** Diamètre minimal indicatif d'un filtre à sable (mm) pour le débit de la pompe */
  sandFilterDiameterMm: number | null;
}

/** Débit (m³/h) nécessaire pour renouveler `volume` en `hours` heures */
export function requiredFlow(volume: number, hours: number): number {
  return volume / hours;
}

/** Diamètre minimal (mm) d'un filtre à sable pour un débit donné, arrondi aux tailles du commerce */
export function sandFilterDiameter(flow: number): number {
  const area = flow / SAND_FILTER_MAX_SPEED; // m²
  const d = Math.sqrt((4 * area) / Math.PI) * 1000; // mm
  const sizes = [400, 450, 500, 560, 600, 650, 700, 750, 800, 900, 1000];
  return sizes.find((s) => s >= d) ?? Math.ceil(d / 50) * 50;
}

export function pumpSizing(volume: number): PumpResult | null {
  if (!(volume > 0)) return null;
  const minFlow = requiredFlow(volume, 6);
  const maxFlow = requiredFlow(volume, 4);
  // On retient la plus petite pompe atteignant au moins le débit "renouvellement en 6 h"
  const pump = PUMP_TABLE.find((p) => p.flow >= minFlow) ?? null;
  const sandFilterDiameterMm = pump ? sandFilterDiameter(pump.flow) : null;
  return { minFlow, maxFlow, pump, sandFilterDiameterMm };
}

// ─────────────────────────────────────────────────────────────
// Consommation électrique
// ─────────────────────────────────────────────────────────────

/** Prix par défaut du kWh (€ TTC), modifiable dans l'outil. À vérifier sur votre facture. */
export const DEFAULT_KWH_PRICE = 0.2;

export interface ConsumptionResult {
  kwhPerDay: number;
  kwhSeason: number;
  costSeason: number;
  costPerDay: number;
}

/** kWh = puissance (W) × heures/jour × jours / 1000 ; coût = kWh × prix */
export function electricityConsumption(
  powerWatts: number,
  hoursPerDay: number,
  days: number,
  pricePerKwh: number,
): ConsumptionResult | null {
  if (!(powerWatts > 0) || !(hoursPerDay > 0) || hoursPerDay > 24 || !(days > 0) || !(pricePerKwh >= 0)) return null;
  const kwhPerDay = (powerWatts * hoursPerDay) / 1000;
  const kwhSeason = kwhPerDay * days;
  return {
    kwhPerDay,
    kwhSeason,
    costSeason: kwhSeason * pricePerKwh,
    costPerDay: kwhPerDay * pricePerKwh,
  };
}
