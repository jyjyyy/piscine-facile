/**
 * Dimensionnement indicatif d'une pompe à chaleur (PAC) de piscine.
 *
 * Méthode : puissance de référence de 0,2 kW par m³ (bassin extérieur, région tempérée,
 * saison mai → septembre, bâche à bulles, eau à 27 °C), corrigée par des coefficients
 * (région, saison, couverture, température voulue, exposition au vent).
 * Cette méthode reproduit les abaques usuels des fabricants. Elle ne remplace pas une étude
 * de déperditions : le résultat est une puissance RESTITUÉE à comparer aux fiches techniques
 * dans les conditions « air 15 °C / eau 26 °C ».
 */

export type Region = "nord-est" | "centre-ouest" | "sud-ouest" | "mediterranee";
export type Season = "ete" | "mai-sept" | "avril-oct" | "mars-nov";
export type Cover = "aucune" | "bache" | "volet" | "abri";

export const REFERENCE_KW_PER_M3 = 0.2;

export const REGION_FACTOR: Record<Region, number> = {
  "nord-est": 1.2,
  "centre-ouest": 1.0,
  "sud-ouest": 0.9,
  mediterranee: 0.8,
};

export const SEASON_FACTOR: Record<Season, number> = {
  ete: 0.85,
  "mai-sept": 1.0,
  "avril-oct": 1.25,
  "mars-nov": 1.5,
};

export const COVER_FACTOR: Record<Cover, number> = {
  aucune: 1.4,
  bache: 1.0,
  volet: 0.85,
  abri: 0.7,
};

/** Puissances restituées courantes du commerce (kW) */
export const COMMERCIAL_SIZES = [5, 7, 9, 11, 13, 15, 17, 20, 23, 26, 30, 35] as const;

/** Énergie pour chauffer 1 m³ d'eau de 1 °C : 1,163 kWh */
export const KWH_PER_M3_PER_DEGREE = 1.163;

/** COP indicatif d'une PAC récente à air 15 °C / eau 26 °C */
export const TYPICAL_COP = 5;

export interface HeatPumpInput {
  volume: number;
  region: Region;
  season: Season;
  cover: Cover;
  /** Température d'eau souhaitée (°C), 24 à 32 */
  targetTemp: number;
  /** Site exposé au vent */
  windy?: boolean;
  /** Température de l'eau au démarrage du chauffage (°C), pour estimer la mise en température */
  startTemp?: number;
}

export interface HeatPumpResult {
  /** Puissance calculée (kW) */
  power: number;
  /** Taille commerciale conseillée (kW), null si au-delà de la gamme */
  commercialSize: number | null;
  /** Durée estimée de mise en température (heures), null si non calculable */
  heatUpHours: number | null;
  /** Puissance électrique absorbée estimée (kW) */
  electricalKw: number;
  /** Intensité estimée en monophasé 230 V (A) */
  currentA: number;
}

/** Facteur température : +10 % par degré au-dessus de 27 °C, −10 % en dessous */
export function temperatureFactor(target: number): number {
  const t = Math.min(32, Math.max(24, target));
  return 1 + 0.1 * (t - 27);
}

export function heatPumpSizing(input: HeatPumpInput): HeatPumpResult | null {
  const { volume, region, season, cover, targetTemp, windy = false, startTemp } = input;
  if (!(volume > 0) || !(targetTemp > 0)) return null;

  const power =
    volume *
    REFERENCE_KW_PER_M3 *
    REGION_FACTOR[region] *
    SEASON_FACTOR[season] *
    COVER_FACTOR[cover] *
    temperatureFactor(targetTemp) *
    (windy ? 1.15 : 1);

  const commercialSize = COMMERCIAL_SIZES.find((s) => s >= power) ?? null;
  const size = commercialSize ?? power;

  let heatUpHours: number | null = null;
  if (startTemp !== undefined && startTemp < targetTemp) {
    const energy = KWH_PER_M3_PER_DEGREE * volume * (targetTemp - startTemp);
    // 80 % de la puissance sert réellement à chauffer (le reste compense les pertes, bassin couvert)
    heatUpHours = energy / (size * 0.8);
  }

  const electricalKw = size / TYPICAL_COP;
  return { power, commercialSize, heatUpHours, electricalKw, currentA: (electricalKw * 1000) / 230 };
}
