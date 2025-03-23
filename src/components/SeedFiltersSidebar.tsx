
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
  Building,
  Anchor,
  Building2,
  Axe,
  Radar,
  Workflow,
  Landmark
} from "lucide-react";
import { toast } from "sonner";
import { StructureType } from "@/utils/minecraft/StructureGenerator";
import { getColorForType } from "@/components/map/StructureIcon";

interface SeedFiltersSidebarProps {
  onFilterChange: (filters: string[]) => void;
  onSeedChange: (seed: string) => void;
  version: "bedrock" | "java";
  onMinecraftVersionChange: (version: "1.16" | "1.18" | "1.20") => void;
  minecraftVersion: "1.16" | "1.18" | "1.20";
}

interface FilterOption {
  id: StructureType;
  label: string;
  icon: React.ReactNode;
}

const SeedFiltersSidebar: React.FC<SeedFiltersSidebarProps> = ({ 
  onFilterChange, 
  onSeedChange, 
  version,
  onMinecraftVersionChange,
  minecraftVersion
}) => {
  const [seed, setSeed] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions: FilterOption[] = [
    { id: "village", label: "Aldeas", icon: <Home className="h-4 w-4" /> },
    { id: "temple", label: "Templos", icon: <Landmark className="h-4 w-4" /> },
    { id: "stronghold", label: "Fortalezas", icon: <Building className="h-4 w-4" /> },
    { id: "monument", label: "Monumentos", icon: <Anchor className="h-4 w-4" /> },
    { id: "mansion", label: "Mansiones", icon: <Building2 className="h-4 w-4" /> },
    { id: "mineshaft", label: "Minas", icon: <Axe className="h-4 w-4" /> },
    { id: "fortress", label: "Fortalezas del Nether", icon: <Castle className="h-4 w-4" /> },
    { id: "spawner", label: "Spawners", icon: <Skull className="h-4 w-4" /> },
    { id: "outpost", label: "Puestos de Pillagers", icon: <Radar className="h-4 w-4" /> },
    { id: "ruined_portal", label: "Portales en Ruinas", icon: <Workflow className="h-4 w-4" /> }
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
    const allFilters = filterOptions.map(option => option.id);
    setSelectedFilters(allFilters);
    onFilterChange(allFilters);
    
    toast.success("Todos los filtros activados", {
      description: `Mostrando todos los tipos de estructuras`
    });
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
    onFilterChange([]);
    
    toast.info("Filtros desactivados", {
      description: `Mostrando todas las estructuras sin filtrar`
    });
  };

  const handleMinecraftVersionChange = (newVersion: "1.16" | "1.18" | "1.20") => {
    onMinecraftVersionChange(newVersion);
    toast.info(`Versión cambiada a ${newVersion}`, {
      description: "La generación de estructuras se ha actualizado"
    });
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
      
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold">Versión de Minecraft</h3>
        <div className="flex gap-2">
          <Button 
            variant={minecraftVersion === "1.16" ? "default" : "outline"} 
            size="sm" 
            onClick={() => handleMinecraftVersionChange("1.16")}
          >
            1.16
          </Button>
          <Button 
            variant={minecraftVersion === "1.18" ? "default" : "outline"} 
            size="sm" 
            onClick={() => handleMinecraftVersionChange("1.18")}
          >
            1.18
          </Button>
          <Button 
            variant={minecraftVersion === "1.20" ? "default" : "outline"} 
            size="sm" 
            onClick={() => handleMinecraftVersionChange("1.20")}
          >
            1.20
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-xs"
            >
              Todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-xs"
            >
              Ninguno
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
          {filterOptions.map((option) => {
            const color = getColorForType(option.id);
            const isSelected = selectedFilters.includes(option.id);
            
            return (
              <div 
                key={option.id} 
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}
                onClick={() => handleFilterToggle(option.id)}
              >
                <div className="flex-shrink-0">
                  <Checkbox 
                    id={option.id} 
                    checked={isSelected}
                    onCheckedChange={() => handleFilterToggle(option.id)}
                  />
                </div>
                <Label 
                  htmlFor={option.id}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: color }}
                  >
                    {option.icon}
                  </div>
                  <span>{option.label}</span>
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {version === "java" ? "Java Edition" : "Bedrock Edition"} {minecraftVersion} - La visualización es aproximada y puede no reflejar con exactitud todas las estructuras en tu mundo. Basado en algoritmos similares a los de Chunkbase.
        </p>
      </div>
    </Card>
  );
};

export default SeedFiltersSidebar;
