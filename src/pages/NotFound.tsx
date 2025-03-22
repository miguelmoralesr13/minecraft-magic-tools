
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <div className="inline-block p-6 mb-6 rounded-full bg-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
              <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">404</h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            ¡Ups! Parece que esta página ha sido destruida por un Creeper.
          </p>
          
          <Link 
            to="/" 
            className="minecraft-button bedrock bg-secondary text-foreground inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
