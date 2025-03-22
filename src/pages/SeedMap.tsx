
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MapComponent from "@/components/MapComponent";
import SeedFiltersSidebar from "@/components/SeedFiltersSidebar";

const SeedMap = () => {
  const [activeVersion, setActiveVersion] = useState<"bedrock" | "java">("java");
  const [activeSeed, setActiveSeed] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const handleSeedChange = (seed: string) => {
    setActiveSeed(seed);
  };

  const handleVersionChange = (version: "bedrock" | "java") => {
    setActiveVersion(version);
  };

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
            Explora lo que puedes encontrar en una semilla de Minecraft: aldeanos, spawners, templos y más.
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
            />
            
            <div className="lg:col-span-3">
              <MapComponent 
                seed={activeSeed}
                filters={activeFilters}
                version={activeVersion}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SeedMap;
