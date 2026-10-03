import { describe, expect, it } from "vitest";
import {
  averageDepth,
  electricityConsumption,
  filtrationTime,
  poolVolume,
  pumpSizing,
  requiredFlow,
  sandFilterDiameter,
} from "@/lib/poolCalc";

describe("volume", () => {
  it("profondeur moyenne", () => {
    expect(averageDepth(1.2, 1.8)).toBe(1.5);
  });
  it("rectangulaire 8 × 4, profondeur 1,2 → 1,8 m = 48 m³", () => {
    expect(poolVolume({ shape: "rectangulaire", length: 8, width: 4, minDepth: 1.2, maxDepth: 1.8 })).toBeCloseTo(48);
  });
  it("ronde Ø 4,6 m, 1,2 m = π × 2,3² × 1,2 ≈ 19,94 m³", () => {
    expect(poolVolume({ shape: "ronde", diameter: 4.6, minDepth: 1.2, maxDepth: 1.2 })).toBeCloseTo(19.943, 2);
  });
  it("ovale 6 × 3,2, 1,2 m = 6 × 3,2 × 1,2 × 0,89 ≈ 20,51 m³", () => {
    expect(poolVolume({ shape: "ovale", length: 6, width: 3.2, minDepth: 1.2, maxDepth: 1.2 })).toBeCloseTo(20.5056, 3);
  });
  it("forme libre 30 m², 1,2 → 1,6 m = 42 m³", () => {
    expect(poolVolume({ shape: "libre", surface: 30, minDepth: 1.2, maxDepth: 1.6 })).toBeCloseTo(42);
  });
  it("renvoie null si une dimension manque ou si min > max", () => {
    expect(poolVolume({ shape: "rectangulaire", length: 8, minDepth: 1, maxDepth: 1.5 })).toBeNull();
    expect(poolVolume({ shape: "ronde", diameter: 4, minDepth: 1.8, maxDepth: 1.2 })).toBeNull();
  });
});

describe("temps de filtration", () => {
  it("règle température / 2", () => {
    expect(filtrationTime({ temperature: 24 }).hours).toBe(12);
    expect(filtrationTime({ temperature: 13 }).hours).toBe(6.5);
    expect(filtrationTime({ temperature: 12 }).hours).toBe(6);
  });
  it("hivernage actif : température / 3, minimum 3 h", () => {
    expect(filtrationTime({ temperature: 9 }).hours).toBe(3);
    expect(filtrationTime({ temperature: 6 }).hours).toBe(3);
    expect(filtrationTime({ temperature: 11 }).mode).toBe("hivernage-actif");
  });
  it("forte chaleur : 24 h au-delà de 30 °C", () => {
    expect(filtrationTime({ temperature: 29 }).hours).toBe(14.5);
    expect(filtrationTime({ temperature: 31 }).hours).toBe(24);
  });
  it("forte fréquentation : +2 h", () => {
    expect(filtrationTime({ temperature: 26, heavyUse: true }).hours).toBe(15);
  });
  it("nombre de cycles : 11 m³/h × 12 h / 48 m³ = 2,75", () => {
    expect(filtrationTime({ temperature: 24, volume: 48, flow: 11 }).turnovers).toBeCloseTo(2.75);
  });
});

describe("pompe", () => {
  it("débit = volume / durée", () => {
    expect(requiredFlow(48, 6)).toBe(8);
    expect(requiredFlow(48, 4)).toBe(12);
  });
  it("48 m³ → pompe 0,75 CV (≈ 11 m³/h), filtre Ø 560 mm", () => {
    const r = pumpSizing(48);
    expect(r?.pump?.cv).toBe(0.75);
    expect(r?.sandFilterDiameterMm).toBe(560);
  });
  it("diamètre de filtre : 14 m³/h → Ø 600 mm", () => {
    expect(sandFilterDiameter(14)).toBe(600);
  });
  it("volume hors tableau → aucune pompe indicative", () => {
    expect(pumpSizing(200)?.pump).toBeNull();
  });
});

describe("consommation électrique", () => {
  it("750 W × 8 h × 150 j à 0,20 € = 900 kWh et 180 €", () => {
    const r = electricityConsumption(750, 8, 150, 0.2);
    expect(r?.kwhPerDay).toBe(6);
    expect(r?.kwhSeason).toBe(900);
    expect(r?.costSeason).toBeCloseTo(180);
  });
  it("refuse les valeurs invalides", () => {
    expect(electricityConsumption(0, 8, 150, 0.2)).toBeNull();
    expect(electricityConsumption(750, 25, 150, 0.2)).toBeNull();
  });
});
