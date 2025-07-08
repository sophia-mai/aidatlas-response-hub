import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Shelters from "./pages/Shelters";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/map" element={isAuthenticated ? <Map /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/shelters" element={isAuthenticated ? <Shelters /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/summary" element={isAuthenticated ? <Summary /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
