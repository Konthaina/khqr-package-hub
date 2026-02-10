import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation, type Location } from "react-router-dom";
import Index from "./pages/Index";
import Source from "./pages/Source";
import DonateModal from "@/components/DonateModal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type ModalLocationState = {
  backgroundLocation?: Location;
};

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as ModalLocationState | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Index />} />
        <Route path="/npm" element={<Index />} />
        <Route path="/pip" element={<Index />} />
        <Route path="/composer" element={<Index />} />
        <Route path="/donate" element={<DonateModal />} />
        <Route path="/source" element={<Source />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="/donate" element={<DonateModal />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
