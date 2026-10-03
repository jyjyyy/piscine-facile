import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export const metadata: Metadata = {
  title: "Confirmation d'inscription",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ statut?: string }> };

/** Page d'arrivée après le clic sur le lien de confirmation */
export default async function ConfirmationPage({ searchParams }: Props) {
  const { statut } = await searchParams;
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-16">
      {statut === "ok" ? (
        <Alert tone="success" title="Inscription confirmée !">
          Vous recevrez nos rappels d&apos;entretien au fil des saisons. À très bientôt dans votre boîte mail.
        </Alert>
      ) : statut === "expire" ? (
        <Alert tone="warning" title="Lien invalide ou expiré">
          Le lien de confirmation est valable 48 heures. Inscrivez-vous à nouveau pour en recevoir un nouveau.
        </Alert>
      ) : (
        <Alert tone="danger" title="L'inscription n'a pas pu être finalisée">
          Merci de réessayer un peu plus tard.
        </Alert>
      )}
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        {statut !== "ok" && (
          <ButtonLink href="/rappels-entretien" variant="outline">
            Recommencer l&apos;inscription
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
