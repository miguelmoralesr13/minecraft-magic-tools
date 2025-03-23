import React, { useState } from "react";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { getColorForType, getIconForType } from "./StructureIcon";
import { useMapStore } from "@/store/mapStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface StructureListProps {
  structures: MinecraftStructure[];
  filters: string[];
}

const StructureList: React.FC<StructureListProps> = ({ structures, filters }) => {
  const { selectedStructure, setSelectedStructure } = useMapStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar y ordenar estructuras
  const filteredStructures = structures
    .filter(structure => {
      // Aplicar búsqueda por texto
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const typeLower = structure.type.toLowerCase();
        const biomeLower = structure.biome.toLowerCase();
        const coordsStr = `${structure.x},${structure.z}`;
        
        return (
          typeLower.includes(searchLower) ||
          biomeLower.includes(searchLower) ||
          coordsStr.includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => a.distanceFromSpawn - b.distanceFromSpawn);
  
  const handleSelectStructure = (structure: MinecraftStructure) => {
    setSelectedStructure(structure);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estructuras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>Total: {filteredStructures.length}</span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="text-primary hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredStructures.length > 0 ? (
          <div className="divide-y">
            {filteredStructures.map((structure, index) => {
              const isSelected = selectedStructure && 
                selectedStructure.x === structure.x && 
                selectedStructure.z === structure.z &&
                selectedStructure.type === structure.type;
              
              // Determinar si la estructura está filtrada
              const isFiltered = filters.length > 0 && !filters.includes(structure.type);
              
              return (
                <div 
                  key={`${structure.type}-${structure.x}-${structure.z}-${index}`}
                  className={`p-2 cursor-pointer transition-colors ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  onClick={() => handleSelectStructure(structure)}
                  style={{ opacity: isFiltered ? 0.5 : 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                      style={{ backgroundColor: getColorForType(structure.type) }}
                    >
                      {getIconForType(structure.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm truncate">
                          {structure.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(structure.distanceFromSpawn)}b
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="truncate">
                          {structure.biome.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className="flex-shrink-0">
                          {structure.x}, {structure.z}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <p className="text-muted-foreground text-sm text-center">
              {searchTerm ? "No se encontraron estructuras que coincidan con la búsqueda" : "No hay estructuras para mostrar"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StructureList;