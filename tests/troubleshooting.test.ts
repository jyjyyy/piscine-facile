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

import { readFileSync } from "node:fs";

describe("calendrier d'entretien", () => {
  it("toutes les clés produits du calendrier existent dans config/affiliates.ts", () => {
    const src = readFileSync("app/calendrier-entretien/page.tsx", "utf8");
    const keys = [...src.matchAll(/(?:essentials|options): \[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
    expect(keys.length).toBeGreaterThan(10);
    expect(keys.filter((k) => !getAffiliate(k))).toEqual([]);
  });
});
