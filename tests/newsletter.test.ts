import { describe, expect, it } from "vitest";
import { createToken, TOKEN_MAX_AGE_MS, verifyToken } from "@/lib/newsletterToken";

describe("jeton de confirmation (double opt-in)", () => {
  const secret = "secret-de-test";
  it("valide un jeton correct", () => {
    const t = createToken("Jean@Example.fr", secret, 1_000);
    expect(verifyToken(t, secret, 2_000)).toBe("jean@example.fr");
  });
  it("refuse un jeton modifié, signé avec un autre secret ou expiré", () => {
    const t = createToken("jean@example.fr", secret, 1_000);
    const forged = createToken("pirate@example.fr", secret, 1_000).split(".")[0] + "." + t.split(".")[1];
    expect(verifyToken(forged, secret, 2_000)).toBeNull();
    expect(verifyToken(t, "autre-secret", 2_000)).toBeNull();
    expect(verifyToken(t, secret, 1_000 + TOKEN_MAX_AGE_MS + 1)).toBeNull();
    expect(verifyToken("n-importe-quoi", secret)).toBeNull();
  });
});
