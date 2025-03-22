
import React, { useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import VersionToggle from "../components/VersionToggle";
import Footer from "../components/Footer";
import UtilitiesGrid from "../components/UtilitiesGrid";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import { utilities, features, testimonials } from "../data/minecraftData";

const Index: React.FC = () => {
  const [version, setVersion] = useState<"bedrock" | "java">("bedrock");

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* Version Toggle Section */}
      <VersionToggle version={version} setVersion={setVersion} />
      
      {/* Utilities Grid Section */}
      <UtilitiesGrid utilities={utilities[version]} version={version} />
      
      {/* Features Section */}
      <Features features={features} />
      
      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />
      
      {/* CTA Footer */}
      <Footer />
    </Layout>
  );
};

export default Index;
