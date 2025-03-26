
import React from "react";
import { Book, Sword, Pickaxe, Shield, Axe, Helmet, ChestArmor, Trousers, Boots, FishingRod, Plus, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OptimizationStep, EnchantmentWithLevel } from "./EnchantmentOptimizer";

interface OptimizationResultProps {
  steps: OptimizationStep[];
  totalExperience: number;
}

const OptimizationResult: React.FC<OptimizationResultProps> = ({ 
  steps, 
  totalExperience 
}) => {
  // Helper to convert numbers to Roman numerals
  const getRomanNumeral = (num: number): string => {
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    return romanNumerals[num - 1] || num.toString();
  };

  // Get the appropriate icon for an item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case "sword": return <Sword className="h-5 w-5" />;
      case "pickaxe": return <Pickaxe className="h-5 w-5" />;
      case "shield": return <Shield className="h-5 w-5" />;
      case "axe": return <Axe className="h-5 w-5" />;
      case "helmet": return <Helmet className="h-5 w-5" />;
      case "chestplate": return <ChestArmor className="h-5 w-5" />;
      case "leggings": return <Trousers className="h-5 w-5" />;
      case "boots": return <Boots className="h-5 w-5" />;
      case "fishing_rod": return <FishingRod className="h-5 w-5" />;
      case "book": return <Book className="h-5 w-5" />;
      default: return <Sword className="h-5 w-5" />;
    }
  };

  // Format item name from type
  const getItemName = (type: string): string => {
    switch (type) {
      case "sword": return "Espada";
      case "pickaxe": return "Pico";
      case "shield": return "Escudo";
      case "axe": return "Hacha";
      case "helmet": return "Casco";
      case "chestplate": return "Pechera";
      case "leggings": return "Pantalones";
      case "boots": return "Botas";
      case "fishing_rod": return "Caña de Pescar";
      case "book": return "Libro de Encantamiento";
      default: return type;
    }
  };

  // Component to display enchantments
  const EnchantmentList = ({ enchantments }: { enchantments: EnchantmentWithLevel[] }) => (
    <div className="space-y-1 text-sm">
      {enchantments.map((e, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <Book className="h-3 w-3 text-blue-500" />
          <span>
            {e.enchantment.name} 
            {e.level > 1 ? ` ${getRomanNumeral(e.level)}` : ""}
          </span>
        </div>
      ))}
      {enchantments.length === 0 && (
        <span className="text-muted-foreground">Sin encantamientos</span>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {steps.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          <Book className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>Selecciona encantamientos para ver los pasos de optimización</p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[calc(100vh-350px)] pr-2">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* First item */}
                    <div className="text-center sm:w-1/3">
                      <div className="flex items-center justify-center h-12 mb-2">
                        {getItemIcon(step.firstItem.type)}
                      </div>
                      <h4 className="font-medium text-sm mb-2">
                        {getItemName(step.firstItem.type)}
                      </h4>
                      <EnchantmentList enchantments={step.firstItem.enchantments} />
                    </div>
                    
                    {/* Plus sign */}
                    <div className="flex items-center sm:w-auto">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    {/* Second item */}
                    <div className="text-center sm:w-1/3">
                      <div className="flex items-center justify-center h-12 mb-2">
                        {getItemIcon(step.secondItem.type)}
                      </div>
                      <h4 className="font-medium text-sm mb-2">
                        {getItemName(step.secondItem.type)}
                      </h4>
                      <EnchantmentList enchantments={step.secondItem.enchantments} />
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center sm:w-auto">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    {/* Result */}
                    <div className="text-center sm:w-1/3">
                      <div className="flex items-center justify-center h-12 mb-2">
                        {getItemIcon(step.result.type)}
                      </div>
                      <h4 className="font-medium text-sm mb-2">
                        {getItemName(step.result.type)}
                      </h4>
                      <EnchantmentList enchantments={step.result.enchantments} />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm">Paso {index + 1}</span>
                    <Badge variant="outline">Costo: {step.experienceCost} niveles</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex justify-between items-center p-3 bg-muted rounded-md mt-4">
            <span className="font-medium">Costo Total de Experiencia</span>
            <Badge variant="default" className="text-lg px-3 py-1">{totalExperience} niveles</Badge>
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizationResult;
