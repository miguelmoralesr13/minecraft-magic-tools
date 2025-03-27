
/**
 * cubiomes.js
 * 
 * Mock implementation of the Cubiomes WebAssembly module for development
 */

// Function to create the module
function CubiomesModule(moduleOptions = {}) {
  return new Promise((resolve) => {
    console.log('Cargando módulo Cubiomes (mock version)...');
    
    // Create the module object
    const Module = {
      // Memory
      HEAPU8: new Uint8Array(1024 * 1024), // 1MB of memory
      HEAP32: new Int32Array(256 * 1024),  // 1MB of memory (as Int32)
      
      // Memory allocation counter
      memoryCounter: 0,
      
      // Function to allocate memory
      _malloc: function(size) {
        const ptr = Module.memoryCounter;
        Module.memoryCounter += size;
        return ptr;
      },
      
      // Function to free memory
      _free: function(ptr) {
        // In this simplified implementation, we do nothing
      },
      
      // Biome definitions
      BIOME_PLAINS: 1,
      BIOME_DESERT: 2,
      BIOME_FOREST: 3,
      BIOME_MOUNTAINS: 4,
      BIOME_SWAMP: 5,
      BIOME_OCEAN: 6,
      BIOME_RIVER: 7,
      BIOME_TAIGA: 8,
      BIOME_BEACH: 9,
      BIOME_SAVANNA: 10,
      BIOME_JUNGLE: 11,
      BIOME_BADLANDS: 12,
      BIOME_DARK_FOREST: 13,
      BIOME_ICE_PLAINS: 14,
      BIOME_MUSHROOM_ISLAND: 15,
      
      // Current seed
      currentSeed: 0,
      
      // Current version
      currentVersion: '1.20',
      
      // Function to initialize the generator
      _initGenerator: function(seedPtr, versionPtr) {
        const seedStr = Module.readString(seedPtr);
        const versionStr = Module.readString(versionPtr);
        
        // Convert seed to number if possible
        let seed;
        if (/^\d+$/.test(seedStr)) {
          seed = parseInt(seedStr, 10);
        } else {
          // Simple hash for text seeds
          seed = 0;
          for (let i = 0; i < seedStr.length; i++) {
            seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
            seed = seed & seed; // Convert to 32-bit integer
          }
        }
        
        Module.currentSeed = seed;
        Module.currentVersion = versionStr;
      },
      
      // Function to get the biome at a position
      _getBiomeAt: function(seedPtr, x, z, versionPtr) {
        const seedStr = Module.readString(seedPtr);
        const versionStr = Module.readString(versionPtr);
        
        // Initialize the generator if needed
        if (Module.currentSeed === 0 || Module.currentVersion !== versionStr) {
          Module._initGenerator(seedPtr, versionPtr);
        }
        
        // Generate noise values for temperature and humidity
        const temperature = Module.noise(x, z, Module.currentSeed + 1);
        const humidity = Module.noise(x, z, Module.currentSeed + 2);
        
        // Determine the biome based on temperature and humidity
        if (temperature < 0.1) {
          return Module.BIOME_ICE_PLAINS;
        } else if (temperature < 0.3) {
          return humidity < 0.5 ? Module.BIOME_TAIGA : Module.BIOME_FOREST;
        } else if (temperature < 0.6) {
          if (humidity < 0.3) return Module.BIOME_DESERT;
          else if (humidity > 0.7) return Module.BIOME_SWAMP;
          return Module.BIOME_PLAINS;
        } else {
          if (humidity < 0.3) return Module.BIOME_BADLANDS;
          else if (humidity < 0.5) return Module.BIOME_SAVANNA;
          return Module.BIOME_JUNGLE;
        }
      },
      
      // Function to get structures near a position
      _getStructuresNear: function(seedPtr, centerX, centerZ, typePtr, radius, versionPtr, resultPtr) {
        // Use a deterministic seed-based approach to generate mock structures
        const seed = Module.hashString(Module.readString(seedPtr));
        const structureType = Module.readString(typePtr);
        
        // Number of structures to generate (based on structure type and seed)
        const count = Math.min(5, Math.max(1, (seed % 10) + 1));
        
        for (let i = 0; i < count; i++) {
          // Generate pseudo-random coordinates
          const angle = ((seed + i * 73) % 360) * (Math.PI / 180);
          const distance = ((seed + i * 37) % 100) / 100 * radius;
          
          const structX = Math.floor(centerX + Math.cos(angle) * distance);
          const structZ = Math.floor(centerZ + Math.sin(angle) * distance);
          
          // Map structure type to index
          let typeIndex = 0;
          if (structureType === "village") typeIndex = 0;
          else if (structureType === "temple") typeIndex = 1;
          else if (structureType === "stronghold") typeIndex = 2;
          else if (structureType === "monument") typeIndex = 3;
          else if (structureType === "mansion") typeIndex = 4;
          else if (structureType === "mineshaft") typeIndex = 5;
          else if (structureType === "fortress") typeIndex = 6;
          else if (structureType === "spawner") typeIndex = 7;
          else if (structureType === "outpost") typeIndex = 8;
          else if (structureType === "ruined_portal") typeIndex = 9;
          
          // Generate a biome for this structure
          const biome = Module._getBiomeAt(seedPtr, structX, structZ, versionPtr);
          
          // Calculate distance from center
          const dx = structX - centerX;
          const dz = structZ - centerZ;
          const structDistance = Math.floor(Math.sqrt(dx*dx + dz*dz));
          
          // Write structure data to the result buffer
          const offset = resultPtr + i * 20; // 5 ints, 4 bytes each
          Module.HEAP32[offset / 4] = typeIndex;
          Module.HEAP32[(offset + 4) / 4] = structX;
          Module.HEAP32[(offset + 8) / 4] = structZ;
          Module.HEAP32[(offset + 12) / 4] = biome;
          Module.HEAP32[(offset + 16) / 4] = structDistance;
        }
        
        return count;
      },
      
      // Helper functions
      readString: function(ptr) {
        let str = '';
        let i = 0;
        while (Module.HEAPU8[ptr + i] !== 0) {
          str += String.fromCharCode(Module.HEAPU8[ptr + i]);
          i++;
        }
        return str;
      },
      
      noise: function(x, z, seed) {
        const xx = x * 0.01;
        const zz = z * 0.01;
        return (Math.sin(xx + seed) * Math.cos(zz + seed) + 1) / 2;
      },
      
      hashString: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
      },
      
      // Functions for Emscripten compatibility
      ccall: function(name, returnType, argTypes, args) {
        if (name === 'getBiomeAt') {
          return Module._getBiomeAt(args[0], args[1], args[2], args[3]);
        } else if (name === 'getStructuresNear') {
          return Module._getStructuresNear(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        return 0;
      }
    };
    
    // Resolve the promise with the module
    setTimeout(() => {
      console.log('Módulo Cubiomes cargado (mock version)');
      resolve(Module);
    }, 100); // Simulate a small delay for loading
  });
}

// Export the module
export default CubiomesModule;
