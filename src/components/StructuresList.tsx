
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MinecraftStructure } from '@/store/mapStore';

// Mapping of biome IDs to names
const biomeNames: Record<number, string> = {
  0: 'Desconocido',
  1: 'Llanuras',
  2: 'Desierto',
  3: 'Bosque',
  4: 'Montañas',
  5: 'Pantano',
  6: 'Océano',
  7: 'Río',
  8: 'Taiga',
  9: 'Playa',
  10: 'Sabana',
  11: 'Jungla',
  12: 'Badlands',
  13: 'Bosque Oscuro',
  14: 'Llanuras Heladas',
  15: 'Isla de Hongos',
};

// Mapping of structure types to Spanish names
const structureNames: Record<string, string> = {
  'village': 'Aldea',
  'temple': 'Templo',
  'stronghold': 'Fortaleza',
  'monument': 'Monumento',
  'mansion': 'Mansión',
  'mineshaft': 'Mina',
  'fortress': 'Fortaleza del Nether',
  'spawner': 'Generador',
  'outpost': 'Puesto de Avanzada',
  'ruined_portal': 'Portal en Ruinas',
};

interface StructuresListProps {
  structures: MinecraftStructure[];
  selectedStructure: MinecraftStructure | null;
  onStructureSelect: (structure: MinecraftStructure) => void;
}

const StructuresList: React.FC<StructuresListProps> = ({
  structures,
  selectedStructure,
  onStructureSelect
}) => {
  if (structures.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No se encontraron estructuras en el área visible
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Coordenadas</TableHead>
            <TableHead>Bioma</TableHead>
            <TableHead>Distancia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {structures.map((structure, index) => (
            <TableRow 
              key={`${structure.type}-${index}`}
              className={`cursor-pointer hover:bg-muted transition-colors
                ${selectedStructure?.x === structure.x && selectedStructure?.z === structure.z 
                  ? 'bg-primary/10' 
                  : ''}`}
              onClick={() => onStructureSelect(structure)}
            >
              <TableCell className="font-medium flex items-center space-x-2">
                <img 
                  src={`/icons/${structure.type}.svg`} 
                  alt={structure.type} 
                  className="w-5 h-5" 
                />
                <span>{structureNames[structure.type] || structure.type}</span>
              </TableCell>
              <TableCell>{structure.x}, {structure.z}</TableCell>
              <TableCell>{biomeNames[structure.biome] || 'Desconocido'}</TableCell>
              <TableCell>{structure.distanceFromSpawn} bloques</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StructuresList;
