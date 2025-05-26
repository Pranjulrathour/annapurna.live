import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/Layout";
import DonorDashboard from "./DonorDashboard";
import NGODashboard from "./NGODashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { toast } = useToast();

  const updateRoleMutation = async (role: string) => {
    await apiRequest("PATCH", "/api/auth/user/role", { role });
    window.location.reload(); // Refresh to get updated user data
  };

  const handleRoleSelection = async (role: string) => {
    try {
      await updateRoleMutation(role);
      toast({
        title: "Role updated successfully!",
        description: `Welcome to Annapurna as a ${role}!`,
      });
    } catch (error) {
      toast({
        title: "Error updating role",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user doesn't have a role yet, show role selection
  if (!user?.role || user.role === 'donor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-neutral">
              Welcome to Annapurna! 🌾
            </CardTitle>
            <p className="text-gray-600">Choose your role to get started</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-20 p-6 text-left justify-start hover:bg-primary/5 hover:border-primary"
                onClick={() => handleRoleSelection("donor")}
              >
                <div>
                  <div className="font-semibold text-lg">🍽️ Food Donor</div>
                  <div className="text-sm text-gray-600">Share surplus food from home or restaurant</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 p-6 text-left justify-start hover:bg-secondary/5 hover:border-secondary"
                onClick={() => handleRoleSelection("ngo")}
              >
                <div>
                  <div className="font-semibold text-lg">🏢 NGO Partner</div>
                  <div className="text-sm text-gray-600">Distribute food to communities in need</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 p-6 text-left justify-start hover:bg-success/5 hover:border-success"
                onClick={() => handleRoleSelection("volunteer")}
              >
                <div>
                  <div className="font-semibold text-lg">🚀 Volunteer</div>
                  <div className="text-sm text-gray-600">Help pickup and deliver food donations</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  const DashboardComponent = () => {
    switch (user.role) {
      case "donor":
        return <DonorDashboard />;
      case "ngo":
        return <NGODashboard />;
      case "volunteer":
        return <VolunteerDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <DonorDashboard />;
    }
  };

  return (
    <Layout>
      <DashboardComponent />
    </Layout>
  );
}
