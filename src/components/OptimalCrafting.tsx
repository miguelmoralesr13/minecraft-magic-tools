
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CraftingItem, OptimalCraftingResult } from "@/types/craftingTypes";
import { craftableItems, calculateOptimalCrafting } from "@/data/craftingData";
import CraftingResult from "./CraftingResult";
import { ScrollArea } from "@/components/ui/scroll-area";

const OptimalCrafting: React.FC = () => {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [result, setResult] = useState<OptimalCraftingResult | null>(null);

  const handleCalculate = () => {
    if (!selectedItemId) return;
    
    const item = craftableItems.find(item => item.id === selectedItemId);
    if (!item) return;
    
    const craftingResult = calculateOptimalCrafting(item, quantity);
    setResult(craftingResult);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Item Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Selecciona un Item</CardTitle>
          <CardDescription>
            Elige el item que quieres craftear y la cantidad deseada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger id="item">
                <SelectValue placeholder="Selecciona un item" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-80">
                  {craftableItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={64}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          
          <Button onClick={handleCalculate} className="w-full mt-4">
            Calcular Crafteo Óptimo
          </Button>
        </CardContent>
      </Card>
      
      {/* Result Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            {result ? 
              `Materiales y pasos para craftear ${quantity} ${result.item.name}` : 
              "Selecciona un item y pulsa calcular para ver el resultado"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <CraftingResult result={result} />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <span className="text-3xl">📦</span>
              <p className="mt-2">Los resultados se mostrarán aquí</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimalCrafting;
