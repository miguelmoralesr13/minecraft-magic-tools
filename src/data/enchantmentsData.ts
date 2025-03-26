
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
    id: "shield",
    name: "Escudo",
    category: "armor",
    enchantability: 9
  }
];

// Enchantments data
export const enchantments: Enchantment[] = [
  {
    id: "sharpness",
    name: "Filo",
    maxLevel: 5,
    description: "Aumenta el daño de ataque",
    targetItems: ["sword"],
    conflicts: ["smite", "bane_of_arthropods"]
  },
  {
    id: "smite",
    name: "Castigo",
    maxLevel: 5,
    description: "Aumenta el daño contra no-muertos",
    targetItems: ["sword"],
    conflicts: ["sharpness", "bane_of_arthropods"]
  },
  {
    id: "bane_of_arthropods",
    name: "Perdición de los Artrópodos",
    maxLevel: 5,
    description: "Aumenta el daño contra arácnidos",
    targetItems: ["sword"],
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
    targetItems: ["pickaxe"],
    conflicts: []
  },
  {
    id: "silk_touch",
    name: "Toque de Seda",
    maxLevel: 1,
    description: "Los bloques se recogen intactos",
    targetItems: ["pickaxe"],
    conflicts: ["fortune"]
  },
  {
    id: "fortune",
    name: "Fortuna",
    maxLevel: 3,
    description: "Aumenta los drops de los bloques",
    targetItems: ["pickaxe"],
    conflicts: ["silk_touch"]
  },
  {
    id: "unbreaking",
    name: "Irrompibilidad",
    maxLevel: 3,
    description: "Aumenta la durabilidad del objeto",
    targetItems: ["sword", "pickaxe", "shield"],
    conflicts: []
  },
  {
    id: "mending",
    name: "Reparación",
    maxLevel: 1,
    description: "Repara el objeto con XP",
    targetItems: ["sword", "pickaxe", "shield"],
    conflicts: []
  },
  {
    id: "protection",
    name: "Protección",
    maxLevel: 4,
    description: "Reduce el daño de la mayoría de fuentes",
    targetItems: ["shield"],
    conflicts: ["blast_protection", "fire_protection", "projectile_protection"]
  },
  {
    id: "blast_protection",
    name: "Protección contra Explosiones",
    maxLevel: 4,
    description: "Reduce el daño de explosiones",
    targetItems: ["shield"],
    conflicts: ["protection", "fire_protection", "projectile_protection"]
  },
  {
    id: "fire_protection",
    name: "Protección contra el Fuego",
    maxLevel: 4,
    description: "Reduce el daño de fuego",
    targetItems: ["shield"],
    conflicts: ["protection", "blast_protection", "projectile_protection"]
  },
  {
    id: "projectile_protection",
    name: "Protección contra Proyectiles",
    maxLevel: 4,
    description: "Reduce el daño de proyectiles",
    targetItems: ["shield"],
    conflicts: ["protection", "blast_protection", "fire_protection"]
  }
];
