import { describe, expect, it } from "vitest";
import { validateQuote } from "@/lib/quote";

const valid = {
  name: "Jean Dupont",
  email: "jean@example.fr",
  phone: "06 12 34 56 78",
  postalCode: "33000",
  need: "entretien",
  description: "Ma piscine est verte depuis une semaine malgré plusieurs traitements.",
  consent: true,
};

describe("validation du formulaire de devis", () => {
  it("accepte une demande complète", () => {
    expect(validateQuote(valid)).toEqual({});
  });
  it("accepte le format international et le code postal corse / DOM", () => {
    expect(validateQuote({ ...valid, phone: "+33 6 12 34 56 78", postalCode: "20000" })).toEqual({});
    expect(validateQuote({ ...valid, postalCode: "97400" })).toEqual({});
  });
  it("exige le consentement RGPD", () => {
    expect(validateQuote({ ...valid, consent: false }).consent).toBeDefined();
  });
  it("refuse les champs invalides", () => {
    const e = validateQuote({ ...valid, email: "jean@", phone: "123", postalCode: "00123", need: "inconnu", description: "court" });
    expect(Object.keys(e).sort()).toEqual(["description", "email", "need", "phone", "postalCode"]);
  });
});

import { departmentFromPostalCode, departmentSlug } from "@/config/serviceArea";

describe("zone d'intervention", () => {
  it("déduit le département du code postal", () => {
    expect(departmentFromPostalCode("33000")).toBe("33");
    expect(departmentFromPostalCode("01000")).toBe("01");
    expect(departmentFromPostalCode("20000")).toBe("2A");
    expect(departmentFromPostalCode("20200")).toBe("2B");
    expect(departmentFromPostalCode("97400")).toBe("974");
    expect(departmentFromPostalCode("abc")).toBeNull();
  });
  it("génère un slug d'URL propre", () => {
    expect(departmentSlug({ code: "13", name: "Bouches-du-Rhône", climate: "doux", cities: [], localNote: "" })).toBe("13-bouches-du-rhone");
  });
});
