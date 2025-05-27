import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Building2, Clock, Filter, Users, Share2 } from "lucide-react";
import DonationCard from "@/components/DonationCard";
import ImpactStats from "@/components/ImpactStats";
import { useToast } from "@/hooks/use-toast";
import { useDonations } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Donation } from "@/hooks/useDonations";
import { useLocation } from "@/contexts/LocationContext";
import { ShareButton } from "@/components/ShareButton";

export default function NGODashboard() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { claimDonation, getNearbyDonations, loading } = useDonations();
  
  // Use the shared location context
  const { 
    userLocation, 
    locationAddress, 
    searchRadius, 
    loading: locationLoading, 
    getCurrentLocation,
    setSearchRadius
  } = useLocation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [myClaimedDonations, setMyClaimedDonations] = useState<Donation[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Wrapper for location detection that includes success message
  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        toast({
          title: "Location detected!",
          description: "We'll show donations near you.",
        });
      }
    } catch (error) {
      toast({
        title: "Location Error",
        description: "We'll show all available donations.",
        variant: "destructive"
      });
    }
  };

  // Fetch donations when component mounts or when search parameters change
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Show loading state
        console.log('Fetching donations with location:', userLocation);
        
        if (userLocation) {
          const donations = await getNearbyDonations(userLocation.lat, userLocation.lng, searchRadius);
          console.log('Fetched donations with location:', donations.length);
          // Filter to only show available donations
          setAvailableDonations(donations.filter(d => d.status === 'submitted'));
          
          // Set claimed donations separately
          const myDonations = donations.filter(d => 
            d.status !== 'submitted' && 
            d.claim && 
            d.claim.claimant_id === profile?.id
          );
          setMyClaimedDonations(myDonations);
        } else {
          const allDonations = await getNearbyDonations();
          console.log('Fetched all donations:', allDonations.length);
          // Filter to only show available donations
          setAvailableDonations(allDonations.filter(d => d.status === 'submitted'));
          
          // Set claimed donations separately
          const myDonations = allDonations.filter(d => 
            d.status !== 'submitted' && 
            d.claim && 
            d.claim.claimant_id === profile?.id
          );
          setMyClaimedDonations(myDonations);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };
    
    // Always fetch donations when component mounts
    fetchDonations();
    
    // If we don't have a location yet, try to get it once on component mount
    if (!userLocation) {
      // Check if we should automatically try to get location
      const shouldAutoDetect = localStorage.getItem('annapurna_auto_detect_location') === 'true';
      if (shouldAutoDetect) {
        getCurrentLocation();
      }
    }
  }, [userLocation, searchRadius, refreshTrigger, profile?.id]);

  // Handle claiming a donation
  const handleClaimDonation = async (donationId: string) => {
    try {
      console.log('NGO claiming donation:', donationId);
      // Show claiming in progress
      const donationToUpdate = availableDonations.find(d => d.id === donationId);
      if (!donationToUpdate) {
        throw new Error('Donation not found');
      }
      
      // Optimistically update the UI
      setAvailableDonations(prev => prev.filter(d => d.id !== donationId));
      
      // Call the claim function
      const result = await claimDonation(donationId);
      console.log('Claim result:', result);
      
      // Add to my claimed list
      if (result && profile) {
        const claimedDonation: Donation = {
          ...donationToUpdate,
          status: 'claimed' as const,
          claim: {
            id: typeof result.data === 'object' && result.data ? (result.data.id || 'temp-id') : 'temp-id',
            claimant_id: profile.id,
            status: 'claimed',
            claimed_at: new Date().toISOString(),
            claimant: {
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              organization_name: profile.organization_name
            }
          }
        };
        setMyClaimedDonations(prev => [claimedDonation, ...prev]);
      }
      
      toast({
        title: "Donation claimed successfully!",
        description: "You can now coordinate pickup with volunteers.",
      });
      
      // Update the donations list to ensure everything is in sync
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Error claiming donation:', error);
      toast({
        title: "Failed to claim donation",
        description: error.message || "This donation might already be claimed.",
        variant: "destructive",
      });
      // Refresh in case of error to ensure UI is in sync
      setRefreshTrigger(prev => prev + 1);
    }
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
      <div className="bg-gradient-to-r from-primary/90 to-secondary/80 rounded-2xl p-8 text-white border border-primary/20 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300 transition-colors">
                <Building2 className="h-3 w-3 mr-1" /> NGO Partner
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">NGO Dashboard {profile?.first_name ? `- ${profile.first_name}` : ''}</h1>
            <p className="text-yellow-100 text-lg">Coordinate food distribution and help your community</p>
            {locationAddress && (
              <div className="flex items-center gap-2 mt-2 text-yellow-100">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{locationAddress}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-yellow-300/20 p-3 rounded-lg">
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{availableDonations.length} donations available</span>
          </div>
        </div>
      </div>

      {/* Impact Stats with Share Button */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-grow">
          <ImpactStats />
        </div>
        <div className="flex items-start justify-end">
          <ShareButton 
            variant="default" 
            className="bg-primary hover:bg-primary/90"
            label="Share Your Impact" 
          />
        </div>
      </div>

      {/* Location and Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Settings
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                value={userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : ''}
                placeholder="Set your location to see nearby donations"
                readOnly
                className="flex-grow"
              />
              <Button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                variant="outline"
                className="whitespace-nowrap"
              >
                {locationLoading ? "Detecting..." : "Detect Location"}
              </Button>
            </div>
            
            {filterOpen && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="radius">
                  <AccordionTrigger>Search Radius: {searchRadius} km</AccordionTrigger>
                  <AccordionContent>
                    <div className="py-4">
                      <Slider
                        defaultValue={[searchRadius]}
                        max={100}
                        min={1}
                        step={1}
                        onValueChange={(values) => setSearchRadius(values[0])}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>1 km</span>
                        <span>50 km</span>
                        <span>100 km</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Available Donations {userLocation ? `Within ${searchRadius}km` : 'Near You'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : availableDonations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-neutral mb-2">No donations available</h3>
              <p className="text-gray-600">Check back later for new food donations in your area</p>
              {!userLocation && (
                <Button 
                  onClick={handleGetLocation} 
                  className="mt-4"
                  variant="outline"
                >
                  Set Your Location
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableDonations.map((donation) => (
                <DonationCard 
                  key={donation.id} 
                  donation={donation} 
                  showActions={true}
                  onClaim={() => handleClaimDonation(donation.id)}
                  claimLoading={loading}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
          ) : myClaimedDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No claimed donations yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myClaimedDonations.map((donation) => (
                <DonationCard 
                  key={donation.id} 
                  donation={donation} 
                  showActions={false}
                />
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
