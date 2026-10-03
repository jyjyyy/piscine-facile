import { describe, expect, it } from "vitest";
import { problems, validateProblem } from "@/lib/troubleshooting";
import { getAffiliate } from "@/config/affiliates";

describe("arbre de dépannage (data/troubleshooting.json)", () => {
  it("contient les 10 problèmes", () => {
    expect(problems).toHaveLength(10);
  });

  it.each(problems.map((p) => [p.slug, p] as const))("%s : arbre cohérent", (_slug, p) => {
    expect(validateProblem(p)).toEqual([]);
  });

  it("toutes les clés produits existent dans config/affiliates.ts", () => {
    const missing: string[] = [];
    problems.forEach((p) =>
      Object.values(p.nodes).forEach((n) => {
        if (n.type === "result") n.products.forEach((k) => !getAffiliate(k) && missing.push(`${p.slug}:${k}`));
      }),
    );
    expect(missing).toEqual([]);
  });

  it("les résultats « électricien » proposent toujours un professionnel", () => {
    problems.forEach((p) =>
      Object.values(p.nodes).forEach((n) => {
        if (n.type === "result" && n.severity === "electricien") expect(n.showPro).toBe(true);
      }),
    );
  });
});
