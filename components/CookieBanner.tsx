"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import {
  getConsentSnapshot,
  saveConsent,
  subscribeConsent,
  subscribeOpenPanel,
} from "@/lib/consent";

/**
 * Bannière cookies conforme CNIL :
 * - "Tout refuser" aussi visible et accessible que "Tout accepter"
 * - Choix par finalité via "Personnaliser"
 * - Aucun traceur non essentiel avant consentement (voir lib/consent.ts)
 */
export function CookieBanner() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => undefined);
  const [forceOpen, setForceOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  // Réouverture depuis le lien "Gérer les cookies" du pied de page
  useEffect(
    () =>
      subscribeOpenPanel(() => {
        const current = getConsentSnapshot();
        setAnalytics(current?.analytics ?? false);
        setAds(current?.ads ?? false);
        setCustom(true);
        setForceOpen(true);
      }),
    [],
  );

  // undefined = rendu serveur : on n'affiche rien pour éviter un décalage d'hydratation
  if (consent === undefined) return null;
  if (consent !== null && !forceOpen) return null;

  const decide = (choice: { analytics: boolean; ads: boolean }) => {
    saveConsent(choice);
    setForceOpen(false);
    setCustom(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-eau-100 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-turquoise-600" aria-hidden="true" />
          <div className="flex-1">
            <h2 id="cookie-title" className="font-semibold text-eau-950">
              Vos choix concernant les cookies
            </h2>
            <p className="mt-1 text-sm text-slate-700">
              Nous utilisons uniquement des cookies nécessaires au fonctionnement du site. Avec votre
              accord, nous pourrions utiliser des cookies de mesure d&apos;audience et de publicité.
              Vous pouvez changer d&apos;avis à tout moment.{" "}
              <Link href="/cookies" className="font-medium text-eau-700 underline">
                En savoir plus
              </Link>
            </p>

            {custom && (
              <fieldset className="mt-4 space-y-3 rounded-xl bg-eau-50 p-4 text-sm">
                <legend className="sr-only">Choix par finalité</legend>
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked disabled className="mt-1 h-4 w-4" />
                  <span>
                    <strong>Nécessaires</strong> – toujours actifs (mémorisation de vos choix).
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-eau-700"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span>
                    <strong>Mesure d&apos;audience</strong> – statistiques de visite anonymisées.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-eau-700"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                  />
                  <span>
                    <strong>Publicité</strong> – annonces adaptées à vos centres d&apos;intérêt.
                  </span>
                </label>
              </fieldset>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => decide({ analytics: false, ads: false })}
                className="rounded-xl border-2 border-eau-700 px-4 py-2.5 text-sm font-semibold text-eau-800 hover:bg-eau-50"
              >
                Tout refuser
              </button>
              {custom ? (
                <button
                  type="button"
                  onClick={() => decide({ analytics, ads })}
                  className="rounded-xl border-2 border-eau-700 px-4 py-2.5 text-sm font-semibold text-eau-800 hover:bg-eau-50"
                >
                  Enregistrer mes choix
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustom(true)}
                  className="rounded-xl border-2 border-eau-700 px-4 py-2.5 text-sm font-semibold text-eau-800 hover:bg-eau-50"
                >
                  Personnaliser
                </button>
              )}
              <button
                type="button"
                onClick={() => decide({ analytics: true, ads: true })}
                className="rounded-xl border-2 border-eau-700 bg-eau-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-eau-800"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
