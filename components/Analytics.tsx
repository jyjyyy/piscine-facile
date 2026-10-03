import Script from "next/script";

/**
 * Mesure d'audience SANS cookie (Plausible ou Umami), désactivée par défaut.
 * Activez-la en renseignant les variables d'environnement :
 *  - Plausible : NEXT_PUBLIC_PLAUSIBLE_DOMAIN (ex : piscinefacile.fr) [+ NEXT_PUBLIC_PLAUSIBLE_SRC si auto-hébergé]
 *  - Umami : NEXT_PUBLIC_UMAMI_WEBSITE_ID et NEXT_PUBLIC_UMAMI_SRC
 * Ces outils ne déposent pas de cookie et n'utilisent pas de données personnelles :
 * configurés de cette façon, ils peuvent bénéficier de l'exemption de consentement de la CNIL
 * pour la mesure d'audience (vérifiez les conditions sur cnil.fr).
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;

  return (
    <>
      {plausibleDomain && <Script defer data-domain={plausibleDomain} src={plausibleSrc} strategy="afterInteractive" />}
      {umamiId && umamiSrc && <Script defer data-website-id={umamiId} src={umamiSrc} strategy="afterInteractive" />}
    </>
  );
}
