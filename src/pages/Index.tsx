import React, { useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import VersionToggle from "../components/VersionToggle";
import UtilityCard from "../components/UtilityCard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  const [version, setVersion] = useState<"bedrock" | "java">("bedrock");

  // Utility data for both versions
  const utilities = {
    bedrock: [
      {
        title: "Calculadora de Redstone",
        description: "Calcula circuitos de redstone eficientes para tus construcciones en Bedrock.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        ),
        color: "#4080ff",
        link: "#"
      },
      {
        title: "Generador de Comandos",
        description: "Crea comandos complejos fácilmente para usar en servidores y mundos de Bedrock.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
        color: "#4080ff",
        link: "#"
      },
      {
        title: "Diseñador de Estructuras",
        description: "Diseña y visualiza estructuras antes de construirlas en tu mundo de Bedrock.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20h18L12 4z" />
          </svg>
        ),
        color: "#4080ff",
        link: "#"
      },
      {
        title: "Comparador de Items",
        description: "Compara estadísticas de diferentes items para optimizar tu equipamiento.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        ),
        color: "#4080ff",
        link: "/comparador-items"
      },
      {
        title: "Calculadora de XP",
        description: "Calcula la cantidad de XP necesaria para llegar a niveles específicos en Bedrock.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
        color: "#4080ff",
        link: "#"
      },
      {
        title: "Generador de Semillas",
        description: "Encuentra semillas interesantes para tus nuevos mundos en Bedrock Edition.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        ),
        color: "#4080ff",
        link: "#"
      }
    ],
    java: [
      {
        title: "Calculadora de Redstone",
        description: "Calcula circuitos de redstone complejos optimizados para Minecraft Java.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        ),
        color: "#ff6b40",
        link: "#"
      },
      {
        title: "Calculadora de Encantamientos",
        description: "Optimiza tus encantamientos para conseguir las mejores combinaciones en Java.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
        color: "#ff6b40",
        link: "#"
      },
      {
        title: "Generador de DataPacks",
        description: "Crea DataPacks personalizados para tus mundos en Java sin conocimientos de programación.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
        color: "#ff6b40",
        link: "#"
      },
      {
        title: "Optimizador de Granjas",
        description: "Diseña granjas eficientes con cálculos precisos para Java Edition.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="8" height="10" x="8" y="7" rx="1" />
            <path d="M8 9V7a4 4 0 0 1 8 0v2" />
          </svg>
        ),
        color: "#ff6b40",
        link: "#"
      },
      {
        title: "Buscador de Biomas",
        description: "Encuentra biomas específicos en tus mundos de Java con coordenadas precisas.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        ),
        color: "#ff6b40",
        link: "#"
      },
      {
        title: "Comparador de Servidores",
        description: "Analiza y compara diferentes configuraciones de servidor para Java Edition.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M8 10v4" />
            <path d="M12 10v4" />
            <path d="M16 10v4" />
          </svg>
        ),
        color: "#ff6b40",
        link: "#"
      }
    ]
  };

  // Features section data
  const features = [
    {
      title: "Herramientas Avanzadas",
      description: "Calculadoras, generadores y optimizadores diseñados específicamente para Minecraft.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v10l5 5 5-5V2" />
          <path d="M14 3h6v8h-3v4.5L14 18l-3-3" />
        </svg>
      )
    },
    {
      title: "Específico por Versión",
      description: "Contenido adaptado a las mecánicas específicas de Bedrock y Java Edition.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    },
    {
      title: "Actualizaciones Constantes",
      description: "Siempre actualizado con las últimas versiones y cambios del juego.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.73 14.87a7.24 7.24 0 0 0 0-5.74" />
          <path d="M16.73 12a7.24 7.24 0 0 0-1.4-4.87" />
          <path d="M10.8 15.13a7.24 7.24 0 0 0 1.4 4.87" />
          <path d="M4.26 14.87a7.24 7.24 0 0 0 0-5.74" />
          <path d="M7.26 12a7.24 7.24 0 0 0 1.4-4.87" />
          <path d="M13.2 15.13a7.24 7.24 0 0 0-1.4 4.87" />
          <line x1="12" y1="9" x2="12" y2="15" />
        </svg>
      )
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* Version Toggle Section */}
      <VersionToggle version={version} setVersion={setVersion} />
      
      {/* Utilities Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Utilidades para Minecraft {version === "bedrock" ? "Bedrock" : "Java"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilities[version].map((utility, index) => (
              <UtilityCard
                key={utility.title}
                title={utility.title}
                description={utility.description}
                icon={utility.icon}
                color={utility.color}
                delay={index}
                link={utility.link}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
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
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-muted-foreground">
              Miles de jugadores ya utilizan nuestras herramientas para mejorar su experiencia en Minecraft.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Las calculadoras de redstone me han ahorrado horas de prueba y error en mis construcciones.",
                author: "MinecraftFan123",
                role: "Constructor de Redstone"
              },
              {
                quote: "El generador de comandos es increíblemente intuitivo. Ahora puedo crear comandos complejos sin esfuerzo.",
                author: "CommandBlockMaster",
                role: "Administrador de Servidor"
              },
              {
                quote: "Gracias al optimizador de granjas, la eficiencia de mis granjas ha aumentado un 40%.",
                author: "FarmingPro",
                role: "Técnico de Minecraft"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.19, 1, 0.22, 1]
                }}
                className="glass-panel rounded-xl p-6"
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                
                <p className="italic mb-6">"{testimonial.quote}"</p>
                
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Footer */}
      <Footer />
    </Layout>
  );
};

export default Index;
