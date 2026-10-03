import { Leaf, Snowflake, Sun, Moon, type LucideIcon } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductList } from "@/components/ProductRecommendation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata = buildMetadata({
  title: "Calendrier d'entretien de la piscine : remise en route, été, hivernage",
  description:
    "Que faire et quand ? Le calendrier complet de l'entretien d'une piscine : remise en route au printemps, entretien d'été, hivernage actif et hivernage passif.",
  path: "/calendrier-entretien",
});

interface Season {
  id: string;
  title: string;
  period: string;
  icon: LucideIcon;
  color: string;
  intro: string;
  groups: Array<{ title: string; tasks: string[] }>;
  products: string[];
}

const seasons: Season[] = [
  {
    id: "remise-en-route",
    title: "Remise en route",
    period: "Avril – mai, quand l'eau dépasse durablement 12 à 15 °C",
    icon: Leaf,
    color: "bg-emerald-50 text-emerald-800",
    intro: "Plus la remise en route est faite tôt, plus elle est simple : une eau encore froide verdit moins vite.",
    groups: [
      {
        title: "Jour 1",
        tasks: [
          "Retirez, nettoyez et faites sécher la bâche d'hivernage.",
          "Enlevez les flotteurs et gizzmos, remettez en place les bouchons, paniers et équipements.",
          "Complétez le niveau d'eau jusqu'au milieu des skimmers.",
          "Nettoyez la ligne d'eau, puis ramassez les débris à l'épuisette.",
          "Remettez la filtration en route et vérifiez l'absence de fuite dans le local technique.",
          "Faites un lavage du filtre dès que l'eau circule.",
        ],
      },
      {
        title: "Jours 2 à 4",
        tasks: [
          "Analysez l'eau et corrigez dans l'ordre : TAC, pH, puis désinfection.",
          "Faites un traitement choc le soir, filtration 24 h/24 pendant 48 h.",
          "Passez le robot ou l'aspirateur, brossez les parois.",
          "Remettez la désinfection d'entretien en place (galets, électrolyseur, brome).",
        ],
      },
    ],
    products: ["trousse-analyse", "chlore-choc", "nettoyant-ligne-eau"],
  },
  {
    id: "ete",
    title: "Entretien d'été",
    period: "Juin – septembre",
    icon: Sun,
    color: "bg-amber-50 text-amber-800",
    intro: "En été, la régularité est la clé : quelques minutes par jour évitent la plupart des problèmes.",
    groups: [
      {
        title: "Chaque jour",
        tasks: [
          "Retirez les feuilles et insectes à l'épuisette.",
          "Videz les paniers de skimmers si nécessaire.",
          "Vérifiez que la filtration fonctionne (durée : température de l'eau / 2).",
        ],
      },
      {
        title: "Deux fois par semaine",
        tasks: [
          "Mesurez le pH et le chlore (ou le brome).",
          "Corrigez si nécessaire avec l'outil d'analyse.",
          "Passez le robot ou l'aspirateur.",
        ],
      },
      {
        title: "Chaque semaine",
        tasks: [
          "Lavez le filtre si la pression a augmenté de 0,5 bar.",
          "Brossez les parois et la ligne d'eau.",
          "Rechargez les galets de chlore lent.",
          "Contrôlez le niveau d'eau.",
        ],
      },
      {
        title: "Chaque mois",
        tasks: [
          "Faites une analyse complète : TAC, stabilisant, TH (et sel si électrolyseur).",
          "Testez le différentiel 30 mA avec son bouton « T ».",
          "Nettoyez la cellule de l'électrolyseur si elle s'entartre.",
        ],
      },
    ],
    products: ["bandelettes", "chlore-lent", "robot"],
  },
  {
    id: "hivernage-actif",
    title: "Hivernage actif",
    period: "Octobre – mars, régions douces",
    icon: Moon,
    color: "bg-eau-50 text-eau-800",
    intro: "La filtration continue de fonctionner à régime réduit : l'eau reste propre et la remise en route est facile.",
    groups: [
      {
        title: "Mise en hivernage",
        tasks: [
          "Quand l'eau passe sous 15 °C, faites une analyse complète et équilibrez pH et TAC.",
          "Faites un traitement choc, puis ajoutez un produit d'hivernage adapté à l'hivernage actif.",
          "Réduisez la filtration : environ température de l'eau / 3 (minimum 3 h par jour).",
          "Installez une bâche (idéalement opaque) pour limiter lumière et feuilles.",
        ],
      },
      {
        title: "Pendant l'hiver",
        tasks: [
          "Contrôlez pH et désinfectant toutes les 2 à 3 semaines.",
          "En cas de gel, faites tourner la filtration en continu la nuit (ou utilisez un mode hors-gel).",
          "Nettoyez la bâche et retirez les feuilles.",
        ],
      },
    ],
    products: ["produit-hivernage", "bache-hivernage"],
  },
  {
    id: "hivernage-passif",
    title: "Hivernage passif",
    period: "Octobre – mars, régions froides",
    icon: Snowflake,
    color: "bg-slate-100 text-slate-800",
    intro: "La filtration est arrêtée tout l'hiver : il faut protéger les canalisations et les équipements du gel.",
    groups: [
      {
        title: "Mise en hivernage (eau sous 12 °C)",
        tasks: [
          "Nettoyez le bassin, faites une analyse complète et équilibrez pH et TAC.",
          "Faites un traitement choc, puis ajoutez le produit d'hivernage et filtrez 24 h pour bien le répartir.",
          "Lavez le filtre, puis baissez le niveau d'eau sous les buses de refoulement (ou sous les skimmers selon votre installation).",
          "Videz la pompe, le filtre et les canalisations exposées ; posez les bouchons d'hivernage et les gizzmos.",
          "Placez des flotteurs d'hivernage et installez la bâche.",
          "Pompe et équipements électriques : coupez l'alimentation au coffret par son interrupteur ou au tableau de la maison.",
        ],
      },
      {
        title: "Pendant l'hiver",
        tasks: [
          "Vérifiez régulièrement l'état et la tension de la bâche.",
          "Évacuez l'eau de pluie accumulée sur la bâche.",
          "Surveillez le niveau d'eau (il ne doit pas remonter jusqu'aux pièces à sceller).",
        ],
      },
    ],
    products: ["produit-hivernage", "flotteurs-hivernage", "bache-hivernage"],
  },
];

export default function CalendrierPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Remettre en route sa piscine au printemps",
          inLanguage: "fr-FR",
          step: seasons[0].groups
            .flatMap((g) => g.tasks)
            .map((t, i) => ({ "@type": "HowToStep", position: i + 1, text: t })),
          publisher: { "@type": "Organization", name: siteConfig.name },
        }}
      />
      <PageHeader title="Calendrier d'entretien de la piscine" intro="Les bons gestes, au bon moment, tout au long de l'année.">
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/calendrier-entretien", label: "Calendrier d'entretien" }]} />
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        <nav aria-label="Saisons" className="flex flex-wrap gap-2">
          {seasons.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${s.color}`}>
              <s.icon className="h-4 w-4" aria-hidden="true" />
              {s.title}
            </a>
          ))}
        </nav>

        {seasons.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titre`} className="scroll-mt-24 space-y-5 rounded-3xl border border-eau-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.color}`}>
                <s.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 id={`${s.id}-titre`} className="text-2xl font-bold text-eau-950">
                  {s.title}
                </h2>
                <p className="text-sm font-medium text-slate-600">{s.period}</p>
              </div>
            </div>
            <p className="text-slate-700">{s.intro}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {s.groups.map((g) => (
                <div key={g.title} className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">{g.title}</h3>
                  <ul className="mt-2 space-y-2">
                    {g.tasks.map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-turquoise-500" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <ProductList keys={s.products} />
          </section>
        ))}

        <section className="rounded-3xl bg-eau-50 p-6">
          <h2 className="text-xl font-bold text-eau-950">Recevez ces rappels au bon moment</h2>
          <p className="mt-1 mb-4 text-sm text-slate-700">Un e-mail au début de chaque étape, avec la marche à suivre. Gratuit, 4 à 6 par an.</p>
          <NewsletterForm />
        </section>
        <AffiliateDisclosure />
        <RelatedLinks
          links={[
            { href: "/blog/remise-en-route-piscine-printemps", label: "Remise en route au printemps : le guide complet" },
            { href: "/blog/hivernage-actif-ou-passif", label: "Hivernage actif ou passif : que choisir ?" },
            { href: "/calculateurs/filtration", label: "Calculer le temps de filtration" },
          ]}
        />
      </div>
    </>
  );
}
