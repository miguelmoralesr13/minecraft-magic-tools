
import { create } from 'zustand';

export interface MinecraftStructure {
  type: string;
  x: number;
  z: number;
  biome: string | number;
  distanceFromSpawn: number;
  version: string;
}

interface MapStoreState {
  // Map view state
  position: { x: number, y: number };
  zoom: number;
  isDragging: boolean;
  
  // Content state
  seed: string;
  version: string;
  showBiomes: boolean;
  showControls: boolean;
  activeStructures: string[];
  selectedStructure: MinecraftStructure | null;
  
  // Actions
  setSeed: (seed: string) => void;
  setVersion: (version: string) => void;
  setZoom: (zoom: number) => void;
  setPosition: (position: { x: number, y: number }) => void;
  setShowBiomes: (show: boolean) => void;
  setShowControls: (show: boolean) => void;
  setActiveStructures: (structures: string[]) => void;
  toggleStructure: (structure: string) => void;
  setSelectedStructure: (structure: MinecraftStructure | null) => void;
  
  // Canvas interactions
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>, structures: MinecraftStructure[], activeFilters: string[]) => void;
  
  // New functions to fix missing properties
  handleCenter: () => void;
  toggleBiomes: () => void;
}

export const useMapStore = create<MapStoreState>()((set, get) => ({
  // Map view state
  position: { x: 0, y: 0 },
  zoom: 1,
  isDragging: false,
  
  // Content state
  seed: '1234',
  version: 'java',
  showBiomes: true,
  showControls: true,
  activeStructures: ['village', 'fortress', 'stronghold', 'monument', 'mansion', 'temple', 'mineshaft', 'ruined_portal', 'outpost', 'spawner'],
  selectedStructure: null,
  
  // Actions
  setSeed: (seed) => set({ seed }),
  setVersion: (version) => set({ version }),
  setZoom: (zoom) => set({ zoom }),
  setPosition: (position) => set({ position }),
  setShowBiomes: (showBiomes) => set({ showBiomes }),
  setShowControls: (showControls) => set({ showControls }),
  setActiveStructures: (activeStructures) => set({ activeStructures }),
  toggleStructure: (structure) => set((state) => ({
    activeStructures: state.activeStructures.includes(structure)
      ? state.activeStructures.filter(s => s !== structure)
      : [...state.activeStructures, structure]
  })),
  setSelectedStructure: (selectedStructure) => set({ selectedStructure }),
  
  // Canvas interactions
  handleMouseDown: (e) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    set((state) => ({
      isDragging: true,
      position: {
        ...state.position,
        startX,
        startY
      }
    }));
  },
  
  handleMouseMove: (e) => {
    const state = get();
    if (!state.isDragging) return;
    
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - (state.position.startX || 0);
    const deltaY = y - (state.position.startY || 0);
    
    set((state) => ({
      position: {
        x: state.position.x + deltaX,
        y: state.position.y + deltaY,
        startX: x,
        startY: y
      }
    }));
  },
  
  handleMouseUp: () => {
    set((state) => ({
      isDragging: false,
      position: {
        x: state.position.x,
        y: state.position.y
      }
    }));
  },
  
  handleWheel: (e) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(2, get().zoom + delta));
    
    set({ zoom: newZoom });
  },
  
  handleCanvasClick: (e, structures, activeFilters) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    const { position, zoom } = get();
    const chunkSize = 16 * zoom;
    const centerX = canvas.width / 2 + position.x;
    const centerZ = canvas.height / 2 + position.y;
    
    // Find the closest structure
    let closestStructure = null;
    let minDistance = 40; // Threshold for selection in pixels
    
    for (const structure of structures) {
      // Skip structures not in active filters
      if (!activeFilters.includes(structure.type)) continue;
      
      // Convert world coordinates to canvas coordinates
      const structX = centerX + (structure.x / 16) * chunkSize;
      const structZ = centerZ + (structure.z / 16) * chunkSize;
      
      // Calculate distance from click to structure
      const distance = Math.sqrt(
        Math.pow(structX - canvasX, 2) + 
        Math.pow(structZ - canvasY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestStructure = structure;
      }
    }
    
    set({ selectedStructure: closestStructure });
    return closestStructure;
  },
  
  // Add the missing functions
  handleCenter: () => set({ position: { x: 0, y: 0 } }),
  
  toggleBiomes: () => set((state) => ({ showBiomes: !state.showBiomes }))
}));
