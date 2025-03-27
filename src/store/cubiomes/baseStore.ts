
/**
 * baseStore.ts
 * Base state and actions for the Cubiomes store
 */

import { StateCreator } from 'zustand';
import { CubiomesStore, MapBaseState } from '@/types/cubiomes';

export const createBaseSlice: StateCreator<
  CubiomesStore,
  [],
  [],
  MapBaseState
> = (set) => ({
  seed: '0',
  version: '1.20',
  isLoading: false,
  
  setSeed: (seed) => set({ seed }),
  setVersion: (version) => set({ version }),
  setIsLoading: (isLoading) => set({ isLoading }),
});
