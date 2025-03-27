
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Sword, Pickaxe, Shield, Axe, HardHat, Shirt, Bot, Cast } from "lucide-react";
import { toast } from "sonner";
import EnchantmentsList from "./EnchantmentsList";
import OptimizationResult from "./OptimizationResult";
import { enchantments } from "@/data/enchantmentsData";
import { EnchantmentWithLevel } from "./types/enchantments";
import ItemSelector from "./enchantments/ItemSelector";
import EnchantmentSummary from "./enchantments/EnchantmentSummary";
import { calculateOptimizationSteps, checkEnchantmentConflicts } from "@/utils/enchantmentOptimizer";

const EnchantmentOptimizer: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("sword");
  const [selectedEnchantments, setSelectedEnchantments] = useState<EnchantmentWithLevel[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);
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

  const toggleEnchantment = (enchantment: any, level: number) => {
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
      
      const hasConflict = checkEnchantmentConflicts(enchantment, prev);
      
      if (hasConflict) {
        toast.error("Este encantamiento tiene conflictos con otro ya seleccionado");
        return prev;
      }
      
      return [...prev, { enchantment, level }];
    });
  };

  useEffect(() => {
    const { steps, totalCost } = calculateOptimizationSteps(selectedEnchantments, selectedItem);
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
          <ItemSelector 
            selectedItem={selectedItem} 
            onItemSelect={handleItemSelect} 
          />
          
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
              <EnchantmentSummary
                selectedItem={selectedItem}
                selectedEnchantments={selectedEnchantments}
                totalExperience={totalExperience}
                getItemIcon={getItemIcon}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default EnchantmentOptimizer;
