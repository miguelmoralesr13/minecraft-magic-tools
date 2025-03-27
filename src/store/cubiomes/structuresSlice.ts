
/**
 * structuresSlice.ts
 * Store slice for managing Minecraft structures
 */

import { StateCreator } from 'zustand';
import { CubiomesStore, MinecraftStructure, StructuresState } from '@/types/cubiomes';

export const createStructuresSlice: StateCreator<
  CubiomesStore,
  [],
  [],
  StructuresState
> = (set, get) => ({
  structures: [],
  selectedStructure: null,
  filters: [],
  
  setStructures: (structures) => set({ structures }),
  setSelectedStructure: (selectedStructure) => set({ selectedStructure }),
  
  toggleFilter: (filter) => {
    const { filters } = get();
    if (filters.includes(filter)) {
      set({ filters: filters.filter(f => f !== filter) });
    } else {
      set({ filters: [...filters, filter] });
    }
  },
  
  clearFilters: () => set({ filters: [] }),
});
