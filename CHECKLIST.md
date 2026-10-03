# Checklist avant la mise en ligne

Cochez chaque point au fur et à mesure.

## Informations légales (obligatoire)

- [ ] `app/mentions-legales/page.tsx` : remplacer chaque encadré jaune `[À compléter]` (nom, adresse, SIRET, e-mail, téléphone, mention TVA, directeur de publication).
- [ ] Vérifier les coordonnées de l'hébergeur (Vercel) sur le site de Vercel au moment de la mise en ligne.
- [ ] `app/confidentialite/page.tsx` : responsable du traitement, e-mail de contact, date de mise à jour, durée de conservation.
- [ ] Vérifier que votre activité déclarée au guichet unique couvre l'édition de site / l'apport d'affaires (mise en relation rémunérée).
- [ ] Si vous transmettez les demandes à des professionnels : prévoir un accord écrit avec eux sur l'usage des données (RGPD).

## Pages « électricien piscine »

- [ ] `config/serviceArea.ts` : ajouter vos départements, avec une `localNote` différente pour chacun et vos principales communes.
- [ ] Renseigner `insurance` (assurance décennale : assureur et numéro de contrat). Elle est obligatoire pour les travaux d'électricité et doit figurer sur vos devis et factures.
- [ ] Vérifier `qualifications`.
- [ ] Vérifier que votre activité d'électricité est bien déclarée sur votre micro-entreprise (activité artisanale réglementée).
- [ ] (Facultatif) Définir `QUOTE_ZONE_EMAIL`.

## Page « À propos »

- [ ] `app/a-propos/page.tsx` : nom, parcours, et phrase sur votre expérience (vérifiez ce que vous souhaitez rendre public vis-à-vis de votre employeur).

## Rappels par e-mail

- [ ] Créer un segment Resend et renseigner `RESEND_SEGMENT_ID`.
- [ ] Générer et renseigner `NEWSLETTER_SECRET` (README, section 3).
- [ ] Tester une inscription complète (e-mail de confirmation, puis clic sur le lien).
- [ ] Programmer les 4 envois saisonniers (`content/emails/README.md`).

## Configuration

- [ ] `config/site.ts` : nom du site (si différent de « PiscineFacile ») et `contactEmail`.
- [ ] Créer un compte Resend, vérifier votre domaine (SPF/DKIM) et créer une clé API.
- [ ] Renseigner dans Vercel : `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`.
- [ ] Envoyer une demande de devis test depuis le site en ligne et vérifier la réception.

## Affiliation

- [ ] S'inscrire aux programmes d'affiliation choisis (Amazon Partenaires, Awin, Effiliation, sites de piscinistes…).
- [ ] `config/affiliates.ts` : coller chaque lien dans `url` et renseigner `program`.
- [ ] Vérifier que chaque bouton « Voir le prix » mène au bon produit.
- [ ] Respecter les conditions de chaque programme (certaines imposent une mention spécifique).

## Nom de domaine et référencement

- [ ] Acheter le nom de domaine et le brancher sur Vercel (README, section 12).
- [ ] Mettre à jour `NEXT_PUBLIC_SITE_URL` avec l'URL définitive et redéployer.
- [ ] Déclarer le site dans Google Search Console (méthode « balise HTML » → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) et soumettre `/sitemap.xml`.
- [ ] Faire de même dans Bing Webmaster Tools (`NEXT_PUBLIC_BING_SITE_VERIFICATION`).
- [ ] Créer une fiche Google Business Profile pour votre activité d'électricien (référencement local).
- [ ] Publier régulièrement : 2 à 4 nouveaux articles par mois au départ.
- [ ] Obtenir quelques liens vers le site (annuaires d'artisans, forums de piscine, réseaux sociaux).
- [ ] (Facultatif) Activer Plausible ou Umami pour mesurer l'audience sans cookie.

## Vérifications finales

- [ ] Relire les 23 articles et adapter le ton si besoin.
- [ ] Tester le site sur votre téléphone (analyse de l'eau, assistant, formulaire).
- [ ] Tester la bannière cookies (« Tout refuser », puis « Gérer les cookies » en bas de page).
- [ ] `npm test`, `npm run lint` et `npm run build` sans erreur avant chaque mise en production.

## Plus tard

- [ ] Mesure d'audience : si vous l'ajoutez, la conditionner au consentement et mettre à jour `/cookies`.
- [ ] Publicité : passer `features.ads` à `true` et intégrer la régie dans `components/AdSlot.tsx`.
- [ ] Offre Premium : page prête dans `/premium` (`features.premium`).
