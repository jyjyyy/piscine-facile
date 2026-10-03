import { describe, expect, it } from "vitest";
import { heatPumpSizing, temperatureFactor } from "@/lib/heatPumpCalc";
import { cyanurateAlkalinity, estimateTds, langelier } from "@/lib/langelier";
import { chlorine, hardness, saltDose, shockDose, shockTarget } from "@/lib/treatmentCalc";

describe("pompe à chaleur", () => {
  it("référence : 50 m³, centre-ouest, mai–sept, bâche, 27 °C = 10 kW → modèle 11 kW", () => {
    const r = heatPumpSizing({ volume: 50, region: "centre-ouest", season: "mai-sept", cover: "bache", targetTemp: 27, startTemp: 15 });
    expect(r?.power).toBeCloseTo(10, 5);
    expect(r?.commercialSize).toBe(11);
    // 1,163 × 50 × 12 = 697,8 kWh ; 697,8 / (11 × 0,8) ≈ 79,3 h
    expect(r?.heatUpHours).toBeCloseTo(79.3, 1);
    // 11 kW / COP 5 = 2,2 kW ≈ 9,6 A en 230 V
    expect(r?.electricalKw).toBeCloseTo(2.2);
    expect(r?.currentA).toBeCloseTo(9.57, 1);
  });
  it("cas défavorable : nord-est, sans couverture, 28 °C = 18,48 kW → 20 kW", () => {
    const r = heatPumpSizing({ volume: 50, region: "nord-est", season: "mai-sept", cover: "aucune", targetTemp: 28 });
    expect(r?.power).toBeCloseTo(18.48, 2);
    expect(r?.commercialSize).toBe(20);
  });
  it("facteur température ±10 %/°C, borné entre 24 et 32 °C", () => {
    expect(temperatureFactor(30)).toBeCloseTo(1.3);
    expect(temperatureFactor(24)).toBeCloseTo(0.7);
    expect(temperatureFactor(40)).toBeCloseTo(1.5);
  });
});

describe("indice de Langelier", () => {
  it("pH 7,4 · 27 °C · Ca 250 · TAC 100 · TDS 1000 → ISL ≈ −0,15 (équilibrée)", () => {
    const r = langelier({ ph: 7.4, temperature: 27, calcium: 250, tac: 100, tds: 1000 });
    expect(r?.lsi).toBeCloseTo(-0.149, 2);
    expect(r?.phs).toBeCloseTo(7.549, 2);
    expect(r?.status).toBe("equilibree");
  });
  it("eau douce et froide → agressive ; eau dure, chaude, pH haut → entartrante", () => {
    expect(langelier({ ph: 7.2, temperature: 15, calcium: 60, tac: 50, tds: 500 })?.status).toBe("agressive");
    expect(langelier({ ph: 7.9, temperature: 30, calcium: 400, tac: 200, tds: 1500 })?.status).toBe("entartrante");
  });
  it("part du stabilisant dans le TAC : 30 mg/L à pH 7,5 ≈ 9,4 mg/L", () => {
    expect(cyanurateAlkalinity(30, 7.5)).toBeCloseTo(9.38, 1);
  });
  it("TDS estimé", () => {
    expect(estimateTds(null)).toBe(1000);
    expect(estimateTds(4)).toBe(4500);
  });
});

describe("sel", () => {
  it("50 m³ de 3 à 4 g/L = 50 kg = 2 sacs ; remplissage complet à 4 g/L = 200 kg", () => {
    expect(saltDose(50, 3, 4)).toEqual({ kg: 50, bags: 2 });
    expect(saltDose(50, 0, 4)).toEqual({ kg: 200, bags: 8 });
    expect(saltDose(50, 5, 4)?.kg).toBe(0);
  });
});

describe("traitement choc", () => {
  it("cible relevée selon le stabilisant", () => {
    expect(shockTarget("verte-claire", 30)).toBe(15);
    expect(shockTarget("verte-claire", 50)).toBe(20);
    expect(shockTarget("preventif", null)).toBe(5);
  });
  it("dichlore 56 % : 50 m³, 0 → 15 mg/L = 750 g / 0,56 ≈ 1 339 g, +13,5 mg/L de stabilisant", () => {
    const r = shockDose({ volume: 50, currentFc: 0, situation: "verte-claire", product: "dichlore", concentration: null, cya: 30 });
    expect(r?.dose?.min).toBeCloseTo(1339.3, 0);
    expect(r?.addedCya).toBeCloseTo(13.5);
  });
  it("hypochlorite inconnu : fourchette 65–70 %", () => {
    const r = shockDose({ volume: 40, currentFc: 0, situation: "trouble", product: "hypochlorite", concentration: null, cya: null });
    expect(r?.dose?.exact).toBe(false);
    expect(r?.dose?.min).toBeCloseTo(400 / 0.7, 0);
    expect(r?.dose?.max).toBeCloseTo(400 / 0.65, 0);
    expect(r?.addedTh).toBeCloseTo(7);
  });
});

describe("conversions", () => {
  it("dureté", () => {
    expect(hardness.frenchToMg(12)).toBe(120);
    expect(hardness.mgToGerman(178.48)).toBeCloseTo(10);
  });
  it("eau de Javel 36 °chl ≈ 114 g/L ≈ 9,6 % de chlore actif", () => {
    const g = chlorine.degreesToGPerL(36);
    expect(g).toBeCloseTo(114.12, 1);
    expect(chlorine.gPerLToPercent(g)).toBeCloseTo(9.6, 1);
  });
});
