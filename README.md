# PiscineFacile

Site d'aide à l'entretien et au dépannage des piscines privées : analyse de l'eau, assistant de dépannage, calculateurs, guides et mise en relation avec des professionnels.

**Stack :** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · MDX · Resend · Vitest. Le site est statique (SSG), sans base de données, et se déploie sur Vercel sans modification.

---

## 1. Installation

Prérequis : **Node.js 20.9 ou plus récent** (recommandé : la version LTS, sur [nodejs.org](https://nodejs.org)).

Ouvrez le dossier du projet dans VS Code, puis ouvrez un terminal (menu **Terminal → Nouveau terminal**) :

```bash
npm install
```

> Cette commande télécharge les dépendances listées dans `package.json` (dossier `node_modules`, ~400 Mo). À faire une seule fois, puis après chaque modification de `package.json`.

VS Code proposera d'installer les extensions recommandées (ESLint, Tailwind CSS, MDX) : acceptez.

## 2. Lancer le site en local

```bash
npm run dev
```

Ouvrez ensuite http://localhost:3000. Les modifications s'affichent automatiquement. `Ctrl + C` dans le terminal pour arrêter.

Autres commandes utiles :

| Commande | Rôle |
|---|---|
| `npm run build` | Construit la version de production (vérifie aussi le TypeScript) |
| `npm start` | Lance la version construite |
| `npm test` | Lance les tests unitaires (calculs, arbre de dépannage, formulaire) |
| `npm run lint` | Vérifie la qualité du code |
| `npm run typecheck` | Vérifie les types TypeScript |

## 3. Variables d'environnement

Copiez `.env.example` en `.env.local` et complétez :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, sans slash final (sitemap, Open Graph, URL canoniques) |
| `RESEND_API_KEY` | Clé API [Resend](https://resend.com) (menu *API Keys*) |
| `QUOTE_TO_EMAIL` | Adresse qui reçoit les demandes de devis |
| `QUOTE_FROM_EMAIL` | Expéditeur, sur un domaine **vérifié** dans Resend (ex : `PiscineFacile <devis@votre-domaine.fr>`) |
| `QUOTE_ZONE_EMAIL` | *(facultatif)* reçoit les demandes « Électricité » de votre zone (voir section 13) |
| `NEWSLETTER_SECRET` | Chaîne aléatoire longue qui signe les liens de confirmation des rappels |
| `RESEND_SEGMENT_ID` | *(facultatif)* segment Resend où ranger les inscrits aux rappels |
| `NEWSLETTER_FROM_EMAIL` | *(facultatif)* expéditeur des rappels (par défaut `QUOTE_FROM_EMAIL`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | *(facultatif)* code de vérification Google Search Console |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | *(facultatif)* code de vérification Bing Webmaster Tools |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | *(facultatif)* active la mesure d'audience Plausible (sans cookie) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` + `NEXT_PUBLIC_UMAMI_SRC` | *(facultatif)* active Umami (sans cookie) |

Pour générer `NEWSLETTER_SECRET`, tapez dans le terminal : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` et copiez le résultat.

Sans ces variables, le site fonctionne, mais le formulaire de devis affiche « service pas encore configuré ».

Pour tester avant d'avoir vérifié votre domaine, utilisez `QUOTE_FROM_EMAIL=onboarding@resend.dev` : Resend n'enverra alors qu'à l'adresse de votre compte Resend.

L'e-mail reçu a pour objet `[Devis] 33000 – Type de besoin`, contient un récapitulatif structuré, et « Répondre » écrit directement au demandeur.

## 4. Structure du projet

```
app/                    Pages (une URL = un dossier)
  analyse-eau/          Outil phare
  depannage/[slug]/     Pages de dépannage générées depuis le JSON
  calculateurs/         Volume, filtration, pompe, consommation
  blog/[slug]/          Articles MDX
  api/devis/route.ts    Envoi e-mail du formulaire
  sitemap.ts, robots.ts Générés automatiquement
components/             Composants (ui/, layout/, tools/, illustrations/)
config/site.ts          Nom du site, URL, drapeaux (pubs, premium)
config/affiliates.ts    Tous les liens d'affiliation
lib/waterCalc.ts        Calculs de l'analyse de l'eau (fonctions pures)
lib/poolCalc.ts         Volume, filtration, pompe, consommation
lib/heatPumpCalc.ts     Pompe à chaleur
lib/langelier.ts        Indice de Langelier
lib/treatmentCalc.ts    Sel, chlore choc, conversions
lib/calculators.ts      Catalogue des calculateurs (textes SEO, FAQ, liens)
config/serviceArea.ts   Votre activité d'électricien et vos départements
content/emails/         Rappels saisonniers prêts à envoyer
data/troubleshooting.json  Arbre de dépannage
content/blog/*.mdx      Articles
tests/                  Tests unitaires
```

**Changer le nom du site :** `config/site.ts` → `name`.

## 5. Ajouter un article

1. Créez `content/blog/mon-article.mdx` (le nom du fichier devient l'URL : `/blog/mon-article`, en minuscules, chiffres et tirets).
2. Commencez par l'en-tête :

```mdx
---
title: "Titre de l'article"
description: "Résumé de 150 caractères environ (utilisé par Google)."
date: 2026-10-01
category: "Traitement de l'eau"
tool: { href: "/analyse-eau", label: "Analyser mon eau" }
products: ["ph-minus", "trousse-analyse"]
---

Votre texte en Markdown…
```

- `tool` (facultatif) : lien vers l'outil associé (maillage interne).
- `products` (facultatif) : clés de `config/affiliates.ts` affichées en fin d'article.
- `howTo` (facultatif) : ajoute les données structurées HowTo pour un guide pas à pas :

```yaml
howTo:
  name: "Faire ceci"
  steps:
    - "Étape 1"
    - "Étape 2"
```

Composants utilisables dans le texte :

```mdx
<Callout tone="warning" title="Attention">Texte</Callout>   // tone : info, success, warning, danger
<ToolCta href="/analyse-eau" title="Titre">Texte</ToolCta>
<Product id="ph-minus" />
<SafetyWarning />
<ElectricalWarning />
```

L'article apparaît automatiquement dans la liste, l'accueil et le sitemap.

## 6. Ajouter ou modifier un lien d'affiliation

Tout est dans `config/affiliates.ts`. Pour activer un produit, collez votre lien dans `url` :

```ts
"ph-minus": {
  name: "pH moins en poudre (bisulfate de sodium)",
  description: "Fait baisser le pH et le TAC.",
  category: "equilibre",
  url: "https://votre-lien-affilie…",
  program: "Amazon Partenaires",
},
```

- Tant que `url` est vide, le bouton affiche « Lien bientôt disponible » : aucun lien cassé n'est publié.
- Les liens sont automatiquement en `rel="sponsored nofollow noopener"` et s'ouvrent dans un nouvel onglet.
- Pour un **nouveau** produit, ajoutez une entrée avec une nouvelle clé, puis utilisez cette clé dans un article (`<Product id="…" />`), dans `products` d'un article, ou dans le JSON de dépannage.

## 7. Modifier l'arbre de dépannage

Fichier : `data/troubleshooting.json`. Chaque problème contient des **nœuds** de deux types :

```json
"ma-question": {
  "type": "question",
  "text": "Le pH est-il supérieur à 7,6 ?",
  "help": "Texte d'aide facultatif",
  "options": [
    { "label": "Oui", "next": "r-ph-haut" },
    { "label": "Non", "next": "autre-question" }
  ]
},
"r-ph-haut": {
  "type": "result",
  "title": "pH trop élevé",
  "severity": "diy",
  "causes": ["…"],
  "steps": ["…", "…"],
  "products": ["ph-minus"],
  "showPro": false
}
```

- `severity` : `diy` (faisable soi-même), `pro` (professionnel conseillé), `electricien` (électricien obligatoire, bouton pro toujours affiché).
- `startNode` indique la première question.
- `faq` alimente la FAQ visible et les données structurées FAQPage.
- Pour ajouter un problème, copiez un bloc existant avec un nouveau `slug` : la page `/depannage/nouveau-slug` est créée automatiquement.

**Après chaque modification, lancez `npm test`** : les tests vérifient que chaque option pointe vers un nœud existant, qu'aucun nœud n'est orphelin et que chaque produit existe dans `affiliates.ts`.

Règle de sécurité : toute branche qui nécessiterait d'ouvrir le coffret électrique doit se terminer par un résultat `"severity": "electricien"`.

## 8. Les calculs

- `lib/waterCalc.ts` : TAC plus, baisse du TAC, chlore et stabilisant sont calculés de façon **stœchiométrique** (exacte). Les doses de pH plus / pH moins utilisent les valeurs moyennes des fabricants (≈ 100 g / 10 m³ / 0,1 unité), corrigées selon le TAC. Quand la concentration du produit n'est pas renseignée, l'outil affiche une fourchette.
- `lib/poolCalc.ts` : volumes (ovale : coefficient 0,89), filtration (température / 2, température / 3 en hivernage actif, 24 h au-delà de 30 °C), pompe (renouvellement en 4 à 6 h, tableau indicatif à 10 mCE), consommation.
- Chaque formule est couverte par des tests dans `tests/` avec des valeurs vérifiées à la main.

## 9. Fonctionnalités désactivées par défaut

Dans `config/site.ts` → `features` :

- `ads: false` : les emplacements `<AdSlot />` ne rendent rien. Une fois activés, conditionnez le script de la régie au consentement `ads` (voir `lib/consent.ts`).
- `premium: false` : la page `/premium` existe mais n'est ni dans le menu ni indexée.

## 10. Cookies et RGPD

- La bannière (`components/CookieBanner.tsx`) propose « Tout refuser », « Personnaliser » et « Tout accepter » au même niveau.
- Aujourd'hui, aucun traceur non essentiel n'est utilisé. Si vous ajoutez une mesure d'audience, chargez-la uniquement si `readConsent()?.analytics === true` et mettez à jour `/cookies`.
- Le choix est conservé 6 mois.

## 11. Déploiement sur Vercel

1. Créez un dépôt GitHub et poussez le projet :

   ```bash
   git init
   git add .
   git commit -m "Premier commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/piscinefacile.git
   git push -u origin main
   ```

2. Sur [vercel.com](https://vercel.com), **Add New → Project**, importez le dépôt. Vercel détecte Next.js automatiquement : ne changez rien.
3. Dans **Settings → Environment Variables**, ajoutez les 4 variables du paragraphe 3.
4. Cliquez sur **Deploy**. Chaque `git push` sur `main` redéploiera le site.

## 12. Brancher un nom de domaine

1. Vercel → votre projet → **Settings → Domains** → ajoutez `piscinefacile.fr` et `www.piscinefacile.fr`.
2. Chez votre registrar (OVH, Gandi, IONOS…), créez les enregistrements DNS **indiqués par Vercel** (en général un enregistrement `A` pour le domaine nu et un `CNAME` pour `www`).
3. Attendez la propagation (quelques minutes à quelques heures) : le certificat HTTPS est automatique.
4. Mettez à jour `NEXT_PUBLIC_SITE_URL` dans Vercel avec l'URL définitive, puis redéployez.
5. Dans Resend, **vérifiez le domaine** (enregistrements DNS SPF/DKIM fournis par Resend) pour pouvoir envoyer depuis `devis@votre-domaine.fr`.
6. Déclarez le site dans [Google Search Console](https://search.google.com/search-console) et soumettez `https://votre-domaine.fr/sitemap.xml`.

## 13. Pages « électricien piscine » et demandes dans votre zone

Fichier : `config/serviceArea.ts`.

- `/electricien-piscine` présente vos prestations, avec un formulaire de devis pré-réglé sur « Électricité ».
- Pour chaque département ajouté dans `departments`, une page `/electricien-piscine/33-gironde` est créée automatiquement (et ajoutée au sitemap).
- **Rédigez une `localNote` différente pour chaque département** : des pages identiques où seul le nom change sont ignorées, voire pénalisées, par Google.
- Les demandes « Électricité » dont le code postal est dans vos départements arrivent avec l'objet `[Ma zone] [Devis] …`, et à `QUOTE_ZONE_EMAIL` si vous l'avez défini.
- `qualifications` et `insurance` s'affichent en badges sur la page : renseignez votre assurance décennale.

## 14. Rappels d'entretien par e-mail

1. Dans Resend, créez un **segment** (Audience → Segments) et copiez son identifiant dans `RESEND_SEGMENT_ID`.
2. Définissez `NEWSLETTER_SECRET`.
3. Inscription : formulaire → e-mail de confirmation (lien valable 48 h) → le contact est ajouté dans Resend. C'est le « double opt-in » recommandé par la CNIL.
4. Pour envoyer un rappel : **Resend → Broadcasts**, en copiant un des textes de `content/emails/` (le fichier `content/emails/README.md` donne le calendrier d'envoi). Le lien de désinscription est géré par Resend.

## 15. Ajouter un calculateur

1. Écrivez la logique dans `lib/` (fonction pure) et un test dans `tests/`.
2. Créez le composant dans `components/tools/`.
3. Ajoutez une entrée dans `lib/calculators.ts` (titre, texte, FAQ).
4. Ajoutez le composant dans la table `tools` de `app/calculateurs/[slug]/page.tsx`.

La page, son image de partage, sa FAQ et son entrée dans le sitemap sont générées automatiquement.

## 16. Ce qui est fait pour le référencement

- Une balise `title`, une description et une URL canonique uniques par page
- Une image de partage (Open Graph) générée pour chaque article, calculateur et page de dépannage
- Des données structurées : `WebSite`, `Organization`, `Article`, `HowTo`, `FAQPage`, `BreadcrumbList`, `WebApplication`, `Service`, `AboutPage`
- Un fil d'Ariane visible, plus des FAQ visibles et un maillage interne entre outils et guides
- `sitemap.xml`, `robots.txt`, un flux RSS (`/blog/rss.xml`) et un manifeste web, tous générés automatiquement
- Un site 100 % statique, donc très rapide, pensé d'abord pour le mobile et accessible
- Une page « À propos » qui montre qui écrit les contenus (critères de confiance E-E-A-T de Google)

Voir aussi **CHECKLIST.md** pour tout ce qu'il reste à compléter avant la mise en ligne.
# piscine-facile
