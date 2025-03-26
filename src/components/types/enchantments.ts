
export interface Enchantment {
  id: string;
  name: string;
  maxLevel: number;
  description: string;
  targetItems: string[];
  conflicts: string[];
}

export interface EnchantmentWithLevel {
  enchantment: Enchantment;
  level: number;
}

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
