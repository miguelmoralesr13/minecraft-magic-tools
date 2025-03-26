
import React from "react";
import { Book, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Enchantment, EnchantmentWithLevel } from "./EnchantmentOptimizer";

interface EnchantmentsListProps {
  enchantments: Enchantment[];
  selectedEnchantments: EnchantmentWithLevel[];
  onToggleEnchantment: (enchantment: Enchantment, level: number) => void;
}

const EnchantmentsList: React.FC<EnchantmentsListProps> = ({
  enchantments,
  selectedEnchantments,
  onToggleEnchantment
}) => {
  // Function to check if an enchantment at a specific level is selected
  const isEnchantmentSelected = (enchantmentId: string, level: number) => {
    return selectedEnchantments.some(
      e => e.enchantment.id === enchantmentId && e.level === level
    );
  };

  // Convert number to Roman numeral
  const getRomanNumeral = (num: number): string => {
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    return romanNumerals[num - 1] || num.toString();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Encantamientos Disponibles</h3>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {enchantments.map((enchantment) => (
            <div key={enchantment.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{enchantment.name}</span>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {enchantment.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-1">
                {Array.from({ length: enchantment.maxLevel }, (_, i) => i + 1).map((level) => {
                  const isSelected = isEnchantmentSelected(enchantment.id, level);
                  
                  return (
                    <Button
                      key={`${enchantment.id}-${level}`}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => onToggleEnchantment(enchantment, level)}
                    >
                      {isSelected && <Check className="h-3 w-3 mr-1" />}
                      {getRomanNumeral(level)}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {selectedEnchantments.length > 0 && (
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-2">Seleccionados:</h3>
          <div className="flex flex-wrap gap-1">
            {selectedEnchantments.map((e, index) => (
              <Badge key={index} variant="secondary">
                {e.enchantment.name} {e.level > 1 ? getRomanNumeral(e.level) : ""}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnchantmentsList;
