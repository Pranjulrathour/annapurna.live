import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, History, Package, MapPin, Clock, X, Leaf, Heart, Share2 } from "lucide-react";
import DonationCard from "@/components/DonationCard";
import DonationForm from "@/components/DonationForm";
import { useDonations } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import ImpactStats from "@/components/ImpactStats";
import { ShareButton } from "@/components/ShareButton";

interface LocationProps {
  latitude: number;
  longitude: number;
  address?: string;
}

interface DonorDashboardProps {
  initialLocation?: LocationProps;
}

import type { Donation } from "@/hooks/useDonations";

export default function DonorDashboard({ initialLocation }: DonorDashboardProps = {}) {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const { user, profile } = useAuth();
  const { getUserDonations, loading, createDonation } = useDonations();
  const { location: detectedLocation } = useLocation();
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationProps | undefined>(initialLocation);
  const { toast } = useToast();
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use detected location if initialLocation wasn't provided
  useEffect(() => {
    if (!userLocation && detectedLocation) {
      setUserLocation({
        latitude: detectedLocation.latitude,
        longitude: detectedLocation.longitude,
        address: detectedLocation.address,
      });
    }
  }, [detectedLocation, userLocation]);

  // Fetch user's donations when component mounts or refresh is triggered
  useEffect(() => {
    const fetchDonations = async () => {
      if (user?.id) {
        const donations = await getUserDonations(user.id);
        setUserDonations(donations);
      }
    };

    fetchDonations();
  }, [user?.id, getUserDonations, refreshTrigger]);

  const handleDonationSuccess = () => {
    setShowDonationForm(false);
    // Trigger a refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSubmit = async (data: any) => {
    try {
      // Include location data with donation if available
      const locationData = userLocation
        ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            location: userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`,
          }
        : {};

      await createDonation({
        ...data,
        ...locationData,
        user_id: user?.id,
      });

      setDonationSuccess(true);
      setShowDonationForm(false);
      toast({
        title: "Donation created!",
        description: "Your generous donation is now visible to local NGOs.",
      });
    } catch (error) {
      console.error("Error creating donation:", error);
      toast({
        title: "Error creating donation",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-secondary/90 to-accent/90 rounded-2xl p-8 text-white border border-accent/20 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-green-200 text-green-800 hover:bg-green-300 transition-colors">
                <Leaf className="h-3 w-3 mr-1" /> Donor
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.first_name || "Donor"} 👋</h1>
            <p className="text-green-100 text-lg">Share your surplus food to reduce waste and feed the community</p>
            {userLocation?.address && (
              <div className="flex items-center gap-2 mt-2 text-green-100">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{userLocation.address}</span>
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              className="bg-white text-green-600 hover:bg-green-50 transition-colors"
              onClick={() => setShowDonationForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Donate Food
            </Button>
            <ShareButton 
              variant="outline" 
              className="bg-white border-white text-green-600 hover:bg-green-50" 
            />
          </div>
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : userDonations.length === 0 ? (
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
              {userDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  showActions={true}
                  onUpdate={() => setRefreshTrigger((prev) => prev + 1)}
                />
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
          isOpen={showDonationForm}
          onClose={() => setShowDonationForm(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
}
