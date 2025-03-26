
import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import NetherPortalCalculator from "@/components/NetherPortalCalculator";

const PortalCalculatorPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Calculadora de Portales del Nether</h1>
          <p className="text-center text-muted-foreground mb-8">
            Convierte fácilmente coordenadas entre el Overworld y el Nether para ubicar con precisión tus portales
          </p>

          <NetherPortalCalculator />
        </motion.div>
      </div>
    </Layout>
  );
};

export default PortalCalculatorPage;
