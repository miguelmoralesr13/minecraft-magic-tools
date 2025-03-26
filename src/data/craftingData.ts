
// This file serves as an entry point that re-exports all crafting data and utilities
// This makes migration easier since existing imports will still work

export { basicMaterials, craftableItems } from './materials';
export { craftingRecipes } from './recipes';
export { getItemById } from '../utils/itemUtils';
export { getAllMaterials, calculateOptimalCrafting } from '../utils/craftingCalculator';
