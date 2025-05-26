import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import SupabaseConfig from "@/components/SupabaseConfig";

function Router() {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Check if Supabase credentials are configured
    const hasUrl = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';
    const hasKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-anon-key';
    setIsSupabaseConfigured(hasUrl && hasKey);
  }, []);

  const handleSupabaseConfig = (url: string, anonKey: string) => {
    // Store credentials in localStorage for immediate use
    localStorage.setItem('VITE_SUPABASE_URL', url);
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', anonKey);
    setIsSupabaseConfigured(true);
    
    // Show success message
    alert('Supabase configured successfully! Please refresh the page to complete the setup.');
  };

  // Show Supabase configuration if not set up
  if (!isSupabaseConfigured) {
    return <SupabaseConfig onSave={handleSupabaseConfig} />;
  }

  return (
    <Switch>
      {loading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
