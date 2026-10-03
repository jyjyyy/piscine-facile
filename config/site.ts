/**
 * Configuration générale du site.
 * Modifiez ce fichier pour changer le nom, l'URL ou activer certaines fonctionnalités.
 */

export const siteConfig = {
  /** Nom du site, affiché partout (header, titres, e-mails…) */
  name: "PiscineFacile",

  /** Slogan court utilisé dans les métadonnées */
  tagline: "Entretien et dépannage de piscine, simplement",

  /** Description par défaut (SEO) */
  description:
    "Analyse de l'eau, assistant de dépannage, calculateurs et guides pratiques : trouvez la solution à votre problème de piscine en 2 minutes.",

  /** URL publique du site, sans slash final (définie via NEXT_PUBLIC_SITE_URL) */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),

  /** Langue et région */
  locale: "fr_FR",

  /** Adresse de contact affichée publiquement (à compléter) */
  contactEmail: "contact@votre-domaine.fr",

  /** Drapeaux de fonctionnalités */
  features: {
    /** Emplacements publicitaires : désactivés par défaut */
    ads: false,
    /** Page Premium visible dans le menu : désactivée par défaut */
    premium: false,
  },
} as const;

/** Liens de navigation principale */
export const mainNav = [
  { href: "/analyse-eau", label: "Analyse de l'eau" },
  { href: "/depannage", label: "Dépannage" },
  { href: "/calculateurs", label: "Calculateurs" },
  { href: "/calendrier-entretien", label: "Entretien" },
  { href: "/blog", label: "Guides" },
] as const;
