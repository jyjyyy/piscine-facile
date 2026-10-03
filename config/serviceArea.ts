/**
 * Votre activité d'électricien piscine.
 *
 * ➜ `departments` : ajoutez ici les départements où VOUS intervenez.
 *   Chaque département ajouté crée automatiquement une page /electricien-piscine/<code>-<nom>
 *   et les demandes « Électricité » venant de ces départements sont signalées « [Ma zone] »
 *   (et envoyées à QUOTE_ZONE_EMAIL si cette variable est définie).
 *
 * ➜ Rédigez une phrase `localNote` propre à chaque département : c'est ce qui rend la page unique
 *   aux yeux de Google (évitez les pages identiques où seul le nom de ville change).
 *
 * Exemple :
 *   {
 *     code: "33",
 *     name: "Gironde",
 *     climate: "doux",
 *     cities: ["Bordeaux", "Mérignac", "Pessac", "Arcachon"],
 *     localNote: "Intervention sous 48 h sur la métropole bordelaise et le bassin d'Arcachon.",
 *   },
 */

export interface ServiceDepartment {
  /** Code du département : "33", "2A", "974"… */
  code: string;
  /** Nom du département */
  name: string;
  /** Climat dominant : adapte les conseils (hors-gel, saison de chauffe…) */
  climate: "doux" | "froid";
  /** Principales communes couvertes */
  cities: string[];
  /** Phrase propre à ce département (délais, secteurs, spécificités) */
  localNote: string;
}

export const electricianService = {
  /** Affiche la page /electricien-piscine et le lien dans le pied de page */
  enabled: true,
  /** Mention d'assurance décennale affichée sur la page (obligatoire sur vos devis et factures) */
  insurance: "",
  /** Qualifications affichées sur la page (laissez vide pour masquer) */
  qualifications: ["Bac Pro MELEC", "CAP"] as string[],
  departments: [] as ServiceDepartment[],
};

/** Slug d'URL d'un département : "33-gironde" */
export function departmentSlug(d: ServiceDepartment): string {
  const name = d.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${d.code.toLowerCase()}-${name}`;
}

/** Code département à partir d'un code postal (gère la Corse et l'outre-mer) */
export function departmentFromPostalCode(cp: string): string | null {
  if (!/^\d{5}$/.test(cp)) return null;
  if (cp.startsWith("97") || cp.startsWith("98")) return cp.slice(0, 3);
  if (cp.startsWith("20")) return Number(cp.slice(0, 3)) < 202 ? "2A" : "2B";
  return cp.slice(0, 2);
}

/** Le code postal fait-il partie de votre zone d'intervention ? */
export function isInServiceArea(cp: string): boolean {
  const dep = departmentFromPostalCode(cp);
  return dep !== null && electricianService.departments.some((d) => d.code.toUpperCase() === dep);
}
