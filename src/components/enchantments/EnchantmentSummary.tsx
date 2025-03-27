
import React from "react";
import { Book } from "lucide-react";
import { EnchantmentWithLevel } from "../types/enchantments";
import { enchantableItems } from "@/data/enchantmentsData";
import { getRomanNumeral } from "@/utils/enchantmentOptimizer";

interface EnchantmentSummaryProps {
  selectedItem: string;
  selectedEnchantments: EnchantmentWithLevel[];
  totalExperience: number;
  getItemIcon: () => React.ReactNode;
}

const EnchantmentSummary: React.FC<EnchantmentSummaryProps> = ({
  selectedItem,
  selectedEnchantments,
  totalExperience,
  getItemIcon
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Resumen de Optimización</h3>
      
      <div className="flex items-center gap-2 p-3 border rounded-md">
        {getItemIcon()}
        <span className="font-medium">
          {enchantableItems.find(i => i.id === selectedItem)?.name || "Objeto"}
        </span>
      </div>
      
      <div className="space-y-1">
        {selectedEnchantments.map((e, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <Book className="h-4 w-4 text-blue-500" />
            <span>
              {e.enchantment.name} {e.level > 1 ? ` ${getRomanNumeral(e.level)}` : ""}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-6 p-3 bg-muted rounded-md">
        <span>Costo Total:</span>
        <span className="font-bold">{totalExperience} niveles</span>
      </div>
    </div>
  );
};

export default EnchantmentSummary;
