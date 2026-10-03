/**
 * Accès typé à l'arbre de dépannage (data/troubleshooting.json).
 * Pour ajouter un problème ou une question, modifiez uniquement le fichier JSON (voir README).
 */
import data from "@/data/troubleshooting.json";

export interface TsOption {
  label: string;
  /** Identifiant du nœud suivant */
  next: string;
}

export interface TsQuestion {
  type: "question";
  text: string;
  help?: string;
  options: TsOption[];
}

export interface TsResult {
  type: "result";
  title: string;
  /** diy = faisable soi-même ; pro = professionnel conseillé ; electricien = électricien obligatoire */
  severity: "diy" | "pro" | "electricien";
  causes: string[];
  steps: string[];
  /** Clés de config/affiliates.ts */
  products: string[];
  showPro: boolean;
}

export type TsNode = TsQuestion | TsResult;

export interface TsFaq {
  q: string;
  a: string;
}

export interface TsProblem {
  slug: string;
  title: string;
  question: string;
  shortDescription: string;
  icon: string;
  metaDescription: string;
  /** Slug de l'article de blog associé */
  relatedArticle?: string;
  /** Type de besoin pré-rempli dans le formulaire de devis */
  proNeed: string;
  startNode: string;
  nodes: Record<string, TsNode>;
  faq: TsFaq[];
}

// Le JSON est validé par les tests (tests/troubleshooting.test.ts)
export const problems = (data as unknown as { problems: TsProblem[] }).problems;

export function getProblem(slug: string): TsProblem | undefined {
  return problems.find((p) => p.slug === slug);
}

/**
 * Vérifie la cohérence de l'arbre : chaque option pointe vers un nœud existant,
 * chaque nœud est atteignable, chaque question a au moins une option.
 * Renvoie la liste des erreurs (vide si tout est correct).
 */
export function validateProblem(p: TsProblem): string[] {
  const errors: string[] = [];
  if (!p.nodes[p.startNode]) errors.push(`${p.slug} : nœud de départ "${p.startNode}" introuvable`);
  const reached = new Set<string>();
  const visit = (id: string) => {
    if (reached.has(id)) return;
    reached.add(id);
    const node = p.nodes[id];
    if (!node) return;
    if (node.type === "question") {
      if (node.options.length === 0) errors.push(`${p.slug} : la question "${id}" n'a aucune option`);
      node.options.forEach((o) => {
        if (!p.nodes[o.next]) errors.push(`${p.slug} : "${id}" pointe vers "${o.next}" qui n'existe pas`);
        visit(o.next);
      });
    }
  };
  visit(p.startNode);
  Object.keys(p.nodes).forEach((id) => {
    if (!reached.has(id)) errors.push(`${p.slug} : le nœud "${id}" n'est jamais atteint`);
  });
  return errors;
}
