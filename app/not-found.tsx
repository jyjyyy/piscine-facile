import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PoolIllustration } from "@/components/illustrations/PoolIllustration";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
      <PoolIllustration className="w-64" />
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-turquoise-700">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-bold text-eau-950">Cette page a pris le large</h1>
      <p className="mt-3 text-slate-700">
        La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de panique, voici de quoi retrouver votre chemin.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/depannage" variant="outline">
          Assistant de dépannage
        </ButtonLink>
      </div>
      <p className="mt-6 text-sm text-slate-600">
        Ou consultez nos <Link href="/blog" className="font-medium text-eau-700 underline">guides</Link>.
      </p>
    </div>
  );
}
