import { Building2, Briefcase, Stethoscope, Wind, Flame, HardHat, Bug, Shield, LucideIcon } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  cta: string;
  longDescription: string;
  benefits: string[];
  process: string[];
  equipment: string[];
  color: string;
  bannerImage: string;
}

export const services: Service[] = [
  {
    id: 'parking',
    title: "Nettoyage Parking",
    description: "Обслуговування та миття підлог у закритих і відкритих паркінгах, знежирення та видалення масляних плям.",
    icon: Building2,
    features: [
      "Lavage des sols intérieurs",
      "Nettoyage des parkings extérieurs",
      "Dégraissage professionnel",
      "Suppression des traces d'huile"
    ],
    cta: "En savoir plus sur le nettoyage de parking",
    longDescription: "Notre service de nettoyage de parking offre une solution complète pour maintenir vos espaces de stationnement impeccables. Nous utilisons des équipements professionnels et des produits écologiques pour garantir un résultat optimal tout en préservant l'environnement.",
    benefits: [
      "Amélioration de l'image de votre établissement",
      "Réduction des risques d'accidents",
      "Prolongation de la durée de vie des revêtements",
      "Conformité aux normes d'hygiène"
    ],
    process: [
      "Inspection préliminaire des lieux",
      "Déblayage et préparation de la zone",
      "Application de produits dégraissants",
      "Lavage haute pression",
      "Nettoyage des murs et piliers",
      "Inspection finale"
    ],
    equipment: [
      "Laveuses haute pression",
      "Balayeuses mécaniques",
      "Aspirateurs industriels",
      "Produits dégraissants écologiques"
    ],
    color: "from-eco-green-500 to-eco-green-600",
    bannerImage: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'bureaux',
    title: "Nettoyage Bureaux",
    description: "Entretien des espaces de travail : postes, sols, sanitaires, salles de réunion, etc.",
    icon: Briefcase,
    features: [
      "Nettoyage des postes de travail",
      "Entretien des sanitaires",
      "Nettoyage des salles de réunion",
      "Entretien des sols"
    ],
    cta: "Découvrir nos services de nettoyage de bureaux",
    longDescription: "Notre service de nettoyage de bureaux est conçu pour maintenir un environnement de travail sain et agréable. Nous adaptons nos interventions à vos horaires et à vos besoins spécifiques.",
    benefits: [
      "Environnement de travail sain",
      "Productivité accrue",
      "Image professionnelle",
      "Flexibilité des horaires"
    ],
    process: [
      "Désinfection des surfaces de contact",
      "Nettoyage des postes de travail",
      "Entretien des espaces communs",
      "Nettoyage des sanitaires",
      "Entretien des sols"
    ],
    equipment: [
      "Produits désinfectants écologiques",
      "Matériel de microfibre",
      "Aspirateurs HEPA",
      "Monobrosses"
    ],
    color: "from-eco-green-600 to-eco-green-700",
    bannerImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'cliniques',
    title: "Nettoyage Cliniques",
    description: "Nettoyage et désinfection selon les normes sanitaires strictes en environnement médicalisé.",
    icon: Stethoscope,
    features: [
      "Respect des normes sanitaires",
      "Désinfection professionnelle",
      "Nettoyage des zones sensibles",
      "Protocoles spécifiques"
    ],
    cta: "Notre approche du nettoyage médical",
    longDescription: "Notre service de nettoyage pour cliniques répond aux exigences strictes du milieu médical. Nous suivons des protocoles rigoureux pour garantir un environnement stérile et sécurisé.",
    benefits: [
      "Conformité aux normes sanitaires",
      "Réduction des risques d'infections",
      "Environnement sécurisé",
      "Personnel formé aux protocoles médicaux"
    ],
    process: [
      "Évaluation des zones à risque",
      "Application des protocoles de désinfection",
      "Nettoyage des zones sensibles",
      "Vérification des points critiques",
      "Documentation des interventions"
    ],
    equipment: [
      "Produits désinfectants certifiés",
      "Équipements de protection",
      "Matériel de nettoyage dédié",
      "Système de traçabilité"
    ],
    color: "from-eco-green-500 to-eco-green-600",
    bannerImage: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'vitrerie',
    title: "Nettoyage Vitrerie",
    description: "Lavage de vitres intérieures/extérieures, en hauteur ou non, avec ou sans accès spécifique.",
    icon: Wind,
    features: [
      "Vitres intérieures et extérieures",
      "Nettoyage en hauteur",
      "Équipements spécialisés",
      "Techniques professionnelles"
    ],
    cta: "Explorez nos services de vitrerie",
    longDescription: "Notre service de nettoyage de vitrerie assure une transparence parfaite de vos vitres, quelle que soit leur hauteur ou leur accessibilité. Nous utilisons des techniques et équipements adaptés à chaque situation.",
    benefits: [
      "Meilleure luminosité",
      "Image professionnelle",
      "Techniques sécurisées",
      "Résultats impeccables"
    ],
    process: [
      "Évaluation des accès",
      "Préparation de la zone",
      "Nettoyage des cadres",
      "Lavage des vitres",
      "Inspection finale"
    ],
    equipment: [
      "Équipements de levage",
      "Raclettes professionnelles",
      "Produits spécifiques",
      "Matériel de sécurité"
    ],
    color: "from-eco-green-600 to-eco-green-700",
    bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'sinistres',
    title: "Прибирання після надзвичайних подій",
    description: "Remise en état après incendie, inondation ou dégât matériel important.",
    icon: Flame,
    features: [
      "Intervention post-incendie",
      "Nettoyage après inondation",
      "Remise en état complète",
      "Traitement des dégâts"
    ],
    cta: "En savoir plus sur nos interventions post-sinistre",
    longDescription: "Notre service de nettoyage post-sinistre intervient rapidement pour remettre en état vos locaux après un sinistre. Nous disposons des équipements et du savoir-faire nécessaires pour traiter tous types de dégâts.",
    benefits: [
      "Intervention rapide",
      "Expertise technique",
      "Traitement complet",
      "Accompagnement administratif"
    ],
    process: [
      "Évaluation des dégâts",
      "Sécurisation des lieux",
      "Extraction des débris",
      "Nettoyage approfondi",
      "Désinfection",
      "Remise en état"
    ],
    equipment: [
      "Équipements de décontamination",
      "Extracteurs d'eau",
      "Déshumidificateurs",
      "Matériel de protection"
    ],
    color: "from-eco-green-500 to-eco-green-600",
    bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'chantier',
    title: "Nettoyage de Chantier",
    description: "Nettoyage en fin de travaux : poussières, gravats, vitrages, sols, etc.",
    icon: HardHat,
    features: [
      "Élimination des poussières",
      "Nettoyage des gravats",
      "Lavage des vitrages",
      "Entretien des sols"
    ],
    cta: "Découvrir nos services de nettoyage de chantier",
    longDescription: "Notre service de nettoyage de fin de chantier assure une remise en état impeccable de vos locaux après des travaux. Nous intervenons avec des équipements adaptés pour éliminer tous types de résidus de construction.",
    benefits: [
      "Livraison clé en main",
      "Élimination complète des résidus",
      "Respect des délais",
      "Protection des finitions"
    ],
    process: [
      "Évaluation des zones",
      "Élimination des déchets",
      "Nettoyage des poussières",
      "Lavage des surfaces",
      "Inspection finale"
    ],
    equipment: [
      "Aspirateurs industriels",
      "Équipements de protection",
      "Produits spécifiques",
      "Matériel de levage"
    ],
    color: "from-eco-green-600 to-eco-green-700",
    bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'desinfection',
    title: "Désinfection et Dératisation",
    description: "Traitement des locaux contre les bactéries, virus, nuisibles (rats, souris, insectes).",
    icon: Bug,
    features: [
      "Traitement anti-nuisibles",
      "Désinfection complète",
      "Solutions écologiques",
      "Protection durable"
    ],
    cta: "Notre approche de la désinfection",
    longDescription: "Notre service de désinfection et dératisation utilise des méthodes respectueuses de l'environnement pour éliminer les nuisibles et assainir vos locaux. Nous proposons des solutions durables et efficaces.",
    benefits: [
      "Solutions écologiques",
      "Protection durable",
      "Expertise technique",
      "Suivi personnalisé"
    ],
    process: [
      "Diagnostic initial",
      "Identification des nuisibles",
      "Application des traitements",
      "Mise en place de prévention",
      "Suivi régulier"
    ],
    equipment: [
      "Produits certifiés",
      "Équipements de pulvérisation",
      "Pièges professionnels",
      "Matériel de détection"
    ],
    color: "from-eco-green-500 to-eco-green-600",
    bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'decontamination',
    title: "Décontamination",
    description: "Élimination des substances dangereuses (chimiques, biologiques…) dans les environnements sensibles.",
    icon: Shield,
    features: [
      "Traitement des substances dangereuses",
      "Protocoles de sécurité",
      "Équipements spécialisés",
      "Personnel qualifié"
    ],
    cta: "En savoir plus sur nos services de décontamination",
    longDescription: "Notre service de décontamination intervient dans les environnements sensibles pour éliminer les substances dangereuses. Nous suivons des protocoles stricts pour garantir la sécurité de tous.",
    benefits: [
      "Expertise technique",
      "Sécurité maximale",
      "Conformité réglementaire",
      "Intervention rapide"
    ],
    process: [
      "Analyse des risques",
      "Mise en place du périmètre",
      "Application des protocoles",
      "Traitement des zones",
      "Vérification finale"
    ],
    equipment: [
      "Équipements de protection",
      "Matériel de détection",
      "Produits neutralisants",
      "Système de confinement"
    ],
    color: "from-eco-green-600 to-eco-green-700",
    bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80"
  }
]; 