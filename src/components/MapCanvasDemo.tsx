
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { toast } from 'sonner';
import MapCanvas from './MapCanvas';
import StructuresList from './StructuresList';
import { MinecraftStructure } from '@/store/mapStore';

const MapCanvasDemo: React.FC = () => {
  const [seed, setSeed] = useState<string>("1234");
  const [version, setVersion] = useState<string>("1.20");
  const [activeFilters, setActiveFilters] = useState<string[]>(["village", "temple", "stronghold"]);
  const [showBiomes, setShowBiomes] = useState<boolean>(true);
  const [structures, setStructures] = useState<MinecraftStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<MinecraftStructure | null>(null);
  const [showStructuresList, setShowStructuresList] = useState<boolean>(false);

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

  const handleBiomeSelect = (biome: number, coords: { x: number, z: number }) => {
    toast.info(`Bioma seleccionado (${biome})`, {
      description: `En las coordenadas X: ${coords.x}, Z: ${coords.z}`
    });
  };

  const handleStructureSelect = (structure: MinecraftStructure) => {
    setSelectedStructure(structure);
    toast.info(`Estructura seleccionada: ${structure.type}`, {
      description: `En las coordenadas X: ${structure.x}, Z: ${structure.z}`
    });
  };

  const toggleStructuresList = () => {
    setShowStructuresList(!showStructuresList);
  };

  const toggleBiomes = () => {
    setShowBiomes(!showBiomes);
  };

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex gap-2 items-center">
          <div className="flex-grow">
            <Label htmlFor="seed" className="text-sm font-medium sr-only">Semilla</Label>
            <div className="flex">
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
          
          <Tabs defaultValue="1.20" className="w-32" onValueChange={setVersion} value={version}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="1.18">1.18</TabsTrigger>
              <TabsTrigger value="1.19">1.19</TabsTrigger>
              <TabsTrigger value="1.20">1.20</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleStructuresList}
          >
            {showStructuresList ? 'Ocultar Lista' : 'Mostrar Estructuras'}
          </Button>
        </div>
      </div>
      
      <div className="relative h-[calc(100%-70px)] flex">
        {/* Main map area */}
        <div className={`relative ${showStructuresList ? 'w-2/3' : 'w-full'} h-full transition-all duration-300`}>
          <MapCanvas 
            seed={seed}
            version={version}
            activeFilters={activeFilters}
            onSelectBiome={handleBiomeSelect}
            onSelectStructure={handleStructureSelect}
          />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline" size="icon">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant={showBiomes ? "default" : "outline"} 
              size="icon"
              onClick={toggleBiomes}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Structures list sidebar */}
        {showStructuresList && (
          <div className="w-1/3 h-full border-l bg-background p-4 overflow-auto">
            <h3 className="font-medium mb-4">Estructuras Encontradas</h3>
            <StructuresList 
              structures={structures}
              selectedStructure={selectedStructure}
              onStructureSelect={handleStructureSelect}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapCanvasDemo;
