
import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-minecraft-bedrock/20 rounded-full filter blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-minecraft-java/15 rounded-full filter blur-3xl animate-pulse-soft animation-delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="section-fade-in max-w-3xl mx-auto text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Minecraft Utilities
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Utilidades para Minecraft <span className="text-minecraft-bedrock">Bedrock</span> y <span className="text-minecraft-java">Java</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Herramientas y recursos para mejorar tu experiencia en Minecraft, optimizar tu juego y sacar el máximo provecho de tus mundos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="minecraft-button bedrock bg-secondary">
              Bedrock Edition
            </button>
            <button className="minecraft-button java bg-secondary">
              Java Edition
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
