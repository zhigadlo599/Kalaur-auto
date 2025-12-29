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
    title: "Прибирання паркінгів",
    description: "Обслуговування та миття підлог у закритих і відкритих паркінгах, знежирення та видалення масляних плям.",
    icon: Building2,
    features: [
      "Миття внутрішніх підлог",
      "Прибирання відкритих паркінгів",
      "Професійне знежирення",
      "Видалення масляних плям"
    ],
    cta: "Дізнатися більше про прибирання паркінгу",
    longDescription: "Наш сервіс прибирання паркінгів пропонує комплексне рішення для підтримки паркувальних зон у бездоганному стані. Ми використовуємо професійне обладнання та екологічні засоби для досягнення оптимального результату, зберігаючи навколишнє середовище.",
    benefits: [
      "Покращення іміджу вашого закладу",
      "Зниження ризику нещасних випадків",
      "Подовження строку експлуатації покриттів",
      "Відповідність санітарним нормам"
    ],
    {
      id: 'parking-cleaning',
      title: 'Прибирання паркінгів',
      description: "Прибирання паркінгів і гаражів: видалення плям, миття під високим тиском та регулярне обслуговування.",
      features: [
        'Миття внутрішніх підлог',
        'Знежирення плям від олії',
        'Прибирання стін і стель',
        'Антибактеріальна обробка при потребі'
      ],
      cta: 'Дізнатися більше про прибирання паркінгів',
      longDescription: "Ми пропонуємо повне прибирання паркінгів, у тому числі миття під високим тиском, знежирення слідів олії та спеціальні обробки залежно від типу поверхні.",
      benefits: [
        'Підвищена безпека',
        'Відновлення зовнішнього вигляду',
        'Запобігання структурним пошкодженням',
        'Економічне обслуговування'
      ],
      {
        id: 'decontamination',
        title: 'Деконтамінація',
        description: "Деконтамінація та видалення небезпечних матеріалів: спеціалізовані втручання для небезпечних речовин.",
        features: [
          'Оцінка ризиків',
          'Видалення небезпечних матеріалів',
          'Відповідність нормам',
          'Управління відходами'
        ],
        cta: "Зв'яжіться з нами для деконтамінації",
        longDescription: "Ми здійснюємо деконтамінацію забруднених місць, включно з видаленням небезпечних матеріалів і відновленням приміщень відповідно до чинних норм.",
        benefits: [
          'Гарантована безпека',
          'Відповідність регуляціям',
          "Зниження ризику для здоров'я",
          'Швидке та безпечне втручання'
        ],
        process: [
          'Початковий діагноз',
          'Розробка плану втручання',
          'Контрольоване видалення контамінантів',
          'Очищення та відновлення',
          'Утилізація небезпечних відходів'
        ],
        equipment: [
          'Спеціалізовані засоби індивідуального захисту',
          'Інструменти для видалення',
          'Системи ізоляції',
          'Транспорт для вивезення відходів'
        ]
      },
    bannerImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'cliniques',
    title: "Прибирання клінік",
    description: "Прибирання та дезінфекція відповідно до суворих санітарних норм у медичних закладах.",
    icon: Stethoscope,
    features: [
      "Відповідність санітарним нормам",
      "Професійна дезінфекція",
      "Прибирання чутливих зон",
      "Спеціалізовані протоколи"
    ],
    cta: "Дізнатися про наш підхід до медичного прибирання",
    longDescription: "Наш сервіс прибирання для клінік відповідає суворим вимогам медичного середовища. Ми дотримуємося строгих протоколів для забезпечення стерильного та безпечного середовища.",
    benefits: [
      "Відповідність санітарним нормам",
      "Зниження ризику інфекцій",
      "Безпечне середовище",
      "Персонал, навчений медичним протоколам"
    ],
    process: [
      "Оцінка зон ризику",
      "Застосування протоколів дезінфекції",
      "Прибирання чутливих зон",
      "Перевірка критичних точок",
      "Документування робіт"
    ],
    equipment: [
      "Сертифіковані дезінфікуючі засоби",
      "Засоби індивідуального захисту",
      "Спеціалізоване приладдя для прибирання",
      "Система відстеження"
    ],
    color: "from-eco-green-500 to-eco-green-600",
    bannerImage: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 'vitrerie',
    title: "Миття вітрин",
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
    cta: "Дізнатися більше про наші роботи після надзвичайних подій",
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
      "Видалення пилу",
      "Прибирання будівельних відходів",
      "Миття вікон та скління",
      "Догляд за підлогами"
    ],
    cta: "Дізнатися про наші послуги з прибирання після будівництва",
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
    description: "Видалення небезпечних речовин (хімічних, біологічних тощо) у чутливих приміщеннях.",
    icon: Shield,
    features: [
      "Traitement des substances dangereuses",
      "Protocoles de sécurité",
      "Équipements spécialisés",
      "Personnel qualifié"
    ],
    cta: "Дізнатися більше про наші послуги з деконтамінації",
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