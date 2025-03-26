
import { CraftingItem } from "../types/craftingTypes";
import { craftableItems } from "../data/materials";

// Helper function to find an item by ID
export function getItemById(id: string): CraftingItem | undefined {
  return craftableItems.find(item => item.id === id);
}
