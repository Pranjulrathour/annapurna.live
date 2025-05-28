import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Discover from "@/pages/Discover";
import About from "@/pages/About";
import Dashboard from "@/pages/Dashboard";
import DonorDashboard from "@/pages/DonorDashboard";
import NGODashboard from "@/pages/NGODashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import DonationDetail from "@/pages/DonationDetail";
import ShareStats from "@/pages/ShareStats";
import Layout from "@/components/Layout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DarkModeStyles } from "@/components/DarkModeStyles";

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

  // Create a wrapper component that applies the Layout
  const WithLayout = ({ Component }: { Component: React.ComponentType }) => (
    <Layout>
      <Component />
    </Layout>
  );

  return (
    <Switch>
      {loading || !isAuthenticated ? (
        // Public routes
        <>
          <Route path="/" component={Landing} />
          <Route path="/discover" component={Discover} />
          <Route path="/about" component={About} />
        </>
      ) : (
        // Protected routes with Layout
        <>
          <Route path="/" component={() => <WithLayout Component={getDashboardComponent()} />} />
          <Route path="/donor" component={() => <WithLayout Component={DonorDashboard} />} />
          <Route path="/ngo" component={() => <WithLayout Component={NGODashboard} />} />
          <Route path="/volunteer" component={() => <WithLayout Component={VolunteerDashboard} />} />
          <Route path="/admin" component={() => <WithLayout Component={AdminDashboard} />} />
          <Route path="/donation/:id" component={() => <WithLayout Component={DonationDetail} />} />
          <Route path="/share" component={() => <WithLayout Component={ShareStats} />} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <LocationProvider>
            <TooltipProvider>
              <Toaster />
              <DarkModeStyles />
              <div className="min-h-screen dark:bg-background bg-background text-foreground dark:text-foreground">
                <Router />
              </div>
            </TooltipProvider>
          </LocationProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
