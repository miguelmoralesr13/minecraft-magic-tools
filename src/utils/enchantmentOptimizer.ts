
import { Enchantment, EnchantmentWithLevel } from "@/components/types/enchantments";

export interface OptimizationStep {
  firstItem: {
    type: string;
    enchantments: EnchantmentWithLevel[];
  };
  secondItem: {
    type: string;
    enchantments: EnchantmentWithLevel[];
  };
  result: {
    type: string;
    enchantments: EnchantmentWithLevel[];
  };
  experienceCost: number;
}

export function calculateOptimizationSteps(
  selectedEnchantments: EnchantmentWithLevel[],
  selectedItem: string
): { steps: OptimizationStep[], totalCost: number } {
  if (selectedEnchantments.length === 0) {
    return { steps: [], totalCost: 0 };
  }

  const steps: OptimizationStep[] = [];
  let totalCost = 0;
  
  let currentItem = {
    type: selectedItem,
    enchantments: []
  };
  
  const sortedEnchantments = [...selectedEnchantments].sort((a, b) => b.level - a.level);
  
  for (const enchWithLevel of sortedEnchantments) {
    const enchantmentCost = 2 * enchWithLevel.level + 1;
    
    const step: OptimizationStep = {
      firstItem: { ...currentItem, enchantments: [...currentItem.enchantments] },
      secondItem: {
        type: "book",
        enchantments: [enchWithLevel]
      },
      result: {
        type: selectedItem,
        enchantments: [...currentItem.enchantments, enchWithLevel]
      },
      experienceCost: enchantmentCost
    };
    
    steps.push(step);
    totalCost += enchantmentCost;
    currentItem = step.result;
  }
  
  return { steps, totalCost };
}

export function getRomanNumeral(num: number): string {
  const romanNumerals = ["I", "II", "III", "IV", "V"];
  return romanNumerals[num - 1] || num.toString();
}

export function checkEnchantmentConflicts(
  enchantment: Enchantment,
  selectedEnchantments: EnchantmentWithLevel[]
): boolean {
  return selectedEnchantments.some(e => 
    enchantment.conflicts.includes(e.enchantment.id)
  );
}
