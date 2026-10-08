/**
 * Liens d'affiliation centralisés.
 *
 * ➜ Pour activer un produit : collez votre lien d'affiliation dans le champ `url`.
 * ➜ Tant que `url` est vide, le bouton "Voir le prix" est remplacé par "Lien bientôt disponible"
 *   (aucun lien cassé n'est publié).
 * ➜ Tous les liens sont automatiquement rendus avec rel="sponsored nofollow noopener".
 */

export type AffiliateCategory =
  | "equilibre"
  | "desinfection"
  | "traitement"
  | "analyse"
  | "filtration"
  | "equipement"
  | "hivernage"
  | "securite";

export interface AffiliateProduct {
  /** Nom affiché */
  name: string;
  /** Courte description (1 phrase) */
  description: string;
  /** Catégorie, utilisée pour le classement */
  category: AffiliateCategory;
  /** Lien d'affiliation complet (vide = désactivé) */
  url: string;
  /** Programme d'affiliation (Amazon, Awin, Effiliation…) – information interne */
  program: string;
}

export const affiliates = {
  // ── Équilibre de l'eau ─────────────────────────────────────
  "ph-minus": {
    name: "pH moins en poudre (bisulfate de sodium)",
    description: "Fait baisser le pH et le TAC. Le produit le plus utilisé en piscine privée.",
    category: "equilibre",
    url: "",
    program: "À définir",
  },
  "ph-plus": {
    name: "pH plus en poudre (carbonate de sodium)",
    description: "Fait monter le pH lorsqu'il est trop bas.",
    category: "equilibre",
    url: "",
    program: "À définir",
  },
  "tac-plus": {
    name: "TAC plus (bicarbonate de sodium)",
    description: "Augmente l'alcalinité pour stabiliser le pH.",
    category: "equilibre",
    url: "",
    program: "À définir",
  },
  "calcium-plus": {
    name: "Dureté plus (chlorure de calcium)",
    description: "Augmente la dureté d'une eau trop douce et agressive.",
    category: "equilibre",
    url: "",
    program: "À définir",
  },
  "stabilisant": {
    name: "Stabilisant de chlore (acide cyanurique)",
    description: "Protège le chlore de la destruction par les UV.",
    category: "equilibre",
    url: "",
    program: "À définir",
  },
  "anti-calcaire": {
    name: "Séquestrant calcaire",
    description: "Limite les dépôts de tartre dans les eaux dures.",
    category: "equilibre",
    url: "",
    program: "À définir",
  },

  // ── Désinfection ───────────────────────────────────────────
  "chlore-choc": {
    name: "Chlore choc (granulés)",
    description: "Désinfection rapide en cas d'eau verte ou trouble.",
    category: "desinfection",
    url: "",
    program: "À définir",
  },
  "chlore-lent": {
    name: "Chlore lent (galets 200 g)",
    description: "Désinfection continue, à placer dans le skimmer ou un diffuseur.",
    category: "desinfection",
    url: "",
    program: "À définir",
  },
  "chlore-liquide": {
    name: "Chlore liquide non stabilisé",
    description: "Désinfectant sans stabilisant, idéal quand l'acide cyanurique est déjà élevé.",
    category: "desinfection",
    url: "",
    program: "À définir",
  },
  "brome": {
    name: "Brome lent (pastilles)",
    description: "Désinfectant stable à la chaleur, peu odorant, à utiliser avec un brominateur.",
    category: "desinfection",
    url: "",
    program: "À définir",
  },
  "sel-piscine": {
    name: "Sel spécial piscine (sac de 25 kg)",
    description: "Sel raffiné pour électrolyseur, sans antimottant.",
    category: "desinfection",
    url: "",
    program: "À définir",
  },

  // ── Traitements ────────────────────────────────────────────
  "anti-algues": {
    name: "Anti-algues",
    description: "Prévient et élimine le développement des algues.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "floculant": {
    name: "Floculant (cartouches ou liquide)",
    description: "Regroupe les particules fines pour que le filtre les retienne.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "clarifiant": {
    name: "Clarifiant",
    description: "Rend l'eau cristalline en agglomérant les micro-particules.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "anti-mousse": {
    name: "Anti-mousse",
    description: "Supprime la mousse en surface en quelques minutes.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "sequestrant-metaux": {
    name: "Séquestrant métaux",
    description: "Empêche le fer, le cuivre et le manganèse de colorer l'eau et les parois.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "nettoyant-ligne-eau": {
    name: "Nettoyant ligne d'eau",
    description: "Dissout le dépôt gras et calcaire au niveau de la ligne d'eau.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "nettoyant-cellule": {
    name: "Nettoyant pour cellule d'électrolyseur",
    description: "Détartre les plaques de la cellule sans les abîmer.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "produit-hivernage": {
    name: "Hivernant liquide anti-algues et anti-calcaire",
    description: "Protège l'eau des algues et du calcaire tout l'hiver. Se verse directement dans le bassin, à la dose indiquée sur l'étiquette.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },

  // ── Analyse ────────────────────────────────────────────────
  "trousse-analyse": {
    name: "Trousse d'analyse (pH, chlore, TAC, stabilisant)",
    description: "Analyse par réactifs, plus précise que les bandelettes.",
    category: "analyse",
    url: "",
    program: "À définir",
  },
  "bandelettes": {
    name: "Bandelettes d'analyse 6 en 1",
    description: "Contrôle rapide au quotidien.",
    category: "analyse",
    url: "",
    program: "À définir",
  },
  "testeur-electronique": {
    name: "Testeur électronique (photomètre)",
    description: "Lecture numérique précise de plusieurs paramètres.",
    category: "analyse",
    url: "",
    program: "À définir",
  },
  "testeur-sel": {
    name: "Testeur de sel",
    description: "Vérifie le taux de sel pour un électrolyseur.",
    category: "analyse",
    url: "",
    program: "À définir",
  },

  // ── Filtration ─────────────────────────────────────────────
  "nettoyant-filtre": {
    name: "Nettoyant / dégraissant pour filtre",
    description: "Décrasse le sable ou la cartouche en profondeur.",
    category: "filtration",
    url: "",
    program: "À définir",
  },
  "verre-filtrant": {
    name: "Verre filtrant",
    description: "Remplace le sable : filtration plus fine et plus durable.",
    category: "filtration",
    url: "",
    program: "À définir",
  },
  "manometre": {
    name: "Manomètre de filtre",
    description: "Indique la pression du filtre pour savoir quand le laver.",
    category: "filtration",
    url: "",
    program: "À définir",
  },

  // ── Équipement ─────────────────────────────────────────────
  "robot": {
    name: "Robot de piscine électrique",
    description: "Nettoie fond et parois en autonomie.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "epuisette": {
    name: "Épuisette de fond et brosse de paroi",
    description: "Indispensables pour le nettoyage manuel.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "kit-reparation-liner": {
    name: "Kit de réparation liner (subaquatique)",
    description: "Colle et rustines utilisables sous l'eau.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "colorant-fuite": {
    name: "Colorant de détection de fuite",
    description: "Visualise l'aspiration d'eau au niveau d'une fissure ou d'une pièce à sceller.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "bache-hivernage": {
    name: "Bâche d'hivernage opaque",
    description: "Bloque la lumière et les feuilles pendant l'hiver.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "flotteurs-hivernage": {
    name: "Flotteurs d'hivernage",
    description: "Absorbent la pression de la glace sur les parois.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },

  // ── Guides d'achat (un emplacement par gamme : collez le lien du modèle choisi) ──
  "robot-entree": {
    name: "Robot électrique – entrée de gamme",
    description: "Fond seul ou fond + parois, pour bassins simples jusqu'à 8-10 m.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "robot-milieu": {
    name: "Robot électrique – milieu de gamme",
    description: "Fond, parois et ligne d'eau, programmation, filtration fine.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "robot-haut": {
    name: "Robot électrique – haut de gamme",
    description: "Navigation intelligente, chariot de transport, filtres multiples, pilotage par application.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "pac-petite": {
    name: "Pompe à chaleur Full Inverter 5 à 9 kW",
    description: "Pour bassins jusqu'à environ 40 m³ avec couverture.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "pac-moyenne": {
    name: "Pompe à chaleur Full Inverter 11 à 15 kW",
    description: "Pour bassins de 40 à 70 m³ environ avec couverture.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "pac-grande": {
    name: "Pompe à chaleur Full Inverter 17 kW et plus",
    description: "Grands bassins, saison longue ou bassin peu protégé.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "bache-bulles": {
    name: "Bâche à bulles (couverture d'été)",
    description: "Limite les pertes de chaleur nocturnes et l'évaporation.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "electrolyseur-simple": {
    name: "Électrolyseur au sel – modèle simple",
    description: "Production réglable, inversion de polarité, pour bassins jusqu'à 60-80 m³.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "electrolyseur-regulation": {
    name: "Électrolyseur avec régulation de pH intégrée",
    description: "Production de chlore et régulation automatique du pH dans un seul appareil.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "regulateur-ph": {
    name: "Régulateur de pH automatique",
    description: "Sonde et pompe doseuse qui injectent le pH moins liquide en continu.",
    category: "equipement",
    url: "",
    program: "À définir",
  },

  // ── Packs saisonniers ──────────────────────────────────────
  "pack-remise-en-route": {
    name: "Pack de remise en route",
    description: "Chlore multifonction, chlore choc, pH plus, pH moins, TAC plus et testeur : tout pour démarrer la saison.",
    category: "traitement",
    url: "",
    program: "À définir",
  },
  "pack-hivernage": {
    name: "Pack d'hivernage (gizzmos + bouchons + flotteurs)",
    description: "Protège skimmers, buses et parois de la glace. À choisir selon la taille du bassin.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },

  // ── Remise en route / entretien ────────────────────────────
  "chlore-multifonction": {
    name: "Galets de chlore multifonction",
    description: "Désinfectant, anti-algues et floculant en un seul galet, pour l'entretien courant.",
    category: "desinfection",
    url: "",
    program: "À définir",
  },
  "graisse-silicone": {
    name: "Lubrifiant silicone pour joints",
    description: "Pour les joints du préfiltre, de la vanne et des bouchons : évite prises d'air et fuites.",
    category: "filtration",
    url: "",
    program: "À définir",
  },
  "cartouche-filtre": {
    name: "Cartouche de filtre de rechange",
    description: "Avoir une cartouche d'avance permet de filtrer pendant le nettoyage de l'autre.",
    category: "filtration",
    url: "",
    program: "À définir",
  },
  "thermometre": {
    name: "Thermomètre de piscine",
    description: "Indispensable pour régler la durée de filtration (température / 2).",
    category: "analyse",
    url: "",
    program: "À définir",
  },
  "aspirateur-manuel": {
    name: "Balai aspirateur + tuyau flottant",
    description: "Pour aspirer le fond à l'égout lors de la remise en route ou après floculation.",
    category: "equipement",
    url: "",
    program: "À définir",
  },
  "nettoyant-bache": {
    name: "Nettoyant pour bâche et couverture",
    description: "Nettoie la bâche avant rangement ou en fin d'hiver, sans abîmer le PVC.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },

  // ── Hivernage ──────────────────────────────────────────────
  "gizzmo": {
    name: "Gizzmo de skimmer",
    description: "Absorbe la pression de la glace dans le skimmer. Un par skimmer.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "bouchons-hivernage": {
    name: "Bouchons d'hivernage (buses et prise balai)",
    description: "Obturent buses de refoulement et prise balai quand le niveau est abaissé.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "tendeurs-bache": {
    name: "Tendeurs et fixations de bâche",
    description: "Sandows, crochets et pitons pour tendre et fixer la bâche d'hivernage.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "pompe-vide-bache": {
    name: "Pompe vide-bâche",
    description: "Évacue l'eau de pluie accumulée sur la bâche ou le volet.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "filet-feuilles": {
    name: "Filet à feuilles",
    description: "Se pose sur la bâche pour retirer les feuilles d'un coup, sans les faire tomber dans l'eau.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "enrouleur-bache": {
    name: "Enrouleur de bâche",
    description: "Facilite la pose et le retrait de la bâche, et son rangement.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },
  "hors-gel-coffret": {
    name: "Module hors-gel pour coffret de filtration",
    description: "Lance la filtration quand il gèle. Se raccorde dans le coffret : installation par un électricien.",
    category: "hivernage",
    url: "",
    program: "À définir",
  },

  // ── Sécurité ───────────────────────────────────────────────
  "epi-chimie": {
    name: "Gants nitrile et lunettes de protection",
    description: "Protection indispensable pour manipuler les produits.",
    category: "securite",
    url: "",
    program: "À définir",
  },
} satisfies Record<string, AffiliateProduct>;

export type AffiliateKey = keyof typeof affiliates;

/** Récupère un produit par sa clé (renvoie undefined si la clé est inconnue) */
export function getAffiliate(key: string): AffiliateProduct | undefined {
  return (affiliates as Record<string, AffiliateProduct>)[key];
}
