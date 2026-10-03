import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { ToComplete } from "@/components/ToComplete";

export const metadata = buildMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${siteConfig.name} : éditeur, hébergeur, propriété intellectuelle et responsabilité.`,
  path: "/mentions-legales",
});

/*
 * ⚠️ À COMPLÉTER AVANT LA MISE EN LIGNE : remplacez chaque <ToComplete> par vos informations.
 * Référence : article 6 de la loi n° 2004-575 du 21 juin 2004 (LCEN).
 */
export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader title="Mentions légales" />
      <div className="prose-piscine mx-auto max-w-3xl px-4 py-10">
        <h2>Éditeur du site</h2>
        <p>
          Le site {siteConfig.name} ({siteConfig.url}) est édité par :
          <br />
          <ToComplete>Prénom NOM</ToComplete>, entrepreneur individuel (micro-entreprise)
          <br />
          Adresse : <ToComplete>adresse postale ou de domiciliation</ToComplete>
          <br />
          SIRET : <ToComplete>numéro SIRET à 14 chiffres</ToComplete>
          <br />
          E-mail : <ToComplete>adresse e-mail de contact</ToComplete>
          <br />
          Téléphone : <ToComplete>numéro de téléphone</ToComplete>
          <br />
          TVA : <ToComplete>« TVA non applicable, art. 293 B du CGI » ou numéro de TVA intracommunautaire</ToComplete>
        </p>
        <p>
          Directeur de la publication : <ToComplete>Prénom NOM</ToComplete>
        </p>

        <h2>Hébergeur</h2>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis
          <br />
          Site : vercel.com
          <br />
          <ToComplete>vérifiez ces coordonnées sur le site de Vercel au moment de la mise en ligne, ou indiquez votre hébergeur</ToComplete>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus du site (textes, outils, illustrations, logo) est la propriété exclusive de
          l&apos;éditeur, sauf mention contraire. Toute reproduction, totale ou partielle, sans autorisation écrite préalable
          est interdite.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Les informations, calculs et conseils proposés sur {siteConfig.name} sont fournis à titre indicatif et
          pédagogique. Ils ne remplacent ni les consignes des fabricants de produits et d&apos;équipements, ni
          l&apos;intervention d&apos;un professionnel. Les doses calculées doivent toujours être appliquées
          progressivement, en contrôlant l&apos;eau entre deux apports.
        </p>
        <p>
          Toute intervention sur une installation électrique doit être réalisée par un électricien qualifié.
          L&apos;éditeur ne saurait être tenu responsable d&apos;un dommage résultant d&apos;une mauvaise utilisation des
          informations publiées.
        </p>

        <h2>Liens d&apos;affiliation</h2>
        <p>
          Certains liens du site sont des liens affiliés. Voir la page <a href="/transparence-affiliation">Transparence affiliation</a>.
        </p>

        <h2>Données personnelles et cookies</h2>
        <p>
          Voir la <a href="/confidentialite">politique de confidentialité</a> et la{" "}
          <a href="/cookies">politique cookies</a>.
        </p>
      </div>
    </>
  );
}
