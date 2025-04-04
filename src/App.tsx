
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ItemComparator from "./pages/ItemComparator";
import SeedMap from "./pages/SeedMap";
import PortalCalculatorPage from "./pages/PortalCalculator";
import OptimalCraftingPage from "./pages/OptimalCrafting";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/comparador-items" element={<ItemComparator />} />
              <Route path="/mapa-semillas" element={<SeedMap />} />
              <Route path="/calculadora-portales" element={<PortalCalculatorPage />} />
              <Route path="/crafteos-optimos" element={<OptimalCraftingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
