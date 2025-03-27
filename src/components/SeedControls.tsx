
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useMapStore } from "@/store/mapStore";

interface SeedControlsProps {
  onSearch?: () => void;
}

const SeedControls: React.FC<SeedControlsProps> = ({ onSearch }) => {
  const { seed, version, setSeed, setVersion } = useMapStore();

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value);
  };

  const handleSearch = () => {
    if (!seed) {
      toast.error("Por favor ingresa una semilla válida");
      return;
    }
    
    toast.info(`Cargando mapa para la semilla: ${seed}`);
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="seed" className="text-sm font-medium mb-1 block">Semilla</Label>
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

      <div>
        <Label htmlFor="version" className="text-sm font-medium mb-1 block">Versión de Minecraft</Label>
        <Tabs 
          defaultValue={version} 
          className="w-full" 
          onValueChange={setVersion} 
          value={version}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="1.18">1.18</TabsTrigger>
            <TabsTrigger value="1.19">1.19</TabsTrigger>
            <TabsTrigger value="1.20">1.20</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default SeedControls;
