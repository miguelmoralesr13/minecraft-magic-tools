
import { CraftingItem, CraftingRecipe } from "../types/craftingTypes";

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

// Crafting Recipes (with detailed patterns for visualization)
export const craftingRecipes: CraftingRecipe[] = [
  {
    id: "crafting_table_recipe",
    itemId: "crafting_table",
    pattern: [
      ["planks", "planks"],
      ["planks", "planks"]
    ],
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 4 }
    ],
    result: {
      count: 1
    }
  },
  {
    id: "wooden_pickaxe_recipe",
    itemId: "wooden_pickaxe",
    pattern: [
      ["planks", "planks", "planks"],
      ["empty", "stick", "empty"],
      ["empty", "stick", "empty"]
    ],
    materials: [
      { id: "planks", name: "Tablones", icon: "📋", count: 3 },
      { id: "stick", name: "Palo", icon: "🥢", count: 2 }
    ],
    result: {
      count: 1
    }
  },
  // More recipes could be added here
];

// Helper function to find an item by ID
export function getItemById(id: string): CraftingItem | undefined {
  return craftableItems.find(item => item.id === id);
}

// Helper function to get all materials needed for an item (recursive)
export function getAllMaterials(item: CraftingItem, quantity: number = 1): CraftingMaterial[] {
  const result: CraftingMaterial[] = [];
  
  // For each material in the item
  item.materials.forEach(material => {
    // Calculate how many of this material we need based on the quantity of items
    const neededCount = material.count * quantity / item.craftingCount;
    
    // Find if this material is itself craftable
    const craftableMaterial = getItemById(material.id);
    
    if (craftableMaterial) {
      // If it's craftable, get its materials recursively
      const subMaterials = getAllMaterials(craftableMaterial, neededCount);
      subMaterials.forEach(subMat => {
        // Find if we already have this material in our result
        const existingMat = result.find(m => m.id === subMat.id);
        if (existingMat) {
          existingMat.count += subMat.count;
        } else {
          result.push({...subMat});
        }
      });
    } else {
      // If it's a base material, add it directly
      const existingMat = result.find(m => m.id === material.id);
      if (existingMat) {
        existingMat.count += neededCount;
      } else {
        result.push({
          id: material.id,
          name: material.name,
          icon: material.icon,
          count: neededCount
        });
      }
    }
  });
  
  return result;
}

// Helper function to calculate optimal crafting steps
export function calculateOptimalCrafting(item: CraftingItem, quantity: number = 1): OptimalCraftingResult {
  // Start with the direct materials
  const directMaterials = item.materials.map(material => ({
    ...material,
    count: material.count * quantity / item.craftingCount
  }));
  
  // Get all materials (including sub-crafting)
  const allMaterials = getAllMaterials(item, quantity);
  
  // Calculate steps
  const steps: CraftingStep[] = [];
  
  // First step: gather all base materials
  steps.push({
    description: "Recolectar materiales básicos",
    materials: allMaterials.filter(mat => !getItemById(mat.id)),
    result: {
      item: {
        id: "gathered_materials",
        name: "Materiales Recolectados",
        icon: "🧰",
        materials: [],
        craftingType: "other",
        craftingCount: 1
      },
      count: 1
    }
  });
  
  // Recursive function to add crafting steps
  function addCraftingSteps(targetItem: CraftingItem, targetQuantity: number) {
    // If this is a basic material that doesn't need crafting, skip
    if (!targetItem.materials.length) return;
    
    // For each material that is craftable, add its crafting steps first
    targetItem.materials.forEach(material => {
      const materialItem = getItemById(material.id);
      if (materialItem) {
        // Calculate how many we need
        const neededCount = material.count * targetQuantity / targetItem.craftingCount;
        // Add crafting steps for this material
        addCraftingSteps(materialItem, neededCount);
      }
    });
    
    // Add step for crafting this item
    steps.push({
      description: `Craftear ${targetQuantity} ${targetItem.name}`,
      materials: targetItem.materials.map(material => ({
        ...material,
        count: material.count * targetQuantity / targetItem.craftingCount
      })),
      result: {
        item: targetItem,
        count: targetQuantity
      }
    });
  }
  
  // Start crafting with our target item
  addCraftingSteps(item, quantity);
  
  return {
    item,
    totalMaterials: allMaterials,
    steps: steps.filter((step, index, self) => 
      // Remove duplicated steps
      index === self.findIndex(s => s.description === step.description)
    ),
    isOptimal: true // We assume our calculation is optimal
  };
}
