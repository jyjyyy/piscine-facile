import { CalendarCheck, Snowflake, Sun, Leaf } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata = buildMetadata({
  title: "Rappels d'entretien piscine par e-mail (gratuit)",
  description: "Recevez au bon moment les rappels d'entretien de votre piscine : remise en route, canicule, hivernage. Gratuit, 4 à 6 e-mails par an.",
  path: "/rappels-entretien",
});

const reminders = [
  { icon: Leaf, title: "Printemps", text: "Le bon moment pour la remise en route et la liste des étapes." },
  { icon: Sun, title: "Été", text: "Canicule, orages, vacances : les réflexes pour éviter l'eau verte." },
  { icon: CalendarCheck, title: "Fin d'été", text: "Analyse complète, nettoyage du filtre et préparation de l'arrière-saison." },
  { icon: Snowflake, title: "Hivernage", text: "Actif ou passif : la marche à suivre et la protection contre le gel." },
];

export default function RappelsPage() {
  return (
    <>
      <PageHeader title="Rappels d'entretien par e-mail" intro="Un e-mail au bon moment de l'année, avec exactement ce qu'il faut faire. Gratuit, sans spam.">
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/rappels-entretien", label: "Rappels d'entretien" }]} />
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        <div className="rounded-3xl border border-eau-100 bg-white p-6 shadow-sm">
          <NewsletterForm />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {reminders.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl bg-eau-50 p-5">
              <Icon className="h-6 w-6 text-turquoise-700" aria-hidden="true" />
              <h2 className="mt-2 font-semibold text-eau-950">{title}</h2>
              <p className="mt-1 text-sm text-slate-700">{text}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-600">
          Votre adresse sert uniquement à l&apos;envoi des rappels. Elle n&apos;est jamais vendue ni transmise. Chaque e-mail contient un lien de
          désinscription.
        </p>
      </div>
    </>
  );
}
