
/**
 * cubiomesStore.ts
 * Main Cubiomes store that combines all slices
 */

import { create } from 'zustand';
import { CubiomesStore } from '@/types/cubiomes';
import { createBaseSlice } from './baseStore';
import { createStructuresSlice } from './structuresSlice';
import { createBiomesSlice } from './biomesSlice';
import { createMapGenerationSlice } from './mapGenerationSlice';

/**
 * Store to manage the state of the Cubiomes module using Zustand
 */
export const useCubiomesStore = create<CubiomesStore>((...a) => ({
  ...createBaseSlice(...a),
  ...createStructuresSlice(...a),
  ...createBiomesSlice(...a),
  ...createMapGenerationSlice(...a),
}));
