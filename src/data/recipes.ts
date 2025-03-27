
import { CraftingRecipe } from "../types/craftingTypes";

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
