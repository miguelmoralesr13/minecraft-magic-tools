
import React from "react";
import { Link } from "react-router-dom";

const PageFooter: React.FC = () => {
  return (
    <footer className="mt-auto py-10 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">MinecraftUtils</h3>
            <p className="text-sm text-muted-foreground">
              Utilidades para Minecraft Bedrock y Java para mejorar tu experiencia de juego.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Bedrock</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Java</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Acerca de</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Términos de Servicio</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} MinecraftUtils. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
