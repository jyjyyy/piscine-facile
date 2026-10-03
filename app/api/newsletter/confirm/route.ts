import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { verifyToken } from "@/lib/newsletterToken";

/**
 * Inscription aux rappels – étape 2 : clic sur le lien de confirmation.
 * Le contact est ajouté dans Resend (segment RESEND_SEGMENT_ID si défini), puis l'utilisateur
 * est redirigé vers la page de confirmation.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const done = (statut: "ok" | "erreur" | "expire") =>
    NextResponse.redirect(new URL(`/rappels-entretien/confirmation?statut=${statut}`, siteConfig.url), 303);

  const secret = process.env.NEWSLETTER_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  if (!secret || !apiKey) return done("erreur");

  const email = verifyToken(token, secret);
  if (!email) return done("expire");

  try {
    const resend = new Resend(apiKey);
    const segmentId = process.env.RESEND_SEGMENT_ID;
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    // Un contact déjà inscrit n'est pas une erreur pour l'utilisateur
    if (error && !/already exists/i.test(error.message)) {
      console.error("[rappels] Erreur Resend :", error);
      return done("erreur");
    }
  } catch (err) {
    console.error("[rappels] Erreur inattendue :", err);
    return done("erreur");
  }
  return done("ok");
}
