
import React from "react";

const Footer: React.FC = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para empezar?</h2>
          
          <p className="text-muted-foreground mb-8">
            Descubre todas las utilidades para Minecraft y lleva tu experiencia de juego al siguiente nivel.
          </p>
          
          <div className="inline-block">
            <button className="minecraft-button bedrock bg-secondary text-foreground">
              Explorar Utilidades
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
