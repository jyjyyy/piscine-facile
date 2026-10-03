/**
 * Indice de saturation de Langelier (ISL / LSI) : l'eau est-elle agressive ou entartrante ?
 *
 * Formule de Carrier :
 *   pHs = (9,3 + A + B) − (C + D)
 *   A = (log10(TDS) − 1) / 10
 *   B = −13,12 × log10(T + 273,15) + 34,55
 *   C = log10(dureté calcique en mg/L CaCO3) − 0,4
 *   D = log10(alcalinité carbonatée en mg/L CaCO3)
 *   ISL = pH − pHs
 *
 * L'alcalinité carbonatée est le TAC diminué de la part due au stabilisant (cyanurates),
 * calculée selon le pH (pKa de l'acide cyanurique ≈ 6,88).
 */

export type LsiStatus = "agressive" | "equilibree" | "entartrante";

export interface LsiInput {
  ph: number;
  /** Température de l'eau (°C) */
  temperature: number;
  /** Dureté calcique (mg/L CaCO3) – à défaut, le TH total */
  calcium: number;
  /** TAC (mg/L CaCO3) */
  tac: number;
  /** Stabilisant (mg/L), 0 si absent */
  cya?: number;
  /** Total des solides dissous (mg/L) */
  tds: number;
}

export interface LsiResult {
  lsi: number;
  /** pH de saturation : pH auquel l'eau serait parfaitement équilibrée */
  phs: number;
  carbonateAlkalinity: number;
  status: LsiStatus;
}

/** Part du stabilisant comptée dans le TAC (mg/L CaCO3) */
export function cyanurateAlkalinity(cya: number, ph: number): number {
  if (cya <= 0) return 0;
  const ionized = 1 / (1 + 10 ** (6.88 - ph));
  return cya * ionized * (50.04 / 129.07);
}

export function langelier(input: LsiInput): LsiResult | null {
  const { ph, temperature, calcium, tac, cya = 0, tds } = input;
  if (!(calcium > 0) || !(tac > 0) || !(tds > 0) || !(ph > 0)) return null;
  const carbonateAlkalinity = tac - cyanurateAlkalinity(cya, ph);
  if (carbonateAlkalinity <= 0) return null;

  const A = (Math.log10(tds) - 1) / 10;
  const B = -13.12 * Math.log10(temperature + 273.15) + 34.55;
  const C = Math.log10(calcium) - 0.4;
  const D = Math.log10(carbonateAlkalinity);
  const phs = 9.3 + A + B - (C + D);
  const lsi = ph - phs;
  const status: LsiStatus = lsi < -0.3 ? "agressive" : lsi > 0.3 ? "entartrante" : "equilibree";
  return { lsi, phs, carbonateAlkalinity, status };
}

/** TDS estimé : ≈ 1 000 mg/L pour une eau chlorée classique, sel + 500 mg/L pour un électrolyseur */
export function estimateTds(saltGramsPerLiter: number | null): number {
  return saltGramsPerLiter && saltGramsPerLiter > 0 ? saltGramsPerLiter * 1000 + 500 : 1000;
}
