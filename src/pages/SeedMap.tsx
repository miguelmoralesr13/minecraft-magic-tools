
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import SeedControls from "@/components/map/SeedControls";
import ChunkbaseCubiomesMap, { ChunkbaseCubiomesMapRef } from "@/components/map/ChunkbaseCubiomesMap";
import { useMapStore } from "@/store/mapStore";
import { toast } from "sonner";
import MapControls from "@/components/map/MapControls";
import { initCubiomes } from "@/utils/minecraft/initCubiomes";

const SeedMap = () => {
  const { 
    seed, 
    setSeed, 
    version, 
    setVersion, 
    activeStructures 
  } = useMapStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapCanvasRef = useRef<ChunkbaseCubiomesMapRef>(null);

  // Inicializar Cubiomes al cargar la página
  useEffect(() => {
    const initialize = async () => {
      try {
        await initCubiomes();
      } catch (error) {
        console.error('Error al inicializar Cubiomes:', error);
        toast.error('No se pudo inicializar el generador de mapas');
      }
    };
    
    initialize();
  }, []);

  // Función para regenerar el mapa
  const handleRegenerate = () => {
    toast.success("Regenerando mapa", {
      description: "Generando estructuras para la semilla: " + seed
    });
  };

  // Función para cambiar la semilla
  const handleSeedChange = (newSeed: string) => {
    setSeed(newSeed);
  };

  // Función para descargar el mapa
  const handleDownloadMap = () => {
    if (mapCanvasRef.current) {
      mapCanvasRef.current.downloadMap();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Explorador de Semillas</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explora qué estructuras puedes encontrar en una semilla de Minecraft, similar a Chunkbase.
              Ingresa una semilla, selecciona la versión y descubre todas las estructuras cercanas al spawn.
            </p>
          </div>
          
          {/* Controles de semilla */}
          <SeedControls 
            version={version as "java" | "bedrock"} 
            setVersion={(v) => setVersion(v)} 
            seed={seed}
            onSeedChange={handleSeedChange}
            onGenerate={handleRegenerate}
          />
          
          {/* Controles del mapa */}
          <MapControls 
            onRegenerate={handleRegenerate} 
            onDownloadMap={handleDownloadMap} 
          />
          
          {/* Componente del mapa */}
          <Card className="p-6 shadow-lg border border-border/50 relative min-h-[600px] w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Generando estructuras...</p>
                </div>
              </div>
            )}
            <ChunkbaseCubiomesMap 
              ref={mapCanvasRef}
              seed={seed}
              version={version as "java" | "bedrock"}
              filters={activeStructures} 
              isLoading={isLoading}
              onLoadingChange={setIsLoading}
            />
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SeedMap;
