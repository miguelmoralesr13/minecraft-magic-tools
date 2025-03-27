
import { create } from 'zustand';
import { MinecraftStructure } from '@/utils/minecraft/StructureGenerator';

interface MapStoreState {
  // Semilla y versión
  seed: string;
  version: string;
  setSeed: (seed: string) => void;
  setVersion: (version: string) => void;
  
  // Posición y zoom
  position: { x: number; y: number };
  zoom: number;
  setPosition: (position: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  
  // Estado de arrastre
  isDragging: boolean;
  dragStart: { x: number; y: number };
  setIsDragging: (isDragging: boolean) => void;
  setDragStart: (dragStart: { x: number; y: number }) => void;
  
  // Estructura seleccionada
  selectedStructure: MinecraftStructure | null;
  setSelectedStructure: (structure: MinecraftStructure | null) => void;
  
  // Filtros de estructuras
  activeStructures: string[];
  toggleStructure: (structureType: string) => void;
  setActiveStructures: (structures: string[]) => void;
  
  // Configuración de visualización
  showBiomes: boolean;
  setShowBiomes: (show: boolean) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  
  // Eventos del canvas
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  handleCanvasClick: (
    e: React.MouseEvent<HTMLCanvasElement>,
    structures: MinecraftStructure[],
    filters: string[]
  ) => void;
}

export const useMapStore = create<MapStoreState>((set, get) => ({
  // Valores iniciales
  seed: 'minecraft',
  version: '1.20',
  position: { x: 0, y: 0 },
  zoom: 1,
  isDragging: false,
  dragStart: { x: 0, y: 0 },
  selectedStructure: null,
  activeStructures: [
    'village', 
    'fortress', 
    'stronghold', 
    'monument', 
    'mansion', 
    'temple', 
    'mineshaft', 
    'ruined_portal', 
    'outpost', 
    'spawner'
  ],
  showBiomes: false,
  showControls: true,
  
  // Setters
  setSeed: (seed) => set({ seed }),
  setVersion: (version) => set({ version }),
  setPosition: (position) => set({ position }),
  setZoom: (zoom) => set({ zoom }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setDragStart: (dragStart) => set({ dragStart }),
  setSelectedStructure: (selectedStructure) => set({ selectedStructure }),
  setActiveStructures: (activeStructures) => set({ activeStructures }),
  setShowBiomes: (showBiomes) => set({ showBiomes }),
  setShowControls: (showControls) => set({ showControls }),
  
  // Toggle para filtros de estructuras
  toggleStructure: (structureType) => {
    const { activeStructures } = get();
    if (activeStructures.includes(structureType)) {
      set({ activeStructures: activeStructures.filter(type => type !== structureType) });
    } else {
      set({ activeStructures: [...activeStructures, structureType] });
    }
  },
  
  // Eventos del canvas
  handleMouseDown: (e) => {
    const { setIsDragging, setDragStart, position } = get();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - rect.left - position.x, 
      y: e.clientY - rect.top - position.y 
    });
  },
  
  handleMouseMove: (e) => {
    const { isDragging, dragStart, setPosition } = get();
    if (!isDragging) return;
    
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - dragStart.x,
      y: e.clientY - rect.top - dragStart.y
    });
  },
  
  handleMouseUp: () => {
    const { setIsDragging } = get();
    setIsDragging(false);
  },
  
  handleWheel: (e) => {
    e.preventDefault();
    const { zoom, setZoom } = get();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.max(0.1, Math.min(10, zoom * zoomFactor)));
  },
  
  handleCanvasClick: (e, structures, filters) => {
    const { position, zoom, setSelectedStructure } = get();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const centerX = canvas.width / 2 + position.x;
    const centerZ = canvas.height / 2 + position.y;
    
    // Buscar estructura bajo el cursor
    for (const structure of structures) {
      if (filters.length > 0 && !filters.includes(structure.type)) continue;
      
      const x = centerX + (structure.x * zoom) / 16;
      const z = centerZ + (structure.z * zoom) / 16;
      const size = 20; // Tamaño base del icono
      
      const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - z, 2));
      
      if (distance <= size / 2 + 5) {
        // Alternar selección
        const currentSelected = get().selectedStructure;
        if (currentSelected && currentSelected.x === structure.x && currentSelected.z === structure.z) {
          setSelectedStructure(null);
        } else {
          setSelectedStructure(structure);
        }
        return;
      }
    }
    
    // Si no se hizo clic en ninguna estructura, deseleccionar
    setSelectedStructure(null);
  }
}));

// Export el tipo de estructura
export type { MinecraftStructure };
