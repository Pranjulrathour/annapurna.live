import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import DonorDashboard from "@/pages/DonorDashboard";
import NGODashboard from "@/pages/NGODashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

function Router() {
  const { isAuthenticated, loading, profile } = useAuth();

  // Route users to their role-specific dashboard
  const getDashboardComponent = () => {
    if (!profile) return Dashboard;
    
    switch (profile.role) {
      case 'donor':
        return DonorDashboard;
      case 'ngo':
        return NGODashboard;
      case 'volunteer':
        return VolunteerDashboard;
      case 'admin':
        return AdminDashboard;
      default:
        return Dashboard;
    }
  };

  return (
    <Switch>
      {loading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={getDashboardComponent()} />
          <Route path="/donor" component={DonorDashboard} />
          <Route path="/ngo" component={NGODashboard} />
          <Route path="/volunteer" component={VolunteerDashboard} />
          <Route path="/admin" component={AdminDashboard} />
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
