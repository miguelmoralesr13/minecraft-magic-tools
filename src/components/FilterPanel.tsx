
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMapStore } from "@/store/mapStore";

// Definición de tipos de estructuras disponibles
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

interface FilterPanelProps {
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className }) => {
  const { activeStructures, toggleStructure } = useMapStore();

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium block">Estructuras</Label>
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
                src={structure.icon} 
                alt={structure.label} 
                className="w-4 h-4 mr-2" 
              />
              {structure.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
