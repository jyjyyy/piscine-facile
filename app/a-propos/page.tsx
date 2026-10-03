import { BadgeCheck, BookOpen, Calculator, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToComplete } from "@/components/ToComplete";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: `À propos de ${siteConfig.name} : qui sommes-nous ?`,
  description: `Qui est derrière ${siteConfig.name}, comment nos outils et nos guides sont conçus et vérifiés, et comment le site se finance.`,
  path: "/a-propos",
});

/*
 * Cette page est importante pour le référencement : Google valorise les sites qui montrent
 * QUI écrit les contenus et POURQUOI on peut leur faire confiance (critères E-E-A-T).
 * Complétez les encadrés jaunes et adaptez le texte à votre parcours.
 */

const method = [
  { icon: Calculator, title: "Des calculs vérifiés", text: "Chaque formule (doses, volumes, filtration, pompe à chaleur, indice de Langelier) repose sur la chimie de l'eau ou sur les valeurs des fabricants, et est couverte par des tests automatiques avec des valeurs vérifiées à la main." },
  { icon: ShieldCheck, title: "La sécurité d'abord", text: "Nos contenus électriques suivent la norme NF C 15-100 (partie 7-702). Dès qu'une intervention dépasse ce qu'un particulier peut faire sans risque, nous le disons et renvoyons vers un professionnel qualifié." },
  { icon: BookOpen, title: "Des guides concrets", text: "Nos articles répondent aux questions réelles des propriétaires de piscine, avec des étapes précises, des quantités chiffrées et les erreurs à éviter." },
  { icon: BadgeCheck, title: "Indépendance", text: "Nos conseils sont établis avant le choix des produits. Les liens affiliés sont signalés et n'influencent pas nos recommandations." },
];

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `À propos de ${siteConfig.name}`,
          url: `${siteConfig.url}/a-propos`,
          inLanguage: "fr-FR",
          about: { "@id": `${siteConfig.url}/#organisation` },
        }}
      />
      <PageHeader title={`À propos de ${siteConfig.name}`} intro="Un site fait par des gens du métier, pour que l'entretien d'une piscine reste simple.">
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/a-propos", label: "À propos" }]} />
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-10">
        <section className="prose-piscine">
          <h2>Qui sommes-nous ?</h2>
          <p>
            {siteConfig.name} est édité par <ToComplete>Prénom NOM</ToComplete>, électricien de formation (Bac Pro MELEC), avec plusieurs années
            d&apos;expérience dans le secteur de la piscine. <ToComplete>adaptez ce paragraphe à votre parcours</ToComplete>
          </p>
          <p>
            Au quotidien, nous voyons les mêmes questions revenir : une eau qui verdit du jour au lendemain, un pH qui ne se stabilise pas, un
            disjoncteur qui saute au démarrage de la pompe. Les réponses existent, mais elles sont souvent dispersées, contradictoires ou trop
            techniques. {siteConfig.name} rassemble au même endroit des outils de calcul fiables et des explications claires, utilisables
            directement au bord du bassin, depuis un téléphone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-eau-950">Notre méthode</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {method.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-eau-100 bg-white p-5">
                <Icon className="h-6 w-6 text-turquoise-600" aria-hidden="true" />
                <h3 className="mt-2 font-semibold text-eau-950">{title}</h3>
                <p className="mt-1 text-sm text-slate-700">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="prose-piscine">
          <h2>Comment le site se finance</h2>
          <p>
            Le site est gratuit. Il se finance par des liens affiliés vers des produits et par la mise en relation avec des professionnels. Tous
            les détails sont sur la page <a href="/transparence-affiliation">Transparence affiliation</a>.
          </p>
          <h2>Nous contacter</h2>
          <p>
            Une erreur, une question, une suggestion d&apos;outil ? Écrivez-nous à <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
          </p>
        </section>
      </div>
    </>
  );
}
