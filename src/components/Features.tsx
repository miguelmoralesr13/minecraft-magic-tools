
import React from "react";
import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesProps {
  features: Feature[];
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué usar MinecraftUtils?</h2>
          <p className="text-muted-foreground">
            Herramientas diseñadas por jugadores para jugadores, enfocadas en mejorar tu experiencia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.19, 1, 0.22, 1]
              }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
