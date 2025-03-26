import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Sword, Pickaxe, Shield, Axe, HardHat, Shirt, Bot, Cast } from "lucide-react";
import { toast } from "sonner";
import EnchantmentsList from "./EnchantmentsList";
import OptimizationResult from "./OptimizationResult";
import { enchantableItems, enchantments } from "@/data/enchantmentsData";

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

const EnchantmentOptimizer: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("sword");
  const [selectedEnchantments, setSelectedEnchantments] = useState<EnchantmentWithLevel[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationStep[]>([]);
  const [totalExperience, setTotalExperience] = useState<number>(0);

  const availableEnchantments = enchantments.filter(
    (enchantment) => enchantment.targetItems.includes(selectedItem)
  );

  const handleItemSelect = (value: string) => {
    setSelectedItem(value);
    setSelectedEnchantments(prevEnchantments => 
      prevEnchantments.filter(e => 
        enchantments.find(ench => ench.id === e.enchantment.id)?.targetItems.includes(value)
      )
    );
  };

  const toggleEnchantment = (enchantment: Enchantment, level: number) => {
    setSelectedEnchantments(prev => {
      const existingIndex = prev.findIndex(e => e.enchantment.id === enchantment.id);
      
      if (existingIndex >= 0) {
        if (prev[existingIndex].level === level) {
          const updated = prev.filter(e => e.enchantment.id !== enchantment.id);
          return updated;
        }
        const updated = [...prev];
        updated[existingIndex] = { enchantment, level };
        return updated;
      }
      
      const hasConflict = prev.some(e => 
        enchantment.conflicts.includes(e.enchantment.id)
      );
      
      if (hasConflict) {
        toast.error("Este encantamiento tiene conflictos con otro ya seleccionado");
        return prev;
      }
      
      return [...prev, { enchantment, level }];
    });
  };

  useEffect(() => {
    if (selectedEnchantments.length === 0) {
      setOptimizationResults([]);
      setTotalExperience(0);
      return;
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
    
    setOptimizationResults(steps);
    setTotalExperience(totalCost);
  }, [selectedEnchantments, selectedItem]);

  const getItemIcon = () => {
    switch (selectedItem) {
      case "sword": return <Sword className="h-5 w-5" />;
      case "pickaxe": return <Pickaxe className="h-5 w-5" />;
      case "shield": return <Shield className="h-5 w-5" />;
      case "axe": return <Axe className="h-5 w-5" />;
      case "helmet": return <HardHat className="h-5 w-5" />;
      case "chestplate": return <Shirt className="h-5 w-5" />;
      case "leggings": return <Bot className="h-5 w-5" />;
      case "boots": return <Bot className="h-5 w-5" />;
      case "fishing_rod": return <Cast className="h-5 w-5" />;
      default: return <Sword className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Card className="p-4 md:w-1/3 flex-shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <Label htmlFor="item" className="text-sm font-medium mb-2 block">
              Selecciona un Objeto
            </Label>
            <Select value={selectedItem} onValueChange={handleItemSelect}>
              <SelectTrigger className="w-full" id="item">
                <SelectValue placeholder="Selecciona un objeto" />
              </SelectTrigger>
              <SelectContent>
                {enchantableItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex items-center gap-2">
                      {item.id === "sword" && <Sword className="h-4 w-4" />}
                      {item.id === "pickaxe" && <Pickaxe className="h-4 w-4" />}
                      {item.id === "shield" && <Shield className="h-4 w-4" />}
                      {item.id === "axe" && <Axe className="h-4 w-4" />}
                      {item.id === "helmet" && <HardHat className="h-4 w-4" />}
                      {item.id === "chestplate" && <Shirt className="h-4 w-4" />}
                      {item.id === "leggings" && <Bot className="h-4 w-4" />}
                      {item.id === "boots" && <Bot className="h-4 w-4" />}
                      {item.id === "fishing_rod" && <Cast className="h-4 w-4" />}
                      {item.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <EnchantmentsList
            enchantments={availableEnchantments}
            selectedEnchantments={selectedEnchantments}
            onToggleEnchantment={toggleEnchantment}
          />
        </div>
      </Card>

      <div className="flex-grow">
        <Card className="w-full h-full p-4">
          <Tabs defaultValue="steps" className="w-full">
            <TabsList>
              <TabsTrigger value="steps">Pasos de Aplicación</TabsTrigger>
              <TabsTrigger value="summary">Resumen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps" className="pt-4">
              <OptimizationResult 
                steps={optimizationResults}
                totalExperience={totalExperience}
              />
            </TabsContent>
            
            <TabsContent value="summary" className="pt-4">
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
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

function getRomanNumeral(num: number): string {
  const romanNumerals = ["I", "II", "III", "IV", "V"];
  return romanNumerals[num - 1] || num.toString();
}

export default EnchantmentOptimizer;
