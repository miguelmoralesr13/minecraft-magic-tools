
import React from "react";
import { MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { getIconForType } from "./StructureIcon";

interface StructureDetailsProps {
  structure: MinecraftStructure | null;
}

const StructureDetails: React.FC<StructureDetailsProps> = ({ structure }) => {
  if (!structure) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-background/80 p-2 rounded-md border border-border">
      <h4 className="text-sm font-semibold flex items-center gap-1">
        {getIconForType(structure.type)}
        {structure.type.charAt(0).toUpperCase() + structure.type.slice(1)}
      </h4>
      <div className="text-xs text-muted-foreground">
        <p>Coordenadas: X: {structure.x}, Z: {structure.z}</p>
        <p>Bioma: {structure.biome}</p>
        <p>Distancia al spawn: {Math.floor(structure.distanceFromSpawn)} bloques</p>
      </div>
    </div>
  );
};

export default StructureDetails;
