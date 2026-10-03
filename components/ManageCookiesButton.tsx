"use client";

import { requestConsentPanel } from "@/lib/consent";

/** Lien du pied de page permettant de rouvrir le panneau de consentement */
export function ManageCookiesButton() {
  return (
    <button type="button" onClick={requestConsentPanel} className="text-left hover:text-white hover:underline">
      Gérer les cookies
    </button>
  );
}
