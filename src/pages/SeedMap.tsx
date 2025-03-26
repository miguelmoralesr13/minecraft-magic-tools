
import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import EnchantmentOptimizer from "@/components/EnchantmentOptimizer";

const SeedMap = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Optimizador de Encantamientos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Encuentra la combinación óptima para aplicar encantamientos con el menor costo de experiencia.
          </p>

          <EnchantmentOptimizer />
        </motion.div>
      </div>
    </Layout>
  );
};

export default SeedMap;
