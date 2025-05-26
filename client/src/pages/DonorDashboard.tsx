import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Heart, MapPin, Clock } from "lucide-react";
import DonationForm from "@/components/DonationForm";
import DonationCard from "@/components/DonationCard";
import ImpactStats from "@/components/ImpactStats";
import type { DonationWithDetails } from "@/lib/types";

export default function DonorDashboard() {
  const [showDonationForm, setShowDonationForm] = useState(false);

  const { data: donations = [], refetch } = useQuery<DonationWithDetails[]>({
    queryKey: ["/api/donations"],
  });

  const handleDonationSuccess = () => {
    setShowDonationForm(false);
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="gradient-bg rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Food Hero! 🌟</h1>
            <p className="text-teal-100 text-lg">Your generosity is making a difference in the community</p>
          </div>
          <Button 
            onClick={() => setShowDonationForm(true)}
            className="bg-secondary hover:bg-secondary/90 text-white mt-4 md:mt-0"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Donation
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <ImpactStats />

      {/* My Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            My Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-neutral mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-4">Start making a difference by creating your first donation</p>
              <Button onClick={() => setShowDonationForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create First Donation
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} showActions={false} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips for Donors */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Donation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning mt-1" />
              <div>
                <h4 className="font-medium">Timing Matters</h4>
                <p className="text-sm text-gray-600">Post donations with realistic pickup windows</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Clear Location</h4>
                <p className="text-sm text-gray-600">Provide accurate address and landmarks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-secondary mt-1" />
              <div>
                <h4 className="font-medium">Quality First</h4>
                <p className="text-sm text-gray-600">Ensure food is fresh and safe to consume</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm 
          onClose={() => setShowDonationForm(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
}
