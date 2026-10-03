import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VolumesDiagram } from "@/components/illustrations/VolumesDiagram";
import { ElectricalWarning } from "@/components/SafetyWarning";
import { ProCta } from "@/components/ProCta";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata({
  title: "Électricité de piscine : ce qu'impose la norme NF C 15-100 (partie 7-702)",
  description:
    "Volumes 0, 1 et 2, différentiel 30 mA, liaison équipotentielle, éclairage en TBTS 12 V, coffret de filtration : le guide clair de l'électricité d'une piscine privée.",
  path: "/guide-electrique",
});

const volumes = [
  {
    name: "Volume 0",
    zone: "L'intérieur du bassin, y compris les niches et orifices dans les parois et le fond.",
    allowed: [
      "Uniquement du matériel alimenté en TBTS (très basse tension de sécurité) : 12 V alternatif ou 30 V continu au maximum.",
      "La source (transformateur de sécurité) est obligatoirement placée hors des volumes 0, 1 et 2.",
      "Matériel spécifiquement conçu pour être immergé (projecteurs de piscine), indice de protection IPX8.",
      "Aucune prise de courant, aucun interrupteur, aucune boîte de connexion.",
    ],
  },
  {
    name: "Volume 1",
    zone: "Jusqu'à 2 m autour du bord du bassin, et jusqu'à 2,5 m de hauteur au-dessus du sol (plage, margelles).",
    allowed: [
      "En règle générale, matériel en TBTS 12 V alternatif / 30 V continu, source placée hors des volumes 0, 1 et 2.",
      "Indice de protection IPX5 minimum si des jets d'eau sont utilisés pour le nettoyage (IPX4 sinon).",
      "Aucune prise de courant ni interrupteur alimentés en basse tension (230 V).",
      "Seuls quelques équipements fixes spécialement conçus pour les piscines peuvent y être admis, dans les conditions strictes prévues par la norme : c'est à l'électricien d'en juger.",
    ],
  },
  {
    name: "Volume 2",
    zone: "La bande de 1,5 m située au-delà du volume 1 (soit de 2 m à 3,5 m du bord), sur 2,5 m de hauteur.",
    allowed: [
      "Prises de courant et interrupteurs admis s'ils sont protégés par un dispositif différentiel 30 mA, ou alimentés en TBTS, ou par séparation électrique.",
      "Indice de protection IPX4 minimum en extérieur (IPX5 en cas de nettoyage au jet).",
      "Les matériels d'éclairage et appareils fixes doivent être adaptés à un environnement humide.",
    ],
  },
];

const coffret = [
  {
    name: "Protection différentielle 30 mA",
    text: "Coupe le courant en quelques millisecondes en cas de fuite vers la terre (par exemple si une personne touche une partie sous tension). Elle protège les personnes. Son type (AC, A, F…) se choisit selon les équipements, notamment les pompes à vitesse variable et les pompes à chaleur.",
  },
  {
    name: "Disjoncteur de protection du circuit",
    text: "Protège le câble contre les surcharges et les courts-circuits. Son calibre dépend de la section du câble et de la puissance des équipements.",
  },
  {
    name: "Contacteur",
    text: "Interrupteur de puissance commandé à distance : c'est lui qui met la pompe en marche ou à l'arrêt, sur ordre de l'horloge.",
  },
  {
    name: "Horloge de programmation",
    text: "Définit les plages de filtration. Elle dispose en général d'une position marche forcée, arrêt et automatique, accessible en façade.",
  },
  {
    name: "Protection moteur (relais thermique ou disjoncteur moteur)",
    text: "Réglée sur l'intensité nominale du moteur, elle coupe la pompe si celle-ci force ou chauffe anormalement (moteur bloqué, marche à sec…).",
  },
  {
    name: "Transformateur de sécurité 12 V (si éclairage)",
    text: "Abaisse la tension à 12 V pour les projecteurs immergés. Il doit être de type « sécurité », protégé en amont et en aval, et installé hors des volumes 0, 1 et 2.",
  },
];

export default function GuideElectriquePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Électricité de piscine : ce qu'impose la norme NF C 15-100 (partie 7-702)",
          inLanguage: "fr-FR",
          author: { "@type": "Organization", name: siteConfig.name },
          publisher: { "@type": "Organization", name: siteConfig.name },
          mainEntityOfPage: `${siteConfig.url}/guide-electrique`,
        }}
      />
      <PageHeader
        title="Guide électrique de la piscine"
        intro="Ce que prévoit la norme NF C 15-100 (partie 7-702) pour les piscines privées, expliqué simplement."
      >
        <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/guide-electrique", label: "Guide électrique" }]} />
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-10">
        <ElectricalWarning />

        <section className="prose-piscine">
          <p>
            L&apos;eau réduit fortement la résistance du corps humain : un courant sans danger dans un salon peut devenir
            mortel au bord d&apos;une piscine. C&apos;est pourquoi la norme NF C 15-100 consacre une partie entière, la
            partie 7-702, aux bassins et à leurs abords. Elle découpe l&apos;espace en <strong>volumes</strong> et fixe,
            pour chacun, ce qui est autorisé.
          </p>
          <p>
            Ce guide vous aide à comprendre votre installation et à dialoguer avec votre électricien. Il ne remplace ni
            la norme ni l&apos;avis d&apos;un professionnel.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-eau-950">Les volumes 0, 1 et 2</h2>
          <VolumesDiagram />
          <div className="space-y-4">
            {volumes.map((v) => (
              <div key={v.name} className="rounded-2xl border border-eau-100 bg-white p-5">
                <h3 className="text-lg font-semibold text-eau-900">{v.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{v.zone}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-800">
                  {v.allowed.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            Au-delà du volume 2, les règles habituelles d&apos;une installation extérieure s&apos;appliquent. Des
            dispositions particulières existent (plongeoirs, toboggans, bassins sans margelle, locaux techniques
            enterrés) : votre électricien les appliquera selon votre configuration.
          </p>
        </section>

        <section className="prose-piscine">
          <h2>La protection différentielle 30 mA</h2>
          <p>
            Tous les circuits alimentant la piscine et ses équipements (pompe, éclairage, électrolyseur, pompe à chaleur,
            robot, prises extérieures) doivent être protégés par un <strong>dispositif différentiel à haute sensibilité
            de 30 mA</strong> au plus, sauf lorsqu&apos;ils sont alimentés en TBTS.
          </p>
          <ul>
            <li>Testez-le chaque mois avec son bouton « T » : il doit déclencher immédiatement.</li>
            <li>S&apos;il déclenche tout seul, ne le shuntez jamais et ne le remplacez pas par un modèle moins sensible : il signale un défaut réel.</li>
          </ul>
        </section>

        <section className="prose-piscine">
          <h2>La liaison équipotentielle supplémentaire</h2>
          <p>
            La liaison équipotentielle supplémentaire relie entre eux <strong>tous les éléments conducteurs</strong>{" "}
            situés dans les volumes 0, 1 et 2 et les raccorde au conducteur de protection (la terre) de
            l&apos;installation : armatures métalliques du béton lorsqu&apos;elles existent, échelles, pièces à sceller
            métalliques, canalisations métalliques, structures métalliques…
          </p>
          <p>
            Son rôle : éviter qu&apos;une différence de potentiel dangereuse apparaisse entre deux éléments qu&apos;une
            personne mouillée pourrait toucher en même temps. Elle se prévoit dès la construction, car les armatures sont
            ensuite noyées dans le béton. Les conducteurs utilisés ont une section minimale de 2,5 mm² en cuivre s&apos;ils
            sont protégés mécaniquement, 4 mm² sinon.
          </p>
        </section>

        <section className="prose-piscine">
          <h2>L&apos;éclairage immergé : TBTS 12 V</h2>
          <ul>
            <li>Les projecteurs immergés sont alimentés en <strong>très basse tension de sécurité : 12 V alternatif</strong> au maximum (ou 30 V continu).</li>
            <li>Le <strong>transformateur de sécurité</strong> est placé hors des volumes 0, 1 et 2, généralement dans le coffret ou le local technique.</li>
            <li>Les projecteurs sont conçus pour les piscines (IPX8) et raccordés avec un câble adapté à l&apos;immersion.</li>
            <li>Le changement d&apos;une lampe ou d&apos;un projecteur doit être réalisé hors tension, idéalement par un professionnel.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-eau-950">Le coffret de filtration : à quoi sert chaque élément ?</h2>
          <p className="text-slate-700">
            Le coffret électrique de filtration est installé hors des volumes 0, 1 et 2, en général dans le local
            technique. Voici ses composants habituels :
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {coffret.map((c) => (
              <div key={c.name} className="rounded-2xl bg-eau-50 p-4">
                <dt className="font-semibold text-eau-950">{c.name}</dt>
                <dd className="mt-1 text-sm text-slate-700">{c.text}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-slate-600">
            En tant que particulier, vous pouvez utiliser les commandes accessibles en façade (horloge, sélecteur
            marche/arrêt/auto). Tout ce qui se trouve derrière le capot est réservé à un électricien qualifié.
          </p>
        </section>

        <section className="rounded-2xl border-2 border-eau-200 bg-eau-50 p-6">
          <h2 className="text-lg font-bold text-eau-950">Ce guide est informatif</h2>
          <p className="mt-2 text-slate-800">
            Il présente les grands principes de la norme NF C 15-100 applicables aux piscines privées. Toute création,
            modification ou réparation de l&apos;installation électrique d&apos;une piscine doit être réalisée par un{" "}
            <strong>électricien qualifié</strong>, qui vérifiera la conformité de l&apos;ensemble à la norme en vigueur.
          </p>
        </section>

        <ProCta need="electricite" title="Besoin d'un électricien pour votre piscine ?" text="Mise en conformité, ajout d'un éclairage, disjoncteur qui saute : décrivez votre besoin, nous le transmettons à un professionnel près de chez vous." />

        <RelatedLinks
          links={[
            { href: "/blog/norme-electrique-piscine", label: "Norme électrique piscine : ce que tout propriétaire doit savoir" },
            { href: "/blog/pompe-piscine-fait-disjoncter", label: "Ma pompe de piscine fait disjoncter : les causes possibles" },
            { href: "/depannage/disjoncteur-differentiel-saute", label: "Assistant : le disjoncteur ou le différentiel saute" },
          ]}
        />
      </div>
    </>
  );
}
