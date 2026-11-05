import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* Toasts live at the TOP: bottom toasts would cover the sticky
          mobile action bar (Next Day / Refill) and the music button. */}
      <Sonner position="top-center" richColors closeButton />
      {/* HashRouter on purpose: the game is hosted from subpaths
          (e.g. username.github.io/gum-mogul/) where BrowserRouter would
          match no route and render the 404 page. Hash routing works on
          any static host and any subfolder with zero server config. */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
