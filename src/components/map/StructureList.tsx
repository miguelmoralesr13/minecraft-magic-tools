import React from 'react';
import { useMapStore } from '@/store/mapStore';
import { MinecraftStructure } from '@/utils/minecraft/StructureGenerator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface StructureListProps {
  structures: MinecraftStructure[];
  filters: string[];
  onStructureSelect: (structure: MinecraftStructure) => void;
}

const StructureList: React.FC<StructureListProps> = ({ structures, filters, onStructureSelect }) => {
  // Filtrar estructuras según los filtros activos
  const filteredStructures = structures.filter(structure => 
    filters.length === 0 || filters.includes(structure.type)
  );

  return (
    <div className="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Coordenadas</TableHead>
            <TableHead>Bioma</TableHead>
            <TableHead>Distancia</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStructures.map((structure, index) => (
            <TableRow key={`${structure.type}-${structure.x}-${structure.z}-${index}`}>
              <TableCell className="font-medium capitalize">
                {structure.type}
              </TableCell>
              <TableCell>
                {structure.x}, {structure.z}
              </TableCell>
              <TableCell className="capitalize">
                {structure.biome}
              </TableCell>
              <TableCell>
                {Math.floor(structure.distanceFromSpawn)} bloques
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onStructureSelect(structure)}
                >
                  Centrar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StructureList;