/**
 * Formulaire de demande de devis : types de besoin et validation.
 * Utilisé à la fois par le formulaire (navigateur) et par la route API (serveur).
 */

export const QUOTE_NEEDS = [
  { value: "entretien", label: "Entretien / traitement de l'eau" },
  { value: "remise-en-route", label: "Remise en route" },
  { value: "hivernage", label: "Hivernage" },
  { value: "filtration", label: "Filtration / pompe" },
  { value: "electricite", label: "Électricité (disjoncteur, coffret, éclairage)" },
  { value: "electrolyseur", label: "Électrolyseur / régulation" },
  { value: "fuite", label: "Recherche de fuite" },
  { value: "renovation", label: "Rénovation (liner, margelles…)" },
  { value: "construction", label: "Construction d'une piscine" },
  { value: "autre", label: "Autre" },
] as const;

export type QuoteNeed = (typeof QUOTE_NEEDS)[number]["value"];

export interface QuoteData {
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  need: QuoteNeed;
  description: string;
  consent: boolean;
}

export type QuoteErrors = Partial<Record<keyof QuoteData, string>>;

export function needLabel(value: string): string {
  return QUOTE_NEEDS.find((n) => n.value === value)?.label ?? value;
}

export function isQuoteNeed(value: string): value is QuoteNeed {
  return QUOTE_NEEDS.some((n) => n.value === value);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Téléphone français : 10 chiffres commençant par 0, ou format international +33 */
const PHONE_RE = /^(?:\+33\s?[1-9]|0[1-9])(?:[\s.-]?\d{2}){4}$/;
/** Code postal français (métropole, Corse 20, DOM 97x) */
const POSTAL_RE = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;

/** Valide les données du formulaire. Renvoie un objet vide si tout est correct. */
export function validateQuote(d: Partial<Record<keyof QuoteData, unknown>>): QuoteErrors {
  const e: QuoteErrors = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(d.name);
  if (name.length < 2) e.name = "Indiquez votre nom.";
  else if (name.length > 100) e.name = "Nom trop long.";

  const email = str(d.email);
  if (!EMAIL_RE.test(email) || email.length > 200) e.email = "Adresse e-mail invalide.";

  const phone = str(d.phone);
  if (!PHONE_RE.test(phone)) e.phone = "Numéro de téléphone invalide (ex : 06 12 34 56 78).";

  const postal = str(d.postalCode);
  if (!POSTAL_RE.test(postal)) e.postalCode = "Code postal invalide (5 chiffres).";

  if (!isQuoteNeed(str(d.need))) e.need = "Choisissez un type de besoin.";

  const desc = str(d.description);
  if (desc.length < 20) e.description = "Décrivez votre besoin en quelques phrases (20 caractères minimum).";
  else if (desc.length > 3000) e.description = "Description trop longue (3 000 caractères maximum).";

  if (d.consent !== true) e.consent = "Votre accord est nécessaire pour transmettre votre demande.";

  return e;
}
