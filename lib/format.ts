/** Utilitaires de formatage des nombres en français */

/** Formate un nombre avec la virgule française et un nombre de décimales maximal */
export function formatNumber(value: number, maxDecimals = 1): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  }).format(value);
}

/** Arrondit une masse en grammes à une valeur "pratique" (pesée au gramme près inutile) */
export function roundGrams(g: number): number {
  if (g < 50) return Math.round(g);
  if (g < 500) return Math.round(g / 5) * 5;
  if (g < 2000) return Math.round(g / 10) * 10;
  return Math.round(g / 50) * 50;
}

/** Arrondit un volume en millilitres à une valeur pratique */
export function roundMl(ml: number): number {
  if (ml < 100) return Math.round(ml);
  if (ml < 1000) return Math.round(ml / 10) * 10;
  return Math.round(ml / 50) * 50;
}

/** Affiche une masse en g ou kg */
export function formatMass(g: number): string {
  const r = roundGrams(g);
  return r >= 1000 ? `${formatNumber(r / 1000, 2)} kg` : `${formatNumber(r, 0)} g`;
}

/** Affiche un volume liquide en mL ou L */
export function formatVolumeLiquid(ml: number): string {
  const r = roundMl(ml);
  return r >= 1000 ? `${formatNumber(r / 1000, 2)} L` : `${formatNumber(r, 0)} mL`;
}

/** Parse une saisie utilisateur ("7,4" ou "7.4") en nombre, ou null si vide / invalide */
export function parseInput(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
