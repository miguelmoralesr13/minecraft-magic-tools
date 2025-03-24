
import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import MapComponent from "@/components/MapComponent";

const SeedMap = () => {
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

          <MapComponent />
        </motion.div>
      </div>
    </Layout>
  );
};

export default SeedMap;
