
export interface EnchantableItem {
  id: string;
  name: string;
  category: string;
  enchantability: number;
}

export interface Enchantment {
  id: string;
  name: string;
  maxLevel: number;
  description: string;
  targetItems: string[];
  conflicts: string[];
}

// Enchantable items data
export const enchantableItems: EnchantableItem[] = [
  {
    id: "sword",
    name: "Espada",
    category: "weapon",
    enchantability: 10
  },
  {
    id: "pickaxe",
    name: "Pico",
    category: "tool",
    enchantability: 14
  },
  {
    id: "axe",
    name: "Hacha",
    category: "tool",
    enchantability: 14
  },
  {
    id: "shield",
    name: "Escudo",
    category: "armor",
    enchantability: 9
  },
  {
    id: "helmet",
    name: "Casco",
    category: "armor",
    enchantability: 12
  },
  {
    id: "chestplate",
    name: "Pechera",
    category: "armor",
    enchantability: 12
  },
  {
    id: "leggings",
    name: "Pantalones",
    category: "armor",
    enchantability: 12
  },
  {
    id: "boots",
    name: "Botas",
    category: "armor",
    enchantability: 12
  },
  {
    id: "fishing_rod",
    name: "Caña de Pescar",
    category: "tool",
    enchantability: 14
  }
];

// Enchantments data
export const enchantments: Enchantment[] = [
  {
    id: "sharpness",
    name: "Filo",
    maxLevel: 5,
    description: "Aumenta el daño de ataque",
    targetItems: ["sword", "axe"],
    conflicts: ["smite", "bane_of_arthropods"]
  },
  {
    id: "smite",
    name: "Castigo",
    maxLevel: 5,
    description: "Aumenta el daño contra no-muertos",
    targetItems: ["sword", "axe"],
    conflicts: ["sharpness", "bane_of_arthropods"]
  },
  {
    id: "bane_of_arthropods",
    name: "Perdición de los Artrópodos",
    maxLevel: 5,
    description: "Aumenta el daño contra arácnidos",
    targetItems: ["sword", "axe"],
    conflicts: ["sharpness", "smite"]
  },
  {
    id: "knockback",
    name: "Empuje",
    maxLevel: 2,
    description: "Aumenta el retroceso",
    targetItems: ["sword"],
    conflicts: []
  },
  {
    id: "fire_aspect",
    name: "Aspecto Ígneo",
    maxLevel: 2,
    description: "Prende fuego a los objetivos",
    targetItems: ["sword"],
    conflicts: []
  },
  {
    id: "looting",
    name: "Botín",
    maxLevel: 3,
    description: "Aumenta el botín de los mobs",
    targetItems: ["sword"],
    conflicts: []
  },
  {
    id: "efficiency",
    name: "Eficiencia",
    maxLevel: 5,
    description: "Aumenta la velocidad de minado",
    targetItems: ["pickaxe", "axe", "shovel"],
    conflicts: []
  },
  {
    id: "silk_touch",
    name: "Toque de Seda",
    maxLevel: 1,
    description: "Los bloques se recogen intactos",
    targetItems: ["pickaxe", "axe", "shovel"],
    conflicts: ["fortune"]
  },
  {
    id: "fortune",
    name: "Fortuna",
    maxLevel: 3,
    description: "Aumenta los drops de los bloques",
    targetItems: ["pickaxe", "axe", "shovel"],
    conflicts: ["silk_touch"]
  },
  {
    id: "unbreaking",
    name: "Irrompibilidad",
    maxLevel: 3,
    description: "Aumenta la durabilidad del objeto",
    targetItems: ["sword", "pickaxe", "shield", "axe", "helmet", "chestplate", "leggings", "boots", "fishing_rod"],
    conflicts: []
  },
  {
    id: "mending",
    name: "Reparación",
    maxLevel: 1,
    description: "Repara el objeto con XP",
    targetItems: ["sword", "pickaxe", "shield", "axe", "helmet", "chestplate", "leggings", "boots", "fishing_rod"],
    conflicts: []
  },
  {
    id: "protection",
    name: "Protección",
    maxLevel: 4,
    description: "Reduce el daño de la mayoría de fuentes",
    targetItems: ["helmet", "chestplate", "leggings", "boots"],
    conflicts: ["blast_protection", "fire_protection", "projectile_protection"]
  },
  {
    id: "blast_protection",
    name: "Protección contra Explosiones",
    maxLevel: 4,
    description: "Reduce el daño de explosiones",
    targetItems: ["helmet", "chestplate", "leggings", "boots"],
    conflicts: ["protection", "fire_protection", "projectile_protection"]
  },
  {
    id: "fire_protection",
    name: "Protección contra el Fuego",
    maxLevel: 4,
    description: "Reduce el daño de fuego",
    targetItems: ["helmet", "chestplate", "leggings", "boots"],
    conflicts: ["protection", "blast_protection", "projectile_protection"]
  },
  {
    id: "projectile_protection",
    name: "Protección contra Proyectiles",
    maxLevel: 4,
    description: "Reduce el daño de proyectiles",
    targetItems: ["helmet", "chestplate", "leggings", "boots"],
    conflicts: ["protection", "blast_protection", "fire_protection"]
  },
  {
    id: "respiration",
    name: "Respiración",
    maxLevel: 3,
    description: "Extiende el tiempo bajo el agua",
    targetItems: ["helmet"],
    conflicts: []
  },
  {
    id: "aqua_affinity",
    name: "Afinidad Acuática",
    maxLevel: 1,
    description: "Aumenta la velocidad de minado bajo el agua",
    targetItems: ["helmet"],
    conflicts: []
  },
  {
    id: "thorns",
    name: "Espinas",
    maxLevel: 3,
    description: "Inflige daño a los atacantes",
    targetItems: ["chestplate", "helmet", "leggings", "boots"],
    conflicts: []
  },
  {
    id: "depth_strider",
    name: "Agilidad Acuática",
    maxLevel: 3,
    description: "Aumenta la velocidad de movimiento bajo el agua",
    targetItems: ["boots"],
    conflicts: ["frost_walker"]
  },
  {
    id: "frost_walker",
    name: "Paso Helado",
    maxLevel: 2,
    description: "Convierte el agua en hielo bajo tus pies",
    targetItems: ["boots"],
    conflicts: ["depth_strider"]
  },
  {
    id: "feather_falling",
    name: "Caída de Pluma",
    maxLevel: 4,
    description: "Reduce el daño por caída",
    targetItems: ["boots"],
    conflicts: []
  },
  {
    id: "lure",
    name: "Atracción",
    maxLevel: 3,
    description: "Reduce el tiempo para pescar",
    targetItems: ["fishing_rod"],
    conflicts: []
  },
  {
    id: "luck_of_the_sea",
    name: "Suerte Marina",
    maxLevel: 3,
    description: "Aumenta la probabilidad de tesoros al pescar",
    targetItems: ["fishing_rod"],
    conflicts: []
  }
];
