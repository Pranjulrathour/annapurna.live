import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Building2, Clock } from "lucide-react";
import DonationCard from "@/components/DonationCard";
import ImpactStats from "@/components/ImpactStats";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DonationWithDetails } from "@/lib/types";

export default function NGODashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availableDonations = [] } = useQuery<DonationWithDetails[]>({
    queryKey: ["/api/donations"],
  });

  const { data: claims = [] } = useQuery({
    queryKey: ["/api/claims"],
  });

  const claimMutation = useMutation({
    mutationFn: (donationId: string) => 
      apiRequest("POST", "/api/claims", { donationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Donation claimed successfully!",
        description: "You can now coordinate pickup with volunteers.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to claim donation",
        description: "This donation might already be claimed.",
        variant: "destructive",
      });
    },
  });

  const handleClaimDonation = (donationId: string) => {
    claimMutation.mutate(donationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-500";
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
            <h1 className="text-3xl font-bold mb-2">NGO Dashboard 🏢</h1>
            <p className="text-teal-100 text-lg">Coordinate food distribution and help your community</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-3 h-3 bg-yellow-300 rounded-full status-pulse"></div>
            <span className="text-sm">{availableDonations.length} donations available</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <ImpactStats />

      {/* Available Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Available Donations Near You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableDonations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-neutral mb-2">No donations available</h3>
              <p className="text-gray-600">Check back later for new food donations in your area</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableDonations.map((donation) => (
                <DonationCard 
                  key={donation.id} 
                  donation={donation} 
                  showActions={true}
                  onClaim={() => handleClaimDonation(donation.id)}
                  claimLoading={claimMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-secondary" />
            My Claimed Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No claimed donations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim: any) => (
                <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(claim.status)}`}></div>
                    <div>
                      <p className="font-medium">Claim #{claim.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {claim.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NGO Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Distribution Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning mt-1" />
              <div>
                <h4 className="font-medium">Quick Response</h4>
                <p className="text-sm text-gray-600">Claim donations quickly to ensure freshness</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Coordinate Pickup</h4>
                <p className="text-sm text-gray-600">Work with volunteers for efficient collection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-secondary mt-1" />
              <div>
                <h4 className="font-medium">Track Distribution</h4>
                <p className="text-sm text-gray-600">Update delivery status for transparency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
