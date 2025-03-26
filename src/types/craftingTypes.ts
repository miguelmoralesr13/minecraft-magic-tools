
export interface CraftingMaterial {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface CraftingItem {
  id: string;
  name: string;
  icon: string;
  materials: CraftingMaterial[];
  craftingType: "crafting_table" | "furnace" | "smithing_table" | "stonecutter" | "other";
  craftingCount: number;
}

export interface CraftingRecipe {
  id: string;
  itemId: string;
  pattern?: string[][];
  materials: CraftingMaterial[];
  result: {
    count: number;
  };
}

export interface OptimalCraftingResult {
  item: CraftingItem;
  totalMaterials: CraftingMaterial[];
  steps: CraftingStep[];
  isOptimal: boolean;
}

export interface CraftingStep {
  description: string;
  materials: CraftingMaterial[];
  result: {
    item: CraftingItem;
    count: number;
  };
}
