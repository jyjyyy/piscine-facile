import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { ToComplete } from "@/components/ToComplete";

export const metadata = buildMetadata({
  title: "Politique de confidentialité",
  description: `Comment ${siteConfig.name} collecte, utilise et protège vos données personnelles (RGPD).`,
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader title="Politique de confidentialité" intro="Vos données sont utilisées uniquement pour traiter vos demandes." />
      <div className="prose-piscine mx-auto max-w-3xl px-4 py-10">
        <p>Dernière mise à jour : <ToComplete>date</ToComplete></p>

        <h2>Responsable du traitement</h2>
        <p>
          <ToComplete>Prénom NOM, adresse</ToComplete>, éditeur du site {siteConfig.name}. Contact :{" "}
          <ToComplete>adresse e-mail</ToComplete>.
        </p>

        <h2>Données collectées</h2>
        <p>
          <strong>Outils (analyse de l&apos;eau, calculateurs, dépannage)</strong> : les valeurs que vous saisissez sont
          traitées uniquement dans votre navigateur. Elles ne sont ni envoyées ni enregistrées sur nos serveurs.
        </p>
        <p>
          <strong>Formulaire « Trouver un professionnel »</strong> : nom, adresse e-mail, téléphone, code postal, type de
          besoin et description de votre demande.
        </p>
        <p>
          <strong>Rappels d&apos;entretien par e-mail</strong> : votre adresse e-mail, uniquement après confirmation par le lien envoyé
          (double validation). Vous pouvez vous désinscrire à tout moment grâce au lien présent dans chaque e-mail.
        </p>
        <p>
          <strong>Données techniques</strong> : notre hébergeur peut enregistrer des journaux techniques (adresse IP,
          date, page demandée) nécessaires à la sécurité et au bon fonctionnement du site.
        </p>

        <h2>Finalités et bases légales</h2>
        <ul>
          <li>
            Traiter votre demande de devis et la transmettre à un ou plusieurs professionnels susceptibles d&apos;y
            répondre : <strong>consentement</strong> (article 6.1.a du RGPD), recueilli par la case à cocher du formulaire.
          </li>
          <li>
            Vous envoyer les rappels d&apos;entretien : <strong>consentement</strong> (case à cocher et confirmation par e-mail). Conservation
            jusqu&apos;à votre désinscription.
          </li>
          <li>
            Mesurer l&apos;audience de façon anonyme, sans cookie : <strong>intérêt légitime</strong>.
          </li>
          <li>
            Assurer la sécurité du site : <strong>intérêt légitime</strong> (article 6.1.f du RGPD).
          </li>
        </ul>

        <h2>Destinataires</h2>
        <ul>
          <li>L&apos;éditeur du site.</li>
          <li>Les professionnels partenaires auxquels votre demande est transmise, pour y répondre uniquement.</li>
          <li>
            Nos sous-traitants techniques : l&apos;hébergeur du site (Vercel) et le service d&apos;envoi d&apos;e-mails
            (Resend). Ces prestataires peuvent traiter des données hors de l&apos;Union européenne, dans le cadre de
            garanties appropriées (décision d&apos;adéquation ou clauses contractuelles types de la Commission européenne).
          </li>
        </ul>
        <p>Vos données ne sont jamais vendues.</p>

        <h2>Durée de conservation</h2>
        <p>
          Les demandes de devis sont conservées <strong>3 ans</strong> à compter du dernier contact, puis supprimées.
          <ToComplete>adaptez cette durée si nécessaire</ToComplete>
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition
          et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment et de définir
          des directives sur le sort de vos données après votre décès. Pour les exercer, écrivez à{" "}
          <ToComplete>adresse e-mail</ToComplete>.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (cnil.fr).
        </p>

        <h2>Cookies</h2>
        <p>
          Voir notre <a href="/cookies">politique cookies</a>.
        </p>
      </div>
    </>
  );
}
