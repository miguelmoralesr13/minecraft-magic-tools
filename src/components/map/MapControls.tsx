/**
 * MapControls.tsx
 * Componente para controlar el mapa de Minecraft
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useMapStore } from '@/store/mapStore';
import { STRUCTURE_TYPES } from '@/utils/minecraft/StructureGenerator';

interface MapControlsProps {
  filters: string[];
  setFilters: (filters: string[]) => void;
  onRegenerate: () => void;
  onDownloadMap: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ filters, setFilters, onRegenerate, onDownloadMap }) => {
  const { handleCenter, toggleBiomes, showBiomes } = useMapStore();

  // Manejar cambios en los filtros
  const handleFilterChange = (type: string) => {
    if (filters.includes(type)) {
      setFilters(filters.filter(f => f !== type));
    } else {
      setFilters([...filters, type]);
    }
  };

  // Seleccionar/deseleccionar todos los filtros
  const handleSelectAll = () => {
    if (filters.length === STRUCTURE_TYPES.length) {
      setFilters([]);
    } else {
      setFilters([...STRUCTURE_TYPES]);
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-md">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleCenter}>
          Centrar Mapa
        </Button>
        <Button variant="outline" size="sm" onClick={toggleBiomes}>
          {showBiomes ? 'Ocultar Biomas' : 'Mostrar Biomas'}
        </Button>
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          Regenerar Mapa
        </Button>
        <Button variant="outline" size="sm" onClick={onDownloadMap}>
          Descargar Mapa
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filtrar Estructuras</h3>
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {filters.length === STRUCTURE_TYPES.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {STRUCTURE_TYPES.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-${type}`}
                checked={filters.includes(type)}
                onCheckedChange={() => handleFilterChange(type)}
              />
              <label
                htmlFor={`filter-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapControls;