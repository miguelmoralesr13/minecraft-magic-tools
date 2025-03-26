
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Sword, Pickaxe, Shield, Axe, Helmet, ChestArmor, Trousers, Boots, FishingRod } from "lucide-react";
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

  // Filter enchantments based on selected item
  const availableEnchantments = enchantments.filter(
    (enchantment) => enchantment.targetItems.includes(selectedItem)
  );

  // Handler for item selection
  const handleItemSelect = (value: string) => {
    setSelectedItem(value);
    // Clear previously selected enchantments that aren't compatible with new item
    setSelectedEnchantments(prevEnchantments => 
      prevEnchantments.filter(e => 
        enchantments.find(ench => ench.id === e.enchantment.id)?.targetItems.includes(value)
      )
    );
  };

  // Handler for enchantment selection toggle
  const toggleEnchantment = (enchantment: Enchantment, level: number) => {
    setSelectedEnchantments(prev => {
      // Check if this enchantment is already selected
      const existingIndex = prev.findIndex(e => e.enchantment.id === enchantment.id);
      
      if (existingIndex >= 0) {
        // If same level, remove it
        if (prev[existingIndex].level === level) {
          const updated = prev.filter(e => e.enchantment.id !== enchantment.id);
          return updated;
        }
        // If different level, update it
        const updated = [...prev];
        updated[existingIndex] = { enchantment, level };
        return updated;
      }
      
      // Check for conflicts
      const hasConflict = prev.some(e => 
        enchantment.conflicts.includes(e.enchantment.id)
      );
      
      if (hasConflict) {
        toast.error("Este encantamiento tiene conflictos con otro ya seleccionado");
        return prev;
      }
      
      // Add new enchantment
      return [...prev, { enchantment, level }];
    });
  };

  // Optimize enchantments - now runs automatically when selectedEnchantments changes
  useEffect(() => {
    if (selectedEnchantments.length === 0) {
      setOptimizationResults([]);
      setTotalExperience(0);
      return;
    }

    // This is a simplified algorithm - in reality, this would be more complex
    const steps: OptimizationStep[] = [];
    let totalCost = 0;
    
    // For demonstration, we'll create a simple linear application of enchantments
    let currentItem = {
      type: selectedItem,
      enchantments: []
    };
    
    // Sort enchantments by level (higher levels first)
    const sortedEnchantments = [...selectedEnchantments].sort((a, b) => b.level - a.level);
    
    for (const enchWithLevel of sortedEnchantments) {
      const enchantmentCost = 2 * enchWithLevel.level + 1; // Simple cost model
      
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

  // Icon based on item type
  const getItemIcon = () => {
    switch (selectedItem) {
      case "sword": return <Sword className="h-5 w-5" />;
      case "pickaxe": return <Pickaxe className="h-5 w-5" />;
      case "shield": return <Shield className="h-5 w-5" />;
      case "axe": return <Axe className="h-5 w-5" />;
      case "helmet": return <Helmet className="h-5 w-5" />;
      case "chestplate": return <ChestArmor className="h-5 w-5" />;
      case "leggings": return <Trousers className="h-5 w-5" />;
      case "boots": return <Boots className="h-5 w-5" />;
      case "fishing_rod": return <FishingRod className="h-5 w-5" />;
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
                      {item.id === "helmet" && <Helmet className="h-4 w-4" />}
                      {item.id === "chestplate" && <ChestArmor className="h-4 w-4" />}
                      {item.id === "leggings" && <Trousers className="h-4 w-4" />}
                      {item.id === "boots" && <Boots className="h-4 w-4" />}
                      {item.id === "fishing_rod" && <FishingRod className="h-4 w-4" />}
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

// Helper to convert numbers to Roman numerals
function getRomanNumeral(num: number): string {
  const romanNumerals = ["I", "II", "III", "IV", "V"];
  return romanNumerals[num - 1] || num.toString();
}

export default EnchantmentOptimizer;
