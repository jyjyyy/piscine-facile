import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { ManageCookiesInline } from "./ManageCookiesInline";

export const metadata = buildMetadata({
  title: "Politique cookies",
  description: `Les cookies et traceurs utilisés sur ${siteConfig.name} et comment gérer vos choix.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <PageHeader title="Politique cookies" />
      <div className="prose-piscine mx-auto max-w-3xl px-4 py-10">
        <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p>
          Un cookie (ou traceur) est un petit fichier ou une information enregistrée dans votre navigateur lorsque vous
          consultez un site. Il permet par exemple de mémoriser vos préférences ou de mesurer l&apos;audience.
        </p>

        <h2>Ce que nous utilisons aujourd&apos;hui</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Finalité</th>
              <th>Durée</th>
              <th>Consentement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pf-consent-v1 (stockage local)</td>
              <td>Mémoriser vos choix concernant les cookies</td>
              <td>6 mois</td>
              <td>Non requis (strictement nécessaire)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Si une mesure d&apos;audience est activée, nous utilisons un outil <strong>sans cookie</strong> (Plausible ou Umami) qui produit
          uniquement des statistiques anonymes (pages vues, provenance) et ne vous suit pas d&apos;un site à l&apos;autre.
        </p>
        <p>
          À ce jour, <strong>aucun cookie de mesure d&apos;audience ni de publicité</strong> n&apos;est déposé. Si nous
          en ajoutons, ils ne seront activés qu&apos;après votre consentement, et cette page sera mise à jour.
        </p>

        <h2>Liens affiliés</h2>
        <p>
          Lorsque vous cliquez sur un lien affilié, vous quittez notre site : le site marchand peut alors déposer ses
          propres cookies, selon sa propre politique et avec son propre recueil de consentement.
        </p>

        <h2>Gérer vos choix</h2>
        <p>
          Vous pouvez modifier vos choix à tout moment, avec le lien « Gérer les cookies » en bas de chaque page ou le
          bouton ci-dessous. Refuser est aussi simple qu&apos;accepter, et votre choix est conservé 6 mois.
        </p>
        <ManageCookiesInline />
      </div>
    </>
  );
}
