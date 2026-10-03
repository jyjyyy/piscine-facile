import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/illustrations/Logo";
import { ManageCookiesButton } from "@/components/ManageCookiesButton";
import { NewsletterForm } from "@/components/NewsletterForm";

const columns = [
  {
    title: "Outils",
    links: [
      { href: "/analyse-eau", label: "Analyse de l'eau" },
      { href: "/depannage", label: "Assistant de dépannage" },
      { href: "/calculateurs", label: "Calculateurs" },
      { href: "/calendrier-entretien", label: "Calendrier d'entretien" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/blog", label: "Tous les guides" },
      { href: "/guide-electrique", label: "Guide électrique piscine" },
      { href: "/depannage/eau-verte", label: "Eau verte" },
      { href: "/trouver-un-professionnel", label: "Trouver un professionnel" },
      { href: "/electricien-piscine", label: "Électricien piscine" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cookies", label: "Politique cookies" },
      { href: "/transparence-affiliation", label: "Transparence affiliation" },
    ],
  },
];

/** Pied de page */
export function Footer() {
  return (
    <footer className="mt-20 bg-eau-950 text-eau-100">
      <div className="border-b border-eau-900">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-white">Ne ratez plus le bon moment</h2>
            <p className="mt-1 text-sm text-eau-200">Remise en route, canicule, hivernage : un rappel par e-mail au bon moment, 4 à 6 fois par an.</p>
          </div>
          <NewsletterForm dark />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            <LogoMark /> {siteConfig.name}
          </p>
          <p className="mt-3 text-sm text-eau-200">{siteConfig.tagline}.</p>
          <p className="mt-3 text-xs text-eau-300">
            Les informations de ce site sont données à titre indicatif. Respectez toujours les consignes des
            fabricants.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">{col.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              {col.title === "Informations" && (
                <li>
                  <ManageCookiesButton />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-eau-900 py-5 text-center text-xs text-eau-300">
        © {new Date().getFullYear()} {siteConfig.name} – Certains liens sont affiliés.{" "}
        <Link href="/transparence-affiliation" className="underline hover:text-white">
          En savoir plus
        </Link>
      </div>
    </footer>
  );
}
