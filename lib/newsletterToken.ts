/**
 * Jetons de confirmation d'inscription aux rappels (double opt-in).
 * Le jeton contient l'e-mail et la date, signés par HMAC-SHA256 avec NEWSLETTER_SECRET :
 * aucune base de données n'est nécessaire, et le lien ne peut pas être falsifié.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Durée de validité du lien de confirmation : 48 h */
export const TOKEN_MAX_AGE_MS = 48 * 60 * 60 * 1000;

const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createToken(email: string, secret: string, now = Date.now()): string {
  const payload = b64url(JSON.stringify({ e: email.toLowerCase(), t: now }));
  return `${payload}.${sign(payload, secret)}`;
}

/** Renvoie l'e-mail si le jeton est valide et non expiré, sinon null */
export function verifyToken(token: string, secret: string, now = Date.now()): string | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { e, t } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e: string; t: number };
    if (typeof e !== "string" || typeof t !== "number" || now - t > TOKEN_MAX_AGE_MS || t > now + 60_000) return null;
    return e;
  } catch {
    return null;
  }
}
