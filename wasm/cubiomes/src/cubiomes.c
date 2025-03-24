/**
 * cubiomes.c
 * 
 * Implementación simplificada de Cubiomes para WebAssembly.
 * Este archivo contiene las funciones necesarias para generar biomas y estructuras
 * de Minecraft utilizando algoritmos similares a los del juego.
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
#include <emscripten.h>

// Definiciones de tipos de biomas
#define BIOME_PLAINS 1
#define BIOME_DESERT 2
#define BIOME_FOREST 3
#define BIOME_MOUNTAINS 4
#define BIOME_SWAMP 5
#define BIOME_OCEAN 6
#define BIOME_RIVER 7
#define BIOME_TAIGA 8
#define BIOME_BEACH 9
#define BIOME_SAVANNA 10
#define BIOME_JUNGLE 11
#define BIOME_BADLANDS 12
#define BIOME_DARK_FOREST 13
#define BIOME_ICE_PLAINS 14
#define BIOME_MUSHROOM_ISLAND 15

// Definiciones de tipos de estructuras
#define STRUCTURE_VILLAGE 0
#define STRUCTURE_TEMPLE 1
#define STRUCTURE_STRONGHOLD 2
#define STRUCTURE_MONUMENT 3
#define STRUCTURE_MANSION 4
#define STRUCTURE_MINESHAFT 5
#define STRUCTURE_FORTRESS 6
#define STRUCTURE_SPAWNER 7
#define STRUCTURE_OUTPOST 8
#define STRUCTURE_RUINED_PORTAL 9

// Estructura para almacenar información de una estructura
typedef struct {
    int type;       // Tipo de estructura
    int x;          // Coordenada X
    int z;          // Coordenada Z
    int biome;      // Bioma donde se encuentra
    int distance;   // Distancia desde el spawn
} Structure;

// Variables globales para el generador
static unsigned long long g_seed = 0;
static char g_version[10] = "1.20";

// Implementación simplificada de JavaRandom para la generación de números aleatorios
typedef struct {
    unsigned long long seed;
} JavaRandom;

// Inicializar JavaRandom con una semilla
void javarand_init(JavaRandom* rand, unsigned long long seed) {
    rand->seed = (seed ^ 0x5DEECE66DLL) & ((1LL << 48) - 1);
}

// Obtener el siguiente número aleatorio
int javarand_next(JavaRandom* rand, int bits) {
    rand->seed = (rand->seed * 0x5DEECE66DLL + 0xBLL) & ((1LL << 48) - 1);
    return (int)(rand->seed >> (48 - bits));
}

// Obtener un número aleatorio en un rango
int javarand_nextInt(JavaRandom* rand, int n) {
    if (n <= 0) return 0;
    
    int bits, val;
    do {
        bits = javarand_next(rand, 31);
        val = bits % n;
    } while (bits - val + (n - 1) < 0);
    
    return val;
}

// Obtener un número aleatorio de punto flotante entre 0 y 1
double javarand_nextDouble(JavaRandom* rand) {
    return (((long long)javarand_next(rand, 26) << 27) + javarand_next(rand, 27)) / (double)(1LL << 53);
}

// Función de ruido simplificada para la generación de biomas
double noise(int x, int z, unsigned long long seed) {
    JavaRandom rand;
    javarand_init(&rand, seed + x * 341873128712 + z * 132897987541);
    return javarand_nextDouble(&rand);
}

// Función para obtener un hash de la semilla como string
unsigned long long hash_seed(const char* seed_str) {
    unsigned long long hash = 0;
    int len = strlen(seed_str);
    
    for (int i = 0; i < len; i++) {
        hash = 31 * hash + seed_str[i];
    }
    
    return hash;
}

// Inicializar el generador con una semilla y versión
EMSCRIPTEN_KEEPALIVE
void initGenerator(const char* seed_str, const char* version) {
    // Convertir la semilla de string a número
    unsigned long long seed;
    if (sscanf(seed_str, "%llu", &seed) != 1) {
        // Si no es un número, usar un hash de la cadena
        seed = hash_seed(seed_str);
    }
    
    g_seed = seed;
    strncpy(g_version, version, 9);
    g_version[9] = '\0';
}

// Obtener el bioma en una posición específica
EMSCRIPTEN_KEEPALIVE
int getBiomeAt(const char* seed_str, int x, int z, const char* version) {
    // Inicializar el generador si es necesario
    if (g_seed == 0 || strcmp(g_version, version) != 0) {
        initGenerator(seed_str, version);
    }
    
    // Generar valores de ruido para temperatura y humedad
    double temperature = noise(x, z, g_seed + 1);
    double humidity = noise(x, z, g_seed + 2);
    double variation = noise(x, z, g_seed + 3);
    
    // Verificar si es océano o río (basado en otro ruido)
    double waterNoise = noise(x, z, g_seed + 4);
    if (waterNoise < 0.3) {
        if (waterNoise < 0.1) {
            return BIOME_OCEAN;
        } else if (variation > 0.7) {
            return BIOME_RIVER;
        }
    }
    
    // Determinar el bioma basado en temperatura y humedad
    if (temperature < 0.1) {
        return BIOME_ICE_PLAINS;
    } else if (temperature < 0.2) {
        return humidity > 0.5 ? BIOME_TAIGA : BIOME_ICE_PLAINS;
    } else if (temperature < 0.4) {
        if (humidity > 0.7) return BIOME_SWAMP;
        else if (humidity > 0.4) return BIOME_FOREST;
        else return BIOME_PLAINS;
    } else if (temperature < 0.7) {
        if (humidity < 0.2) return BIOME_DESERT;
        else if (humidity > 0.6) return BIOME_JUNGLE;
        else if (humidity > 0.4) return BIOME_FOREST;
        else return BIOME_PLAINS;
    } else {
        if (humidity < 0.3) return BIOME_BADLANDS;
        else if (humidity < 0.5) return BIOME_SAVANNA;
        else return BIOME_JUNGLE;
    }
}

// Verificar si una estructura puede generarse en un bioma específico
int canStructureSpawnInBiome(int structure_type, int biome) {
    switch (structure_type) {
        case STRUCTURE_VILLAGE:
            return biome == BIOME_PLAINS || biome == BIOME_DESERT || biome == BIOME_SAVANNA;
        case STRUCTURE_TEMPLE:
            return biome == BIOME_DESERT || biome == BIOME_JUNGLE || biome == BIOME_ICE_PLAINS;
        case STRUCTURE_STRONGHOLD:
            return biome != BIOME_OCEAN && biome != BIOME_RIVER;
        case STRUCTURE_MONUMENT:
            return biome == BIOME_OCEAN;
        case STRUCTURE_MANSION:
            return biome == BIOME_DARK_FOREST;
        case STRUCTURE_MINESHAFT:
            return biome != BIOME_OCEAN;
        case STRUCTURE_FORTRESS:
            return 1; // Puede aparecer en cualquier bioma del Nether
        case STRUCTURE_SPAWNER:
            return biome != BIOME_OCEAN && biome != BIOME_RIVER;
        case STRUCTURE_OUTPOST:
            return biome == BIOME_DESERT || biome == BIOME_PLAINS || biome == BIOME_TAIGA || biome == BIOME_SAVANNA;
        case STRUCTURE_RUINED_PORTAL:
            return 1; // Puede aparecer en cualquier bioma
        default:
            return 0;
    }
}

// Generar estructuras cercanas a una posición
EMSCRIPTEN_KEEPALIVE
int getStructuresNear(const char* seed_str, int centerX, int centerZ, const char* type_str, int radius, const char* version, Structure* result) {
    // Inicializar el generador si es necesario
    if (g_seed == 0 || strcmp(g_version, version) != 0) {
        initGenerator(seed_str, version);
    }
    
    // Determinar el tipo de estructura a buscar
    int structure_type = -1;
    if (strcmp(type_str, "village") == 0) structure_type = STRUCTURE_VILLAGE;
    else if (strcmp(type_str, "temple") == 0) structure_type = STRUCTURE_TEMPLE;
    else if (strcmp(type_str, "stronghold") == 0) structure_type = STRUCTURE_STRONGHOLD;
    else if (strcmp(type_str, "monument") == 0) structure_type = STRUCTURE_MONUMENT;
    else if (strcmp(type_str, "mansion") == 0) structure_type = STRUCTURE_MANSION;
    else if (strcmp(type_str, "mineshaft") == 0) structure_type = STRUCTURE_MINESHAFT;
    else if (strcmp(type_str, "fortress") == 0) structure_type = STRUCTURE_FORTRESS;
    else if (strcmp(type_str, "spawner") == 0) structure_type = STRUCTURE_SPAWNER;
    else if (strcmp(type_str, "outpost") == 0) structure_type = STRUCTURE_OUTPOST;
    else if (strcmp(type_str, "ruined_portal") == 0) structure_type = STRUCTURE_RUINED_PORTAL;
    
    // Inicializar contador de estructuras encontradas
    int count = 0;
    
    // Calcular el rango de chunks a verificar
    int chunkRadius = radius / 16;
    int startChunkX = (centerX - radius) / 16;
    int startChunkZ = (centerZ - radius) / 16;
    int endChunkX = (centerX + radius) / 16;
    int endChunkZ = (centerZ + radius) / 16;
    
    // Iterar sobre los chunks en el rango
    for (int chunkZ = startChunkZ; chunkZ <= endChunkZ; chunkZ++) {
        for (int chunkX = startChunkX; chunkX <= endChunkX; chunkX++) {
            // Semilla para este chunk
            JavaRandom chunkRand;
            javarand_init(&chunkRand, g_seed + chunkX * 341873128712LL + chunkZ * 132897987541LL);
            
            // Verificar cada tipo de estructura
            for (int type = 0; type < 10; type++) {
                // Si se especificó un tipo, solo verificar ese tipo
                if (structure_type != -1 && type != structure_type) continue;
                
                // Probabilidad de generación basada en el tipo
                double spawnChance;
                switch (type) {
                    case STRUCTURE_VILLAGE: spawnChance = 0.05; break;
                    case STRUCTURE_TEMPLE: spawnChance = 0.03; break;
                    case STRUCTURE_STRONGHOLD: spawnChance = 0.008; break;
                    case STRUCTURE_MONUMENT: spawnChance = 0.01; break;
                    case STRUCTURE_MANSION: spawnChance = 0.003; break;
                    case STRUCTURE_MINESHAFT: spawnChance = 0.1; break;
                    case STRUCTURE_FORTRESS: spawnChance = 0.02; break;
                    case STRUCTURE_SPAWNER: spawnChance = 0.1; break;
                    case STRUCTURE_OUTPOST: spawnChance = 0.04; break;
                    case STRUCTURE_RUINED_PORTAL: spawnChance = 0.05; break;
                    default: spawnChance = 0;
                }
                
                // Verificar si la estructura se genera en este chunk
                if (javarand_nextDouble(&chunkRand) < spawnChance) {
                    // Calcular posición dentro del chunk
                    int offsetX = javarand_nextInt(&chunkRand, 16);
                    int offsetZ = javarand_nextInt(&chunkRand, 16);
                    
                    // Calcular coordenadas del mundo
                    int worldX = chunkX * 16 + offsetX;
                    int worldZ = chunkZ * 16 + offsetZ;
                    
                    // Calcular distancia al centro
                    int dx = worldX - centerX;
                    int dz = worldZ - centerZ;
                    int distance = (int)sqrt(dx*dx + dz*dz);
                    
                    // Verificar si está dentro del radio
                    if (distance <= radius) {
                        // Obtener el bioma en esta posición
                        int biome = getBiomeAt(seed_str, worldX, worldZ, version);
                        
                        // Verificar si la estructura puede generarse en este bioma
                        if (canStructureSpawnInBiome(type, biome)) {
                            // Añadir la estructura al resultado
                            result[count].type = type;
                            result[count].x = worldX;
                            result[count].z = worldZ;
                            result[count].biome = biome;
                            result[count].distance = distance;
                            count++;
                        }
                    }
                }
            }
        }
    }
    
    return count;
}