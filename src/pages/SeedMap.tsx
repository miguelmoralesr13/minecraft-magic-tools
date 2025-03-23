
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MapComponent from "@/components/MapComponent";
import SeedFiltersSidebar from "@/components/SeedFiltersSidebar";
import { StructureGenerator, MinecraftStructure } from "@/utils/minecraft/StructureGenerator";
import { toast } from "sonner";

const SeedMap = () => {
  const [activeVersion, setActiveVersion] = useState<"bedrock" | "java">("java");
  const [minecraftVersion, setMinecraftVersion] = useState<"1.16" | "1.20">("1.20");
  const [activeSeed, setActiveSeed] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [structures, setStructures] = useState<MinecraftStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const handleSeedChange = (seed: string) => {
    setActiveSeed(seed);
  };

  const handleVersionChange = (version: "bedrock" | "java") => {
    setActiveVersion(version);
  };

  const handleMinecraftVersionChange = (version: "1.16" | "1.20") => {
    setMinecraftVersion(version);
    // Regenerar estructuras si ya hay una semilla
    if (activeSeed) {
      generateStructures(activeSeed, version);
    }
  };

  // Generar estructuras basadas en la semilla
  const generateStructures = (seed: string, version: "1.16" | "1.20") => {
    setIsLoading(true);
    
    try {
      // Simular tiempo de procesamiento
      setTimeout(() => {
        const structureGenerator = new StructureGenerator(seed);
        const allStructures = structureGenerator.getAllStructures();
        
        setStructures(allStructures);
        setIsLoading(false);
        
        toast.success(`${allStructures.length} estructuras generadas`, {
          description: `Basado en la semilla: ${seed} para Minecraft ${version}`
        });
      }, 800); // Pequeño retraso para simular el procesamiento
    } catch (error) {
      console.error("Error generando estructuras:", error);
      toast.error("Error generando estructuras", {
        description: "Hubo un problema al procesar la semilla. Inténtalo de nuevo."
      });
      setIsLoading(false);
    }
  };

  // Regenerar estructuras cuando cambia la semilla o la versión
  useEffect(() => {
    if (activeSeed) {
      generateStructures(activeSeed, minecraftVersion);
    }
  }, [activeSeed]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Explorador de Semillas</h1>
          <p className="text-center text-muted-foreground mb-8">
            Explora qué estructuras puedes encontrar en una semilla de Minecraft, similar a Chunkbase.
          </p>

          <Tabs defaultValue="java" className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger 
                value="java" 
                onClick={() => handleVersionChange("java")}
              >
                Java Edition
              </TabsTrigger>
              <TabsTrigger 
                value="bedrock" 
                onClick={() => handleVersionChange("bedrock")}
              >
                Bedrock Edition
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SeedFiltersSidebar 
              onFilterChange={handleFilterChange}
              onSeedChange={handleSeedChange}
              version={activeVersion}
              onMinecraftVersionChange={handleMinecraftVersionChange}
              minecraftVersion={minecraftVersion}
            />
            
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="h-[600px] w-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Generando estructuras...</p>
                  </div>
                </div>
              ) : (
                <MapComponent 
                  seed={activeSeed}
                  filters={activeFilters}
                  version={activeVersion}
                  structures={structures}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SeedMap;
