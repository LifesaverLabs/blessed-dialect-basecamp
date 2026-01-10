import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { DialectProvider } from "@/contexts/DialectContext";
import { AgeVerificationProvider } from "@/contexts/AgeVerificationContext";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import Home from "./pages/Home";
import Dictionary from "./pages/Dictionary";
import Forum from "./pages/Forum";
import About from "./pages/About";
import Timeline from "./pages/Timeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DialectProvider>
        <AgeVerificationProvider>
          <Toaster />
          <Sonner />
          <AgeVerificationModal />
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/about" element={<About />} />
              <Route path="/timeline" element={<Timeline />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AgeVerificationProvider>
      </DialectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
