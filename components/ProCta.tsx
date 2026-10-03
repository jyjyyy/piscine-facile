import { HardHat } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

/** Appel à l'action "Faire appel à un professionnel" */
export function ProCta({
  title = "Besoin d'un professionnel ?",
  text = "Décrivez votre problème : nous transmettons votre demande à un professionnel près de chez vous. C'est gratuit et sans engagement.",
  need,
}: {
  title?: string;
  text?: string;
  /** Type de besoin pré-sélectionné dans le formulaire */
  need?: string;
}) {
  const href = need ? `/trouver-un-professionnel?besoin=${encodeURIComponent(need)}` : "/trouver-un-professionnel";
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-eau-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <HardHat className="mt-1 h-6 w-6 shrink-0 text-turquoise-300" aria-hidden="true" />
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-1 text-sm text-eau-100">{text}</p>
        </div>
      </div>
      <ButtonLink href={href} variant="secondary" className="shrink-0">
        Faire appel à un professionnel
      </ButtonLink>
    </div>
  );
}
