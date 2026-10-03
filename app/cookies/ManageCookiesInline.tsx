"use client";

import { requestConsentPanel } from "@/lib/consent";

export function ManageCookiesInline() {
  return (
    <button
      type="button"
      onClick={requestConsentPanel}
      className="not-prose rounded-xl bg-eau-700 px-5 py-3 text-sm font-semibold text-white hover:bg-eau-800"
    >
      Modifier mes choix
    </button>
  );
}
