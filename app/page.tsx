import Link from "next/link";
import { ArrowRight, CalendarDays, Calculator, FlaskConical, Wrench } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { problems } from "@/lib/troubleshooting";
import { formatDateFr, getAllArticles } from "@/lib/blog";
import { ButtonLink } from "@/components/ui/Button";
import { PoolIllustration } from "@/components/illustrations/PoolIllustration";
import { Waves } from "@/components/illustrations/Waves";
import { ProblemIcon } from "@/components/tools/ProblemIcon";
import { QuoteForm } from "@/components/QuoteForm";
import { calculators } from "@/lib/calculators";
import { CalculatorIcon } from "@/components/CalculatorIcon";

export const metadata = buildMetadata({
  title: `${siteConfig.name} – Votre piscine a un problème ? La solution en 2 minutes`,
  description: siteConfig.description,
  path: "/",
});

const tools = [
  { href: "/analyse-eau", title: "Analyse de l'eau", text: "Vos mesures, les corrections dans l'ordre et les doses exactes.", icon: FlaskConical },
  { href: "/depannage", title: "Assistant de dépannage", text: "Eau verte, pompe en panne, fuite : trouvez la cause.", icon: Wrench },
  { href: "/calculateurs", title: "Calculateurs", text: "Volume, filtration, pompe et consommation électrique.", icon: Calculator },
  { href: "/calendrier-entretien", title: "Calendrier d'entretien", text: "Remise en route, été, hivernage : les bons gestes.", icon: CalendarDays },
];

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);
  const frequent = problems.slice(0, 6);

  return (
    <>
      {/* Bandeau d'accroche */}
      <section className="relative overflow-hidden bg-gradient-to-br from-eau-800 via-eau-700 to-turquoise-600 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-12 lg:grid-cols-2 lg:pt-16">
          <div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Votre piscine a un problème ? Trouvez la solution en 2 minutes
            </h1>
            <p className="mt-4 max-w-xl text-lg text-eau-50">
              Analyse de l&apos;eau, assistant de dépannage et calculateurs gratuits : des réponses claires, adaptées à
              votre bassin, même depuis le bord de la piscine.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/analyse-eau" size="lg" variant="white">
                Analyser mon eau
              </ButtonLink>
              <ButtonLink href="/depannage" size="lg" variant="secondary">
                Diagnostiquer un problème
              </ButtonLink>
            </div>
          </div>
          <PoolIllustration className="mx-auto hidden w-full max-w-md drop-shadow-2xl sm:block" />
        </div>
        <Waves className="absolute inset-x-0 bottom-0 h-12 w-full text-white" />
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14">
        {/* Outils principaux */}
        <section aria-labelledby="outils">
          <h2 id="outils" className="text-2xl font-bold text-eau-950 sm:text-3xl">
            Nos outils gratuits
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map(({ href, title, text, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full flex-col rounded-2xl border border-eau-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-eau-400 hover:shadow-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-eau-600 to-turquoise-500 text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-4 text-lg font-semibold text-eau-950">{title}</span>
                  <span className="mt-1 flex-1 text-sm text-slate-700">{text}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-eau-700">
                    Ouvrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Tous les calculateurs */}
        <section aria-labelledby="calculateurs">
          <h2 id="calculateurs" className="text-2xl font-bold text-eau-950 sm:text-3xl">
            Calculateurs
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {calculators.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/calculateurs/${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-eau-100 bg-white px-4 py-2 text-sm font-medium text-eau-900 shadow-sm hover:border-eau-400"
                >
                  <CalculatorIcon name={c.icon} className="h-4 w-4 text-turquoise-600" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Problèmes fréquents */}
        <section aria-labelledby="problemes">
          <div className="flex items-end justify-between gap-4">
            <h2 id="problemes" className="text-2xl font-bold text-eau-950 sm:text-3xl">
              Les problèmes les plus fréquents
            </h2>
            <Link href="/depannage" className="hidden text-sm font-semibold text-eau-700 hover:underline sm:block">
              Tous les problèmes
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {frequent.map((p) => (
              <li key={p.slug}>
                <Link href={`/depannage/${p.slug}`} className="flex items-center gap-3 rounded-2xl bg-eau-50 p-4 font-medium text-eau-950 transition hover:bg-eau-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-eau-700">
                    <ProblemIcon name={p.icon} className="h-5 w-5" />
                  </span>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/depannage" className="mt-4 inline-block text-sm font-semibold text-eau-700 hover:underline sm:hidden">
            Tous les problèmes
          </Link>
        </section>

        {/* Derniers articles */}
        <section aria-labelledby="articles">
          <div className="flex items-end justify-between gap-4">
            <h2 id="articles" className="text-2xl font-bold text-eau-950 sm:text-3xl">
              Derniers guides
            </h2>
            <Link href="/blog" className="text-sm font-semibold text-eau-700 hover:underline">
              Tous les guides
            </Link>
          </div>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="flex h-full flex-col rounded-2xl border border-eau-100 bg-white p-5 shadow-sm transition hover:border-eau-400 hover:shadow-md">
                  <span className="text-xs font-semibold uppercase tracking-wide text-turquoise-700">{a.category}</span>
                  <span className="mt-2 text-lg font-semibold leading-snug text-eau-950">{a.title}</span>
                  <span className="mt-2 flex-1 text-sm text-slate-700">{a.description}</span>
                  <time dateTime={a.date} className="mt-4 text-xs text-slate-600">
                    {formatDateFr(a.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Demande de devis */}
        <section aria-labelledby="devis" className="grid gap-8 rounded-3xl bg-eau-950 p-6 text-white sm:p-10 lg:grid-cols-2">
          <div>
            <h2 id="devis" className="text-2xl font-bold sm:text-3xl">
              Besoin d&apos;un professionnel ?
            </h2>
            <p className="mt-3 text-eau-100">
              Panne, fuite, problème électrique, rénovation : décrivez votre besoin et nous le transmettons gratuitement à un
              professionnel près de chez vous.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-eau-100">
              <li>✓ Gratuit et sans engagement</li>
              <li>✓ Électricien qualifié pour tout problème électrique</li>
              <li>✓ Vos données ne sont jamais revendues</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5 text-slate-900 sm:p-6">
            <QuoteForm />
          </div>
        </section>
      </div>
    </>
  );
}
