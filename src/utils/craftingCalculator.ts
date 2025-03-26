
import { CraftingItem, CraftingMaterial, OptimalCraftingResult, CraftingStep } from "../types/craftingTypes";
import { getItemById } from "./itemUtils";

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
