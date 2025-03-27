/**
 * StructureTable.tsx
 * Componente para mostrar una tabla de estructuras de Minecraft
 */

import React, { useEffect, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import { MinecraftStructure } from '@/utils/minecraft/StructureGenerator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StructureTableProps {
  structures: MinecraftStructure[];
  filters: string[];
  onStructureSelect: (structure: MinecraftStructure) => void;
}

const StructureTable: React.FC<StructureTableProps> = ({ 
  structures, 
  filters,
  onStructureSelect
}) => {
  const { selectedStructure } = useMapStore();
  const [visibleStructures, setVisibleStructures] = useState<MinecraftStructure[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MinecraftStructure;
    direction: 'ascending' | 'descending';
  }>({ key: 'distanceFromSpawn', direction: 'ascending' });

  // Filtrar estructuras visibles basadas en los filtros activos
  useEffect(() => {
    const filtered = structures.filter(structure => {
      return filters.includes(structure.type);
    });

    // Ordenar las estructuras
    const sortedStructures = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setVisibleStructures(sortedStructures);
  }, [structures, filters, sortConfig]);

  // Función para manejar el ordenamiento
  const handleSort = (key: keyof MinecraftStructure) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  // Función para formatear la distancia
  const formatDistance = (distance: number): string => {
    return `${Math.floor(distance)} bloques`;
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[100px] cursor-pointer"
                onClick={() => handleSort('type')}
              >
                Tipo
                {sortConfig.key === 'type' && (
                  <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('biome')}
              >
                Bioma
                {sortConfig.key === 'biome' && (
                  <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => handleSort('distanceFromSpawn')}
              >
                Distancia
                {sortConfig.key === 'distanceFromSpawn' && (
                  <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Coordenadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleStructures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No se encontraron estructuras con los filtros actuales
                </TableCell>
              </TableRow>
            ) : (
              visibleStructures.map((structure) => {
                const isSelected = selectedStructure && 
                  selectedStructure.x === structure.x && 
                  selectedStructure.z === structure.z;
                
                return (
                  <TableRow 
                    key={`${structure.type}-${structure.x}-${structure.z}`}
                    className={`cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
                    onClick={() => onStructureSelect(structure)}
                    data-state={isSelected ? 'selected' : undefined}
                  >
                    <TableCell className="font-medium flex items-center gap-2">
                      <img 
                        src={`/icons/${structure.type}.svg`} 
                        alt={structure.type}
                        className="w-5 h-5"
                      />
                      <span>
                        {structure.type.charAt(0).toUpperCase() + structure.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{structure.biome}</TableCell>
                    <TableCell className="text-right">{formatDistance(structure.distanceFromSpawn)}</TableCell>
                    <TableCell className="text-right">{structure.x}, {structure.z}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default StructureTable;