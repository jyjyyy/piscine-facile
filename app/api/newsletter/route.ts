import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { createToken } from "@/lib/newsletterToken";

/**
 * Inscription aux rappels d'entretien – étape 1 : envoi de l'e-mail de confirmation (double opt-in).
 * Variables : RESEND_API_KEY, QUOTE_FROM_EMAIL (ou NEWSLETTER_FROM_EMAIL), NEWSLETTER_SECRET.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, message: "Adresse e-mail invalide." }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, message: "Votre accord est nécessaire pour recevoir les rappels." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM_EMAIL || process.env.QUOTE_FROM_EMAIL;
  const secret = process.env.NEWSLETTER_SECRET;
  if (!apiKey || !from || !secret) {
    console.error("[rappels] Variables manquantes : RESEND_API_KEY, NEWSLETTER_SECRET ou adresse d'expédition.");
    return NextResponse.json({ ok: false, message: "Les rappels ne sont pas encore disponibles. Merci de réessayer plus tard." }, { status: 503 });
  }

  const link = `${siteConfig.url}/api/newsletter/confirm?token=${encodeURIComponent(createToken(email, secret))}`;
  const text = `Bonjour,

Pour confirmer votre inscription aux rappels d'entretien de ${siteConfig.name}, cliquez sur ce lien (valable 48 heures) :
${link}

Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail : vous ne serez pas inscrit.

L'équipe ${siteConfig.name}`;
  const html = `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:560px">
  <h2 style="color:#1e50af">Confirmez votre inscription</h2>
  <p>Vous avez demandé à recevoir les rappels d'entretien de ${siteConfig.name} : remise en route, été, hivernage.</p>
  <p><a href="${link}" style="display:inline-block;background:#1d62d8;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:bold">Confirmer mon inscription</a></p>
  <p style="font-size:13px;color:#64748b">Ce lien est valable 48 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : vous ne serez pas inscrit.</p>
</div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to: email, subject: `Confirmez votre inscription aux rappels ${siteConfig.name}`, text, html });
    if (error) {
      console.error("[rappels] Erreur Resend :", error);
      return NextResponse.json({ ok: false, message: "L'envoi a échoué. Merci de réessayer." }, { status: 502 });
    }
  } catch (err) {
    console.error("[rappels] Erreur inattendue :", err);
    return NextResponse.json({ ok: false, message: "L'envoi a échoué. Merci de réessayer." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
