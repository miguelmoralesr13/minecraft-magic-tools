
import { CraftingItem, CraftingMaterial } from "../types/craftingTypes";

// Basic Materials
export const basicMaterials = [
  { id: "oak_log", name: "Tronco de Roble", icon: "🪵" },
  { id: "cobblestone", name: "Adoquín", icon: "🪨" },
  { id: "iron_ingot", name: "Lingote de Hierro", icon: "⚙️" },
  { id: "gold_ingot", name: "Lingote de Oro", icon: "🔶" },
  { id: "diamond", name: "Diamante", icon: "💎" },
  { id: "stick", name: "Palo", icon: "🥢" },
  { id: "string", name: "Hilo", icon: "🧵" },
  { id: "redstone", name: "Redstone", icon: "🔴" },
  { id: "leather", name: "Cuero", icon: "🥩" },
  { id: "paper", name: "Papel", icon: "📃" },
  { id: "obsidian", name: "Obsidiana", icon: "⬛" },
  { id: "blaze_rod", name: "Vara de Blaze", icon: "🔥" },
  { id: "ender_pearl", name: "Perla de Ender", icon: "🟢" },
  { id: "planks", name: "Tablones", icon: "📋" },
];

// Craftable Items
export const craftableItems: CraftingItem[] = [
  {
    id: "crafting_table",
    name: "Mesa de Crafteo",
    icon: "📦",
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 4 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "wooden_pickaxe",
    name: "Pico de Madera",
    icon: "⛏️",
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 3 },
      { id: "stick", name: "Palo", icon: "🥢", count: 2 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "stone_pickaxe",
    name: "Pico de Piedra",
    icon: "⛏️",
    materials: [
      { id: "cobblestone", name: "Adoquín", icon: "🪨", count: 3 },
      { id: "stick", name: "Palo", icon: "🥢", count: 2 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "iron_pickaxe",
    name: "Pico de Hierro",
    icon: "⛏️",
    materials: [
      { id: "iron_ingot", name: "Lingote de Hierro", icon: "⚙️", count: 3 },
      { id: "stick", name: "Palo", icon: "🥢", count: 2 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "diamond_pickaxe",
    name: "Pico de Diamante",
    icon: "⛏️",
    materials: [
      { id: "diamond", name: "Diamante", icon: "💎", count: 3 },
      { id: "stick", name: "Palo", icon: "🥢", count: 2 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "bow",
    name: "Arco",
    icon: "🏹",
    materials: [
      { id: "stick", name: "Palo", icon: "🥢", count: 3 },
      { id: "string", name: "Hilo", icon: "🧵", count: 3 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "shield",
    name: "Escudo",
    icon: "🛡️",
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 6 },
      { id: "iron_ingot", name: "Lingote de Hierro", icon: "⚙️", count: 1 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "bed",
    name: "Cama",
    icon: "🛏️",
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 3 },
      { id: "wool", name: "Lana", icon: "🧶", count: 3 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "enchanting_table",
    name: "Mesa de Encantamientos",
    icon: "📕",
    materials: [
      { id: "obsidian", name: "Obsidiana", icon: "⬛", count: 4 },
      { id: "diamond", name: "Diamante", icon: "💎", count: 2 },
      { id: "book", name: "Libro", icon: "📚", count: 1 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "ender_eye",
    name: "Ojo de Ender",
    icon: "👁️",
    materials: [
      { id: "ender_pearl", name: "Perla de Ender", icon: "🟢", count: 1 },
      { id: "blaze_powder", name: "Polvo de Blaze", icon: "✨", count: 1 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "blaze_powder",
    name: "Polvo de Blaze",
    icon: "✨",
    materials: [
      { id: "blaze_rod", name: "Vara de Blaze", icon: "🔥", count: 1 }
    ],
    craftingType: "crafting_table",
    craftingCount: 2
  },
  {
    id: "book",
    name: "Libro",
    icon: "📚",
    materials: [
      { id: "paper", name: "Papel", icon: "📃", count: 3 },
      { id: "leather", name: "Cuero", icon: "🥩", count: 1 }
    ],
    craftingType: "crafting_table",
    craftingCount: 1
  },
  {
    id: "stick",
    name: "Palo",
    icon: "🥢",
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 2 }
    ],
    craftingType: "crafting_table",
    craftingCount: 4
  },
  {
    id: "planks",
    name: "Tablones",
    icon: "📋",
    materials: [
      { id: "oak_log", name: "Tronco de Roble", icon: "🪵", count: 1 }
    ],
    craftingType: "crafting_table",
    craftingCount: 4
  }
];
