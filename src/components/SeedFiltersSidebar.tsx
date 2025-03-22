
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Sparkles, 
  Castle, 
  Home, 
  Skull, 
  Trees, 
  Mountain, 
  Building 
} from "lucide-react";
import { toast } from "sonner";

interface SeedFiltersSidebarProps {
  onFilterChange: (filters: string[]) => void;
  onSeedChange: (seed: string) => void;
  version: "bedrock" | "java";
}

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
}

const SeedFiltersSidebar: React.FC<SeedFiltersSidebarProps> = ({ 
  onFilterChange, 
  onSeedChange, 
  version 
}) => {
  const [seed, setSeed] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions: FilterOption[] = [
    { id: "village", label: "Aldeas", icon: <Home className="h-4 w-4" />, type: "village" },
    { id: "temple", label: "Templos", icon: <Castle className="h-4 w-4" />, type: "temple" },
    { id: "spawner", label: "Spawners", icon: <Skull className="h-4 w-4" />, type: "spawner" },
    { id: "forest", label: "Bosques", icon: <Trees className="h-4 w-4" />, type: "forest" },
    { id: "mountain", label: "Montañas", icon: <Mountain className="h-4 w-4" />, type: "mountain" },
    { id: "stronghold", label: "Fortalezas", icon: <Building className="h-4 w-4" />, type: "stronghold" }
  ];

  const handleSeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seed.trim()) {
      toast.error("Error", {
        description: "Por favor, ingresa una semilla válida"
      });
      return;
    }
    
    onSeedChange(seed);
    toast.success("Semilla aplicada", {
      description: `Buscando elementos en la semilla: ${seed}`
    });
  };

  const handleRandomSeed = () => {
    // Generar una semilla aleatoria
    const randomSeed = Math.floor(Math.random() * 1000000000).toString();
    setSeed(randomSeed);
    onSeedChange(randomSeed);
    
    toast.success("Semilla aleatoria generada", {
      description: `Nueva semilla: ${randomSeed}`
    });
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];
      
      // Notificar al componente padre
      onFilterChange(newFilters);
      
      return newFilters;
    });
  };

  const handleSelectAll = () => {
    const allFilters = filterOptions.map(option => option.type);
    setSelectedFilters(allFilters);
    onFilterChange(allFilters);
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Configuración</h3>
      
      <form onSubmit={handleSeedSubmit} className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="seed">Semilla</Label>
          <div className="flex gap-2">
            <Input
              id="seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Ingresa una semilla"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleRandomSeed}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Semilla Aleatoria
        </Button>
      </form>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-xs"
            >
              Todos
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs"
            >
              Ninguno
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {filterOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={option.id} 
                checked={selectedFilters.includes(option.type)}
                onCheckedChange={() => handleFilterToggle(option.type)}
              />
              <Label 
                htmlFor={option.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                {option.icon}
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {version === "java" ? "Java Edition" : "Bedrock Edition"} - La visualización es aproximada y puede no reflejar con exactitud todas las estructuras en tu mundo.
        </p>
      </div>
    </Card>
  );
};

export default SeedFiltersSidebar;
