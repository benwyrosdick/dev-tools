import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import DiffToolPage from "./pages/DiffTool";
import JsonViewer from "./pages/JsonViewer";
import JwtViewer from "./pages/JwtViewer";
import CryptoTools from "./pages/CryptoTools";
import GuidGenerator from "./pages/GuidGenerator";
import NotFound from "./pages/NotFound";
import { HelmetProvider } from "react-helmet-async";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Navigation />
            <Routes>
              <Route path="/" element={<DiffToolPage />} />
              <Route path="/json-viewer" element={<JsonViewer />} />
              <Route path="/jwt-viewer" element={<JwtViewer />} />
              <Route path="/crypto-tools" element={<CryptoTools />} />
              <Route path="/guid-generator" element={<GuidGenerator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
