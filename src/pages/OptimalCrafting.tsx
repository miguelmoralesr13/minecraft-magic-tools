
import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import OptimalCrafting from "@/components/OptimalCrafting";

const OptimalCraftingPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Calculadora de Crafteos Óptimos</h1>
          <p className="text-center text-muted-foreground mb-8">
            Calcula la forma más eficiente de craftear items complejos en Minecraft
          </p>

          <OptimalCrafting />
          
          <div className="mt-12 bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">¿Cómo funciona?</h2>
            <div className="space-y-4">
              <p>
                La calculadora de crafteos óptimos te ayuda a determinar la manera más eficiente de crear
                items complejos en Minecraft, minimizando el desperdicio de recursos y optimizando el proceso.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Selecciona el item que deseas craftear de la lista</li>
                <li>Elige la cantidad de items que necesitas</li>
                <li>Haz clic en "Calcular Crafteo Óptimo"</li>
                <li>Revisa la lista de materiales necesarios y los pasos a seguir</li>
              </ol>
              <p>
                La calculadora descompone automáticamente los items intermedios y muestra todos los materiales
                base que necesitarás recolectar, así como los pasos detallados para el proceso de crafteo.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OptimalCraftingPage;
