
/**
 * biomesSlice.ts
 * Store slice for managing Minecraft biomes
 */

import { StateCreator } from 'zustand';
import { BiomesState, CubiomesStore } from '@/types/cubiomes';

export const createBiomesSlice: StateCreator<
  CubiomesStore,
  [],
  [],
  BiomesState
> = (set, get) => ({
  biomeData: {},
  showBiomes: false,
  
  setBiomeData: (biomeData) => set({ biomeData }),
  toggleBiomes: () => set({ showBiomes: !get().showBiomes }),
});
