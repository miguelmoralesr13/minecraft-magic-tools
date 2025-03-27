
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sword, Pickaxe, Shield, Axe, HardHat, Shirt, Bot, Cast } from "lucide-react";
import { enchantableItems } from "@/data/enchantmentsData";

interface ItemSelectorProps {
  selectedItem: string;
  onItemSelect: (value: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ selectedItem, onItemSelect }) => {
  return (
    <div>
      <Label htmlFor="item" className="text-sm font-medium mb-2 block">
        Selecciona un Objeto
      </Label>
      <Select value={selectedItem} onValueChange={onItemSelect}>
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
  );
};

export default ItemSelector;
