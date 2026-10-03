import { describe, expect, it } from "vitest";
import {
  analyzeWater,
  bufferFactor,
  doseChlorine,
  dosePhMinus,
  dosePhPlus,
  doseStabilizer,
  doseTacMinus,
  doseTacPlus,
  evaluateCya,
  evaluatePh,
  evaluateSanitizer,
  evaluateTac,
  formatDose,
  renewalFraction,
  type ProductSettings,
} from "@/lib/waterCalc";

const unknownProducts: ProductSettings = {
  phMinus: { form: "poudre", percent: null },
  phPlus: { percent: null },
  tacPlus: { percent: null },
  chlorine: { form: "granules", value: null },
};

describe("évaluation des paramètres", () => {
  it("classe le pH", () => {
    expect(evaluatePh(7.3).status).toBe("bon");
    expect(evaluatePh(7.2).status).toBe("bon");
    expect(evaluatePh(7.5).status).toBe("a-corriger");
    expect(evaluatePh(7.7).status).toBe("a-corriger");
    expect(evaluatePh(8.2).status).toBe("critique");
    expect(evaluatePh(6.6).status).toBe("critique");
  });

  it("classe le chlore libre", () => {
    expect(evaluateSanitizer(2, "chlore", null).status).toBe("bon");
    expect(evaluateSanitizer(0.8, "chlore", null).status).toBe("a-corriger");
    expect(evaluateSanitizer(0.2, "chlore", null).status).toBe("critique");
    expect(evaluateSanitizer(4, "chlore", null).status).toBe("a-corriger");
    expect(evaluateSanitizer(6, "chlore", null).status).toBe("critique");
  });

  it("classe le TAC", () => {
    expect(evaluateTac(100).status).toBe("bon");
    expect(evaluateTac(70).status).toBe("a-corriger");
    expect(evaluateTac(40).status).toBe("critique");
    expect(evaluateTac(180).status).toBe("a-corriger");
  });

  it("classe le stabilisant (seuil de renouvellement à 75 mg/L)", () => {
    expect(evaluateCya(30, "chlore").status).toBe("bon");
    expect(evaluateCya(60, "chlore").status).toBe("a-corriger");
    expect(evaluateCya(80, "chlore").status).toBe("critique");
    expect(evaluateCya(80, "brome").status).toBe("bon");
  });
});

describe("doses – calculs stœchiométriques vérifiés à la main", () => {
  it("TAC plus : 50 m³, 60 → 100 mg/L, bicarbonate pur = 40 × 1,679 × 50 ≈ 3 358 g", () => {
    const d = doseTacPlus(50, 60, 100, { percent: 100 });
    expect(d?.min).toBeCloseTo(3357.8, 0);
    expect(d?.exact).toBe(true);
  });

  it("baisse du TAC : 50 m³, 200 → 120 mg/L, bisulfate 95 % = 80 × 2,399 × 50 / 0,95 ≈ 10 102 g", () => {
    const d = doseTacMinus(50, 200, 120, { form: "poudre", percent: 95 });
    expect(d?.min).toBeCloseTo(10102, -1);
  });

  it("chlore granulés 56 % : 50 m³, 0,5 → 2 mg/L = 75 g de chlore actif / 0,56 ≈ 134 g", () => {
    const d = doseChlorine(50, 0.5, 2, { form: "granules", value: 56 });
    expect(d?.min).toBeCloseTo(133.9, 1);
  });

  it("chlore liquide 48 °chl : 75 g / (48 × 3,17 g/L) ≈ 493 mL", () => {
    const d = doseChlorine(50, 0.5, 2, { form: "liquide", value: 48 });
    expect(d?.unit).toBe("mL");
    expect(d?.min).toBeCloseTo(492.9, 0);
  });

  it("stabilisant : 1 g/m³ = +1 mg/L", () => {
    expect(doseStabilizer(40, 10, 30)?.min).toBe(800);
  });

  it("aucune dose si la valeur est déjà atteinte", () => {
    expect(doseTacPlus(50, 120, 100, { percent: null })).toBeNull();
    expect(dosePhMinus(50, 7.2, 7.3, 100, { form: "poudre", percent: null })).toBeNull();
    expect(doseChlorine(50, 3, 2, { form: "granules", value: null })).toBeNull();
  });
});

describe("doses de pH – coefficients fabricants", () => {
  it("pH moins 95 % : 50 m³, 7,8 → 7,3, TAC 100 = 5 × 8,5 × 50 / 0,95 ≈ 2 237 g", () => {
    const d = dosePhMinus(50, 7.8, 7.3, 100, { form: "poudre", percent: 95 });
    expect(d?.min).toBeCloseTo(2236.8, 0);
  });

  it("pH moins inconnu : fourchette 7 à 10 g/m³ par 0,1", () => {
    const d = dosePhMinus(50, 7.8, 7.3, 100, { form: "poudre", percent: null });
    expect(d?.exact).toBe(false);
    expect(d?.min).toBeCloseTo(1750, 0);
    expect(d?.max).toBeCloseTo(2500, 0);
  });

  it("pH moins liquide 37 % ≈ 1,84 L pour 0,5 unité sur 50 m³", () => {
    const d = dosePhMinus(50, 7.8, 7.3, 100, { form: "liquide", percent: 37 });
    expect(d?.unit).toBe("mL");
    expect(d?.min).toBeCloseTo(1837, -1);
  });

  it("le pouvoir tampon augmente la dose avec le TAC", () => {
    expect(bufferFactor(100)).toBe(1);
    expect(bufferFactor(150)).toBe(1.5);
    expect(bufferFactor(300)).toBe(2);
    const low = dosePhPlus(30, 7.0, 7.3, 80, { percent: 100 });
    const high = dosePhPlus(30, 7.0, 7.3, 140, { percent: 100 });
    expect(high!.min).toBeGreaterThan(low!.min);
  });
});

describe("renouvellement d'eau", () => {
  it("100 → 40 mg/L : remplacer 60 % de l'eau", () => {
    expect(renewalFraction(100, 40)).toBeCloseTo(0.6);
    expect(renewalFraction(30, 40)).toBe(0);
  });
});

describe("analyse complète", () => {
  it("respecte l'ordre TAC → pH → désinfection", () => {
    const res = analyzeWater({
      volume: 40,
      disinfection: "chlore",
      ph: 7.8,
      sanitizer: 0.3,
      tac: 60,
      cya: 30,
      th: null,
      products: unknownProducts,
    });
    const titles = res.actions.map((a) => a.title);
    expect(titles[0]).toMatch(/TAC/);
    expect(titles[1]).toMatch(/pH/);
    expect(titles[2]).toMatch(/chlore/i);
    expect(res.hasCritical).toBe(true);
    expect(res.alerts.length).toBeGreaterThan(0);
  });

  it("propose un renouvellement en premier si le stabilisant dépasse 75 mg/L", () => {
    const res = analyzeWater({
      volume: 50,
      disinfection: "chlore",
      ph: 7.3,
      sanitizer: 2,
      tac: 100,
      cya: 100,
      th: null,
      products: unknownProducts,
    });
    expect(res.actions[0].title).toMatch(/Renouveler/);
    expect(res.actions[0].detail).toContain("60 %");
  });

  it("n'ajoute pas de pH moins supplémentaire pendant la baisse du TAC", () => {
    const res = analyzeWater({
      volume: 50,
      disinfection: "chlore",
      ph: 7.9,
      sanitizer: 2,
      tac: 220,
      cya: 30,
      th: null,
      products: unknownProducts,
    });
    const ph = res.actions.find((a) => a.title === "Ajuster le pH");
    expect(ph?.dose).toBeUndefined();
  });

  it("aucune action si l'eau est parfaite", () => {
    const res = analyzeWater({
      volume: 50,
      disinfection: "chlore",
      ph: 7.3,
      sanitizer: 2,
      tac: 110,
      cya: 30,
      th: 200,
      products: unknownProducts,
    });
    expect(res.actions).toHaveLength(0);
    expect(res.hasCritical).toBe(false);
  });
});

describe("formatage des doses", () => {
  it("affiche une valeur exacte ou une fourchette", () => {
    expect(formatDose({ product: "x", min: 1234, max: 1234, unit: "g", exact: true })).toBe("1,23 kg");
    expect(formatDose({ product: "x", min: 380, max: 540, unit: "g", exact: false })).toBe("entre 380 g et 540 g");
    expect(formatDose({ product: "x", min: 493, max: 493, unit: "mL", exact: true })).toBe("490 mL");
  });
});

describe("interaction TAC / pH", () => {
  it("calcule la dose de pH sur le TAC corrigé quand le TAC est remonté d'abord", () => {
    const res = analyzeWater({
      volume: 50, disinfection: "chlore", ph: 7.8, sanitizer: 2, tac: 60, cya: 30, th: null, products: unknownProducts,
    });
    const ph = res.actions.find((a) => a.title === "Baisser le pH");
    // TAC corrigé = 100 → facteur 1 → 5 × 7 × 50 = 1 750 g (et non 1 050 g avec TAC 60)
    expect(ph?.dose?.min).toBeCloseTo(1750, 0);
  });
});
