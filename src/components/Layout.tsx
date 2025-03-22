
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-soft ${
          scrolled 
            ? "py-2 glass-panel" 
            : "py-5 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg grid place-items-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-semibold text-lg">MinecraftUtils</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/" className="nav-link">Bedrock</Link>
              <Link to="/" className="nav-link">Java</Link>
              <Link to="/" className="nav-link">Acerca de</Link>
            </div>
            
            <div className="md:hidden">
              {/* Mobile menu button - to be implemented */}
              <button className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      
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
    </div>
  );
};

export default Layout;
