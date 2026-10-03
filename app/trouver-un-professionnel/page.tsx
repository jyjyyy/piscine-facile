import { Suspense } from "react";
import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm, QuoteFormFromUrl } from "@/components/QuoteForm";

export const metadata = buildMetadata({
  title: "Trouver un professionnel de la piscine près de chez vous",
  description:
    "Pisciniste, électricien, recherche de fuite : décrivez votre besoin et recevez gratuitement une proposition d'un professionnel près de chez vous.",
  path: "/trouver-un-professionnel",
});

const benefits = [
  { icon: Clock, title: "Rapide", text: "Formulaire rempli en 2 minutes." },
  { icon: BadgeCheck, title: "Gratuit", text: "Sans engagement de votre part." },
  { icon: ShieldCheck, title: "Données protégées", text: "Utilisées uniquement pour votre demande." },
];

export default function TrouverUnProPage() {
  return (
    <>
      <PageHeader
        title="Trouver un professionnel"
        intro="Entretien, panne, électricité, fuite, rénovation : décrivez votre besoin, nous le transmettons à un professionnel près de chez vous."
      />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 rounded-2xl bg-eau-50 p-4">
              <Icon className="h-6 w-6 shrink-0 text-turquoise-700" aria-hidden="true" />
              <div>
                <p className="font-semibold text-eau-950">{title}</p>
                <p className="text-sm text-slate-700">{text}</p>
              </div>
            </div>
          ))}
          <p className="text-sm text-slate-600">
            Pour tout problème électrique (disjoncteur qui saute, coffret, éclairage), choisissez « Électricité » : votre
            demande sera orientée vers un électricien qualifié.
          </p>
        </aside>
        <div className="rounded-3xl border border-eau-100 bg-white p-5 shadow-sm sm:p-8">
          <Suspense fallback={<QuoteForm />}>
            <QuoteFormFromUrl />
          </Suspense>
        </div>
      </div>
    </>
  );
}
