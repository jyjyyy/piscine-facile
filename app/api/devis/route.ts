import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { needLabel, validateQuote, type QuoteData } from "@/lib/quote";
import { isInServiceArea } from "@/config/serviceArea";

/**
 * Route API : réception d'une demande de devis et envoi par e-mail (Resend).
 * Variables d'environnement requises : RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL.
 */

/** Échappe le HTML pour insérer les saisies utilisateur dans l'e-mail sans risque */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  // Anti-spam : champ piège invisible pour les humains
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateQuote(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const data = {
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    postalCode: String(body.postalCode).trim(),
    need: String(body.need) as QuoteData["need"],
    description: String(body.description).trim(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[devis] Variables d'environnement manquantes : RESEND_API_KEY, QUOTE_TO_EMAIL ou QUOTE_FROM_EMAIL.");
    return NextResponse.json(
      { ok: false, message: "Le service d'envoi n'est pas encore configuré. Merci de réessayer plus tard." },
      { status: 503 },
    );
  }

  // Demande d'électricité dans votre zone d'intervention : signalée et, si configuré, envoyée à votre adresse dédiée
  const inMyZone = data.need === "electricite" && isInServiceArea(data.postalCode);
  const recipient = inMyZone && process.env.QUOTE_ZONE_EMAIL ? process.env.QUOTE_ZONE_EMAIL : to;
  const subject = `${inMyZone ? "[Ma zone] " : ""}[Devis] ${data.postalCode} – ${needLabel(data.need)}`;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date());

  const rows: Array<[string, string]> = [
    ["Type de besoin", needLabel(data.need)],
    ["Code postal", data.postalCode],
    ["Nom", data.name],
    ["E-mail", data.email],
    ["Téléphone", data.phone],
    ["Date de la demande", date],
    ["Consentement RGPD", "Oui"],
    ["Dans ma zone d'intervention", inMyZone ? "Oui" : "Non"],
  ];

  const text = [
    `Nouvelle demande de devis – ${siteConfig.name}`,
    "",
    ...rows.map(([k, v]) => `${k} : ${v}`),
    "",
    "Description :",
    data.description,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;max-width:600px">
      <h2 style="color:#1e50af">Nouvelle demande de devis</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;background:#eff8ff;font-weight:bold">${escapeHtml(k)}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="color:#1e50af">Description</h3>
      <p style="white-space:pre-wrap">${escapeHtml(data.description)}</p>
      <p style="font-size:12px;color:#64748b">Envoyé depuis le formulaire « Trouver un professionnel » de ${escapeHtml(siteConfig.name)}.</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to: recipient, replyTo: data.email, subject, text, html });
    if (error) {
      console.error("[devis] Erreur Resend :", error);
      return NextResponse.json({ ok: false, message: "L'envoi a échoué. Merci de réessayer." }, { status: 502 });
    }
  } catch (err) {
    console.error("[devis] Erreur inattendue :", err);
    return NextResponse.json({ ok: false, message: "L'envoi a échoué. Merci de réessayer." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
