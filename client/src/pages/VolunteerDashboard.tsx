import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Award, Clock } from "lucide-react";
import DonationCard from "@/components/DonationCard";
import ImpactStats from "@/components/ImpactStats";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DonationWithDetails } from "@/lib/types";

export default function VolunteerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availablePickups = [] } = useQuery<DonationWithDetails[]>({
    queryKey: ["/api/donations"],
  });

  const { data: myClaims = [] } = useQuery({
    queryKey: ["/api/claims"],
  });

  const claimMutation = useMutation({
    mutationFn: (donationId: string) => 
      apiRequest("POST", "/api/claims", { donationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Pickup claimed successfully!",
        description: "Head to the pickup location when ready.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to claim pickup",
        description: "This pickup might already be claimed.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ claimId, status }: { claimId: string; status: string }) =>
      apiRequest("PATCH", `/api/claims/${claimId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Status updated successfully!",
        description: "Keep up the great work!",
      });
    },
  });

  const handleClaimPickup = (donationId: string) => {
    claimMutation.mutate(donationId);
  };

  const handleStatusUpdate = (claimId: string, status: string) => {
    updateStatusMutation.mutate({ claimId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "claimed": return "bg-yellow-500";
      case "picked_up": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="gradient-bg rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Volunteer Hub 🚀</h1>
            <p className="text-teal-100 text-lg">Your efforts are feeding communities and reducing waste</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Award className="h-5 w-5 text-yellow-300" />
            <span className="text-sm">Community Champion</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <ImpactStats />

      {/* Available Pickups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Available Pickups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availablePickups.filter(d => d.status === "submitted" || d.status === "claimed").length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-neutral mb-2">No pickups available</h3>
              <p className="text-gray-600">Check back later for new pickup opportunities</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availablePickups
                .filter(d => d.status === "submitted" || d.status === "claimed")
                .map((donation) => (
                  <DonationCard 
                    key={donation.id} 
                    donation={donation} 
                    showActions={true}
                    onClaim={() => handleClaimPickup(donation.id)}
                    claimLoading={claimMutation.isPending}
                    isVolunteer={true}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Active Pickups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            My Active Pickups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myClaims.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No active pickups</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myClaims.map((claim: any) => (
                <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(claim.status)}`}></div>
                    <div>
                      <p className="font-medium">Pickup #{claim.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {claim.status.replace('_', ' ')}
                    </Badge>
                    {claim.status === "claimed" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(claim.id, "picked_up")}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark Picked Up
                      </Button>
                    )}
                    {claim.status === "picked_up" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(claim.id, "delivered")}
                        disabled={updateStatusMutation.isPending}
                        className="bg-success hover:bg-success/90"
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volunteer Tips */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Volunteer Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning mt-1" />
              <div>
                <h4 className="font-medium">Be Punctual</h4>
                <p className="text-sm text-gray-600">Arrive at pickup locations on time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Plan Routes</h4>
                <p className="text-sm text-gray-600">Optimize your pickup and delivery routes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-secondary mt-1" />
              <div>
                <h4 className="font-medium">Safe Transport</h4>
                <p className="text-sm text-gray-600">Handle food safely during transport</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
