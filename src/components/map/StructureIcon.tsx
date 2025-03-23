
import React from "react";
import { 
  Home, 
  Skull, 
  Building, 
  Castle, 
  Anchor,
  Building2,
  Axe,
  Radar,
  Workflow,
  Landmark
} from "lucide-react";
import { StructureType } from "@/utils/minecraft/StructureGenerator";

export const getIconForType = (type: StructureType) => {
  switch (type) {
    case "village": return <Home className="h-4 w-4" />;
    case "temple": return <Landmark className="h-4 w-4" />;
    case "spawner": return <Skull className="h-4 w-4" />;
    case "stronghold": return <Building className="h-4 w-4" />;
    case "monument": return <Anchor className="h-4 w-4" />;
    case "mansion": return <Building2 className="h-4 w-4" />;
    case "mineshaft": return <Axe className="h-4 w-4" />;
    case "fortress": return <Castle className="h-4 w-4" />;
    case "outpost": return <Radar className="h-4 w-4" />;
    case "ruined_portal": return <Workflow className="h-4 w-4" />;
    default: return null;
  }
};

export const getColorForType = (type: StructureType): string => {
  switch (type) {
    case "village": return "#3b82f6"; // Azul
    case "temple": return "#facc15"; // Amarillo
    case "spawner": return "#dc2626"; // Rojo
    case "stronghold": return "#10b981"; // Verde
    case "monument": return "#6366f1"; // Índigo
    case "mansion": return "#8b5cf6"; // Violeta
    case "mineshaft": return "#d97706"; // Naranja
    case "fortress": return "#ef4444"; // Rojo brillante
    case "outpost": return "#f59e0b"; // Amber
    case "ruined_portal": return "#6b7280"; // Gris
    default: return "#000000"; // Negro
  }
};
