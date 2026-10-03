/**
 * Catalogue des calculateurs : métadonnées SEO, texte d'introduction, FAQ et liens internes.
 * Ajouter un calculateur = ajouter une entrée ici + un composant dans components/tools
 * + une ligne dans app/calculateurs/[slug]/page.tsx (table `tools`).
 */

export interface CalculatorInfo {
  slug: string;
  /** Titre court (cartes, menus) */
  name: string;
  /** Résumé d'une ligne (cartes) */
  short: string;
  icon: "calculator" | "clock" | "gauge" | "zap" | "thermometer" | "waves" | "flask" | "repeat" | "scale";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Paragraphes explicatifs affichés sous l'outil (SEO) */
  explanation: string[];
  faq: Array<{ q: string; a: string }>;
  related: Array<{ href: string; label: string }>;
}

export const calculators: CalculatorInfo[] = [
  {
    slug: "volume",
    name: "Volume du bassin",
    short: "Rectangulaire, ronde, ovale ou forme libre.",
    icon: "calculator",
    metaTitle: "Calcul du volume d'une piscine (rectangulaire, ronde, ovale)",
    metaDescription: "Calculez le volume de votre piscine en m³ et en litres : formules pour bassin rectangulaire, rond, ovale et forme libre, avec profondeur moyenne.",
    h1: "Calculer le volume de sa piscine",
    intro: "Le volume est la base de tous les dosages de produits et du choix de la pompe.",
    explanation: [
      "Toutes les doses de produits (pH, chlore, TAC, sel) et le dimensionnement de la filtration dépendent du volume d'eau. Une erreur de 20 % sur le volume, c'est 20 % d'erreur sur chaque traitement.",
      "Mesurez la hauteur d'eau réelle, pas la hauteur des parois : sur une piscine enterrée, l'eau s'arrête généralement 10 à 15 cm sous la margelle. Pour un fond en pente, relevez la profondeur au point le moins profond et au point le plus profond : la profondeur moyenne est leur moyenne.",
    ],
    faq: [
      { q: "Comment calculer le volume d'une piscine rectangulaire ?", a: "Multipliez la longueur par la largeur et par la profondeur moyenne. Exemple : 8 × 4 × 1,5 m = 48 m³, soit 48 000 litres." },
      { q: "Comment calculer le volume d'une piscine ronde ?", a: "Volume = π × rayon² × profondeur, avec rayon = diamètre / 2. Une piscine de 4,60 m de diamètre et 1,20 m d'eau contient environ 19,9 m³." },
      { q: "Quel coefficient pour une piscine ovale ?", a: "La profession utilise 0,89 : longueur × largeur × profondeur × 0,89. Pour une ellipse parfaite, le coefficient serait 0,785." },
    ],
    related: [
      { href: "/analyse-eau", label: "Analyser mon eau avec ce volume" },
      { href: "/calculateurs/pompe", label: "Choisir le débit de pompe" },
    ],
  },
  {
    slug: "filtration",
    name: "Temps de filtration",
    short: "Combien d'heures filtrer selon la température.",
    icon: "clock",
    metaTitle: "Temps de filtration piscine : combien d'heures par jour ?",
    metaDescription: "Calculez la durée de filtration quotidienne de votre piscine selon la température de l'eau, la fréquentation et le débit de votre pompe.",
    h1: "Combien d'heures filtrer par jour ?",
    intro: "La règle de base : température de l'eau divisée par 2, avec quelques ajustements.",
    explanation: [
      "Plus l'eau est chaude, plus les algues et les bactéries se développent vite : la filtration doit donc suivre la température. La règle « température / 2 » est un bon point de départ en saison ; en hivernage actif, on passe à « température / 3 ».",
      "Vérifiez aussi le nombre de cycles : la pompe doit faire passer tout le volume au moins deux fois par jour dans le filtre. Si ce n'est pas le cas, augmentez la durée.",
    ],
    faq: [
      { q: "Combien d'heures filtrer une piscine à 26 °C ?", a: "Environ 13 heures par jour (26 / 2), réparties principalement sur les heures chaudes de la journée." },
      { q: "Faut-il filtrer la nuit ?", a: "L'essentiel de la filtration doit avoir lieu en journée, quand le soleil détruit le chlore. Une plage de nuit (heures creuses) peut compléter, sans la remplacer." },
      { q: "Quand filtrer 24 h/24 ?", a: "Au-delà de 30 °C, après un orage, une forte fréquentation ou un traitement choc." },
    ],
    related: [
      { href: "/blog/heures-filtration-piscine", label: "Guide : combien d'heures filtrer sa piscine" },
      { href: "/calculateurs/consommation", label: "Estimer le coût de la filtration" },
    ],
  },
  {
    slug: "pompe",
    name: "Dimensionnement de pompe",
    short: "Débit et puissance indicative pour votre volume.",
    icon: "gauge",
    metaTitle: "Quelle pompe pour ma piscine ? Débit et puissance",
    metaDescription: "Calculez le débit de pompe conseillé pour votre piscine (renouvellement en 4 à 6 h) et obtenez une puissance indicative et le diamètre de filtre associé.",
    h1: "Dimensionner la pompe de filtration",
    intro: "Le débit doit permettre de filtrer tout le volume en 4 à 6 heures.",
    explanation: [
      "Le bon débit de pompe permet de renouveler tout le volume d'eau en 4 à 6 heures. Une pompe trop faible filtre mal ; une pompe trop puissante consomme plus, use le filtre et peut dépasser la vitesse de filtration admissible du sable (environ 50 m³/h par m² de surface filtrante).",
      "La puissance en CV n'est qu'un ordre de grandeur : le débit réel dépend de la hauteur manométrique (pertes de charge des canalisations, du filtre et des équipements). Vérifiez toujours la courbe débit / hauteur du fabricant.",
    ],
    faq: [
      { q: "Quelle puissance de pompe pour une piscine de 50 m³ ?", a: "Il faut un débit de 8,3 à 12,5 m³/h, ce qui correspond le plus souvent à une pompe de 0,75 CV associée à un filtre à sable de 560 à 600 mm, selon l'installation." },
      { q: "Une pompe plus puissante filtre-t-elle mieux ?", a: "Non. Au-delà du débit admissible du filtre, l'eau traverse le sable trop vite et la filtration se dégrade, tout en consommant davantage." },
    ],
    related: [
      { href: "/calculateurs/volume", label: "Calculer le volume du bassin" },
      { href: "/guide-electrique", label: "Guide électrique de la piscine" },
    ],
  },
  {
    slug: "consommation",
    name: "Consommation électrique",
    short: "Coût de la filtration sur la saison.",
    icon: "zap",
    metaTitle: "Consommation électrique d'une pompe de piscine : calcul du coût",
    metaDescription: "Calculez la consommation électrique de la pompe de piscine en kWh et en euros selon sa puissance, la durée de filtration et le prix du kWh.",
    h1: "Consommation électrique de la filtration",
    intro: "Estimez les kWh et le coût de votre pompe sur la saison.",
    explanation: [
      "La consommation d'une pompe se calcule simplement : puissance absorbée (W) × heures de fonctionnement × nombre de jours / 1 000 = kWh. Multipliez ensuite par le prix du kWh de votre contrat.",
      "Utilisez la puissance absorbée P1, indiquée sur la plaque signalétique du moteur, et non la puissance utile en CV, qui est plus faible.",
    ],
    faq: [
      { q: "Combien consomme une pompe de piscine ?", a: "Une pompe de 0,75 CV absorbe souvent 750 à 900 W. À 10 h par jour pendant 150 jours, cela représente 1 100 à 1 350 kWh environ." },
      { q: "Comment réduire la consommation de la filtration ?", a: "Adaptez la durée à la température de l'eau, gardez le filtre propre, et envisagez une pompe à vitesse variable, qui consomme beaucoup moins à bas régime." },
    ],
    related: [
      { href: "/calculateurs/filtration", label: "Calculer le temps de filtration" },
      { href: "/blog/heures-filtration-piscine", label: "Guide : bien régler sa filtration" },
    ],
  },
  {
    slug: "pompe-a-chaleur",
    name: "Pompe à chaleur",
    short: "Puissance de PAC selon volume, région et couverture.",
    icon: "thermometer",
    metaTitle: "Quelle puissance de pompe à chaleur pour ma piscine ? Calculateur",
    metaDescription: "Calculez la puissance de pompe à chaleur adaptée à votre piscine selon le volume, la région, la période de baignade et la couverture. Temps de mise en température inclus.",
    h1: "Quelle pompe à chaleur pour ma piscine ?",
    intro: "Volume, région, saison et couverture : obtenez la puissance conseillée et le temps de mise en température.",
    explanation: [
      "La puissance d'une pompe à chaleur se choisit selon le volume du bassin, mais surtout selon les pertes de chaleur : une piscine non couverte perd une grande partie de la chaleur produite pendant la nuit. La couverture est donc le premier levier d'économie, avant même la puissance de la PAC.",
      "Notre calcul part d'une puissance de référence de 0,2 kW par m³ (bassin extérieur, région tempérée, baignade de mai à septembre, bâche à bulles, eau à 27 °C), corrigée selon vos réponses. Le résultat est une puissance restituée à comparer aux fiches techniques dans les conditions air 15 °C / eau 26 °C.",
    ],
    faq: [
      { q: "Quelle puissance de PAC pour une piscine de 50 m³ ?", a: "Pour une baignade de mai à septembre avec bâche à bulles, dans une région tempérée, comptez environ 10 kW restitués à air 15 °C, soit un modèle de 11 kW. Sans couverture, le besoin augmente d'environ 40 %." },
      { q: "Combien de temps pour chauffer une piscine ?", a: "Chauffer 1 m³ d'eau de 1 °C demande 1,163 kWh. Pour passer 50 m³ de 15 à 27 °C, il faut environ 700 kWh, soit 3 à 4 jours de fonctionnement continu avec une PAC de 11 kW, bassin couvert." },
      { q: "Une pompe à chaleur doit-elle être raccordée par un électricien ?", a: "Oui : elle nécessite un circuit dédié, une protection adaptée et un différentiel 30 mA du type prescrit par le fabricant. Le raccordement doit être réalisé par un électricien qualifié." },
    ],
    related: [
      { href: "/blog/choisir-pompe-a-chaleur-piscine", label: "Guide d'achat : bien choisir sa pompe à chaleur" },
      { href: "/trouver-un-professionnel?besoin=electricite", label: "Faire raccorder une PAC par un électricien" },
    ],
  },
  {
    slug: "sel",
    name: "Sel pour électrolyseur",
    short: "Quantité de sel à ajouter, en kg et en sacs.",
    icon: "waves",
    metaTitle: "Combien de sel mettre dans sa piscine ? Calculateur électrolyseur",
    metaDescription: "Calculez la quantité de sel à ajouter dans votre piscine au sel selon le volume, le taux mesuré et le taux conseillé par votre électrolyseur.",
    h1: "Combien de sel ajouter dans ma piscine ?",
    intro: "Le calcul exact en kilos et en sacs de 25 kg, selon le taux conseillé par votre électrolyseur.",
    explanation: [
      "La quantité de sel se calcule directement : (taux visé − taux mesuré) en g/L × volume en m³ = kg de sel. Pour une première mise en eau, le taux mesuré est proche de zéro.",
      "Le taux conseillé dépend de l'appareil (souvent 3 à 5 g/L, parfois 1,5 à 2 g/L pour les modèles « bas sel »). Mesurez avec un testeur fiable : l'affichage de l'électrolyseur peut être faussé par une cellule entartrée ou une eau froide.",
    ],
    faq: [
      { q: "Combien de sel pour une piscine de 50 m³ ?", a: "Pour une première mise en eau à 4 g/L : 4 × 50 = 200 kg, soit 8 sacs de 25 kg. Pour remonter de 3 à 4 g/L : 50 kg, soit 2 sacs." },
      { q: "Peut-on mettre trop de sel ?", a: "Oui. Un excès favorise la corrosion et peut déclencher une alarme. Le sel ne s'élimine qu'en renouvelant une partie de l'eau : mieux vaut sous-doser puis compléter." },
    ],
    related: [
      { href: "/blog/electrolyseur-sel-piscine", label: "Électrolyseur au sel : fonctionnement et entretien" },
      { href: "/depannage/electrolyseur-ne-produit-plus", label: "Mon électrolyseur ne produit plus" },
    ],
  },
  {
    slug: "chlore-choc",
    name: "Traitement choc",
    short: "Dose de chlore choc selon la situation et le produit.",
    icon: "flask",
    metaTitle: "Chlore choc : quelle dose pour ma piscine ? Calculateur",
    metaDescription: "Calculez la dose de chlore choc (dichlore, hypochlorite de calcium ou chlore liquide) selon le volume, l'état de l'eau et le taux de stabilisant.",
    h1: "Quelle dose de chlore choc ?",
    intro: "Préventif, eau trouble ou eau verte : la bonne dose selon votre produit, en tenant compte du stabilisant.",
    explanation: [
      "Un traitement choc consiste à monter très fortement le taux de chlore libre pour détruire algues, bactéries et chloramines. Le niveau à atteindre dépend de la situation : environ 5 mg/L en préventif, 10 mg/L pour une eau trouble, 15 à 20 mg/L pour une eau verte.",
      "Le stabilisant freine l'action du chlore : plus il est élevé, plus il faut viser haut. Et le choix du produit compte : le dichlore ajoute du stabilisant à chaque choc (environ 0,9 mg/L par mg/L de chlore), alors que le chlore liquide et l'hypochlorite de calcium n'en ajoutent pas.",
    ],
    faq: [
      { q: "Quelle quantité de chlore choc pour 50 m³ ?", a: "Pour monter le chlore de 0 à 10 mg/L avec un dichlore à 56 % : 50 × 10 / 0,56 ≈ 890 g. Le calculateur ajuste la dose selon votre situation, votre produit et votre stabilisant." },
      { q: "Quel chlore choc choisir ?", a: "Le dichlore est pratique mais ajoute du stabilisant. Si votre taux d'acide cyanurique dépasse 50 mg/L, préférez le chlore liquide ou l'hypochlorite de calcium." },
      { q: "Quand peut-on se baigner après un chlore choc ?", a: "Quand le chlore libre est redescendu entre 1 et 3 mg/L, généralement 24 à 72 heures après, selon la dose et l'ensoleillement." },
    ],
    related: [
      { href: "/depannage/eau-verte", label: "Assistant : eau verte" },
      { href: "/blog/piscine-verte-rattraper", label: "Rattraper une piscine verte" },
    ],
  },
  {
    slug: "convertisseur",
    name: "Convertisseur d'unités",
    short: "°f, mg/L, °dH, °chl : toutes les conversions.",
    icon: "repeat",
    metaTitle: "Convertisseur piscine : °f en mg/L, degré chlorométrique en %",
    metaDescription: "Convertissez le TAC et le TH (°f, mg/L, ppm, °dH, mmol/L) et le chlore liquide (degré chlorométrique, g/L, % de chlore actif).",
    h1: "Convertisseur d'unités piscine",
    intro: "°f, mg/L, ppm, °dH, °chl : passez d'une unité à l'autre en un instant.",
    explanation: [
      "Selon les trousses d'analyse et les fabricants, le TAC et la dureté s'expriment en degrés français (°f), en mg/L (ou ppm) de carbonate de calcium, ou en degrés allemands (°dH). Nos outils utilisent les mg/L : 1 °f = 10 mg/L.",
      "Pour le chlore liquide, les bidons indiquent souvent un degré chlorométrique (°chl). Un degré correspond à environ 3,17 g de chlore actif par litre.",
    ],
    faq: [
      { q: "Comment convertir des °f en mg/L ?", a: "Multipliez par 10 : un TAC de 12 °f correspond à 120 mg/L." },
      { q: "Que signifie 48 °chl sur un bidon de chlore ?", a: "Le produit contient environ 48 × 3,17 ≈ 152 g de chlore actif par litre." },
    ],
    related: [
      { href: "/analyse-eau", label: "Analyser mon eau" },
      { href: "/blog/tac-piscine-explique", label: "Le TAC expliqué simplement" },
    ],
  },
  {
    slug: "indice-langelier",
    name: "Indice de Langelier",
    short: "Votre eau est-elle agressive ou entartrante ?",
    icon: "scale",
    metaTitle: "Indice de Langelier piscine : eau agressive ou entartrante ?",
    metaDescription: "Calculez l'indice de saturation de Langelier de l'eau de votre piscine (pH, température, dureté, TAC, stabilisant) et découvrez si elle est agressive ou entartrante.",
    h1: "Indice de Langelier : votre eau est-elle équilibrée ?",
    intro: "L'outil des professionnels pour savoir si l'eau attaque le revêtement ou dépose du tartre.",
    explanation: [
      "Une eau peut avoir un pH correct et rester déséquilibrée. L'indice de saturation de Langelier (ISL) combine pH, température, dureté calcique, alcalinité et solides dissous pour indiquer si l'eau tend à dissoudre le calcaire (eau agressive) ou à le déposer (eau entartrante).",
      "C'est particulièrement utile pour les piscines carrelées ou enduites, les eaux très douces ou très dures, et les installations équipées d'un électrolyseur ou d'une pompe à chaleur, dont la cellule et l'échangeur s'entartrent vite. Pensez à refaire le calcul quand la température de l'eau change : une eau équilibrée à 20 °C peut devenir entartrante à 30 °C.",
    ],
    faq: [
      { q: "Quelle est la bonne valeur de l'indice de Langelier ?", a: "Entre −0,3 et +0,3, l'eau est considérée comme équilibrée. En dessous, elle est agressive ; au-dessus, entartrante." },
      { q: "Comment corriger une eau agressive ?", a: "Augmentez progressivement le pH dans la plage recommandée, puis le TAC ou la dureté calcique si nécessaire." },
      { q: "Pourquoi tenir compte du stabilisant ?", a: "Les tests de TAC mesurent aussi une partie du stabilisant (environ un tiers de sa valeur à pH 7,5). L'indice utilise l'alcalinité carbonatée seule, corrigée de cette part." },
    ],
    related: [
      { href: "/depannage/depots-tartre", label: "Assistant : dépôts et tartre" },
      { href: "/blog/tac-piscine-explique", label: "Le TAC expliqué simplement" },
    ],
  },
];

export function getCalculator(slug: string): CalculatorInfo | undefined {
  return calculators.find((c) => c.slug === slug);
}
