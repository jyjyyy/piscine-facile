import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";

export const metadata = buildMetadata({
  title: "Transparence affiliation",
  description: `Comment ${siteConfig.name} se finance : liens affiliés, mise en relation avec des professionnels et indépendance éditoriale.`,
  path: "/transparence-affiliation",
});

export default function TransparencePage() {
  return (
    <>
      <PageHeader title="Transparence affiliation" intro="Comment le site se finance, et pourquoi cela n'influence pas nos conseils." />
      <div className="prose-piscine mx-auto max-w-3xl px-4 py-10">
        <h2>Un site gratuit, financé par l&apos;affiliation</h2>
        <p>
          {siteConfig.name} est gratuit. Pour financer la création des outils et des guides, certains liens vers des
          produits sont des <strong>liens affiliés</strong> : si vous achetez un produit après avoir cliqué sur l&apos;un
          d&apos;eux, le marchand nous verse une petite commission.
        </p>
        <ul>
          <li>Cela ne vous coûte rien de plus : le prix est le même.</li>
          <li>Les liens affiliés sont signalés par un bouton « Voir le prix » et par une mention sur chaque page concernée.</li>
          <li>Techniquement, ils portent l&apos;attribut <code>rel=&quot;sponsored&quot;</code>, conformément aux recommandations des moteurs de recherche.</li>
        </ul>

        <h2>Notre engagement d&apos;indépendance</h2>
        <ul>
          <li>Nos conseils et nos calculs sont établis <strong>avant</strong> le choix des produits, jamais l&apos;inverse.</li>
          <li>Nous recommandons un type de produit (par exemple « pH moins en poudre »), pas une marque imposée.</li>
          <li>Nous ne recommandons jamais d&apos;acheter un produit inutile : quand un problème relève d&apos;un professionnel, nous le disons.</li>
        </ul>

        <h2>La mise en relation avec des professionnels</h2>
        <p>
          Le formulaire « Trouver un professionnel » permet de transmettre votre demande à des professionnels de la
          piscine ou de l&apos;électricité. Ce service est gratuit pour vous ; nous pouvons être rémunérés par les
          professionnels partenaires.
        </p>

        <h2>Publicité</h2>
        <p>
          Des emplacements publicitaires pourront être activés à l&apos;avenir. Ils seront clairement identifiés et ne
          seront jamais personnalisés sans votre consentement.
        </p>
      </div>
    </>
  );
}
