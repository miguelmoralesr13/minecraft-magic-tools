
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMapStore } from "@/store/mapStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Compass, ZoomIn, ZoomOut, Layers } from "lucide-react";
import SeedMapCanvas from "./SeedMapCanvas";

const structureTypes = [
  { id: "village", label: "Aldeas", icon: "/icons/village.svg" },
  { id: "temple", label: "Templos", icon: "/icons/temple.svg" },
  { id: "stronghold", label: "Fortalezas", icon: "/icons/stronghold.svg" },
  { id: "monument", label: "Monumentos", icon: "/icons/monument.svg" },
  { id: "mansion", label: "Mansiones", icon: "/icons/mansion.svg" },
  { id: "mineshaft", label: "Minas", icon: "/icons/mineshaft.svg" },
  { id: "fortress", label: "Fortalezas del Nether", icon: "/icons/fortress.svg" },
  { id: "spawner", label: "Generadores", icon: "/icons/spawner.svg" },
  { id: "outpost", label: "Puestos de Avanzada", icon: "/icons/outpost.svg" },
  { id: "ruined_portal", label: "Portales en Ruinas", icon: "/icons/ruined_portal.svg" },
];

const MapComponent: React.FC = () => {
  const [seed, setSeed] = useState<string>("1234");
  const [version, setVersion] = useState<string>("1.20");
  const [activeStructures, setActiveStructures] = useState<string[]>(["village"]);
  const { zoom, setZoom, toggleBiomes, showBiomes, handleCenter } = useMapStore();

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value);
  };

  const handleSearch = () => {
    if (!seed) {
      toast.error("Por favor ingresa una semilla válida");
      return;
    }
    toast.info(`Cargando mapa para la semilla: ${seed}`);
  };

  const toggleStructure = (structureId: string) => {
    setActiveStructures(prev => 
      prev.includes(structureId)
        ? prev.filter(id => id !== structureId)
        : [...prev, structureId]
    );
  };

  // Function to handle zoom in
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-[calc(100vh-200px)] min-h-[600px]">
      {/* Sidebar de filtros */}
      <Card className="p-4 md:w-64 flex-shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <Label htmlFor="seed" className="text-sm font-medium">Semilla</Label>
            <div className="flex mt-1">
              <Input
                id="seed"
                value={seed}
                onChange={handleSeedChange}
                placeholder="Ingresa semilla..."
                className="rounded-r-none"
              />
              <Button 
                variant="default" 
                className="rounded-l-none" 
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="version" className="text-sm font-medium">Versión</Label>
            <Tabs defaultValue="1.20" className="w-full" onValueChange={setVersion} value={version}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="1.18">1.18</TabsTrigger>
                <TabsTrigger value="1.19">1.19</TabsTrigger>
                <TabsTrigger value="1.20">1.20</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Estructuras</Label>
            <div className="space-y-2">
              {structureTypes.map((structure) => (
                <div key={structure.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={structure.id} 
                    checked={activeStructures.includes(structure.id)}
                    onCheckedChange={() => toggleStructure(structure.id)}
                  />
                  <Label 
                    htmlFor={structure.id} 
                    className="text-sm cursor-pointer flex items-center"
                  >
                    <img 
                      src={structure.icon.replace("/public", "")} 
                      alt={structure.label} 
                      className="w-4 h-4 mr-2" 
                    />
                    {structure.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Canvas del mapa */}
      <div className="flex-grow relative">
        <Card className="w-full h-full flex flex-col overflow-hidden">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCenter}
            >
              <Compass className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleBiomes}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
          
          <SeedMapCanvas 
            seed={seed} 
            version={version} 
            activeStructures={activeStructures} 
            showBiomes={showBiomes}
          />
        </Card>
      </div>
    </div>
  );
};

export default MapComponent;
