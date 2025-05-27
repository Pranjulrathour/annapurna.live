import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Award, Clock, Filter, Bike, ExternalLink, Share2 } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";
import DonationCard from "@/components/DonationCard";
import ImpactStats from "@/components/ImpactStats";
import { useToast } from "@/hooks/use-toast";
import { useDonations, Donation } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocation } from "@/contexts/LocationContext";
import { ShareButton } from "@/components/ShareButton";

// Utility function for calculating distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

export default function VolunteerDashboard() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { claimDonation, updateDonationStatus, getNearbyDonations, loading } = useDonations();
  const [, setLocation] = useWouterLocation();
  
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
  const [availablePickups, setAvailablePickups] = useState<Donation[]>([]);
  const [myActiveClaims, setMyActiveClaims] = useState<Donation[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tripDistance, setTripDistance] = useState(0); // Track volunteer trip distance
  
  // Wrapper for location detection that includes success message
  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        toast({
          title: "Location detected!",
          description: "We'll show pickups near you.",
        });
      }
    } catch (error) {
      toast({
        title: "Location Error",
        description: "We'll show all available pickups.",
        variant: "destructive"
      });
    }
  };

  // Fetch donations when component mounts or when search parameters change
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        console.log('Fetching donations for volunteer dashboard');
        if (userLocation) {
          const donations = await getNearbyDonations(userLocation.lat, userLocation.lng, searchRadius);
          console.log('Fetched donations with location:', donations.length);
          
          // Show only available pickups (submitted status)
          setAvailablePickups(donations.filter(d => d.status === 'submitted'));
          
          // Show the volunteer's active pickups
          const activeClaims = donations.filter(d => 
            (d.status === 'claimed' || d.status === 'picked_up') &&
            d.claim && (
              // Check if the claim is by this volunteer
              (typeof d.claim === 'object' && d.claim.claimant_id === profile?.id) ||
              (Array.isArray(d.claim) && d.claim.length > 0 && d.claim[0].claimant_id === profile?.id)
            )
          );
          console.log('Active claims:', activeClaims.length);
          setMyActiveClaims(activeClaims);
          
          // Calculate total trip distance (for volunteer impact stats)
          let totalDistance = 0;
          activeClaims.forEach(claim => {
            if (claim.latitude && claim.longitude && userLocation) {
              totalDistance += calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                claim.latitude, 
                claim.longitude
              );
            }
          });
          setTripDistance(Math.round(totalDistance));
          
        } else {
          console.log('Fetching all donations (no location)');
          const allDonations = await getNearbyDonations();
          
          // Show only available pickups (submitted status)
          setAvailablePickups(allDonations.filter(d => d.status === 'submitted'));
          
          // Show the volunteer's active pickups
          if (profile?.id) {
            const activeClaims = allDonations.filter(d => 
              (d.status === 'claimed' || d.status === 'picked_up') &&
              d.claim && (
                // Check if the claim is by this volunteer
                (typeof d.claim === 'object' && d.claim.claimant_id === profile.id) ||
                (Array.isArray(d.claim) && d.claim.length > 0 && d.claim[0].claimant_id === profile.id)
              )
            );
            console.log('Active claims (no location):', activeClaims.length);
            setMyActiveClaims(activeClaims);
          }
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast({
          title: "Error loading donations",
          description: "There was a problem loading the donations data",
          variant: "destructive"
        });
      }
    };
    
    // Always fetch donations when component mounts
    if (profile) {
      fetchDonations();
    }
    
    // If we don't have a location yet, try to get it once on component mount
    if (!userLocation) {
      // Check if we should automatically try to get location
      const shouldAutoDetect = localStorage.getItem('annapurna_auto_detect_location') === 'true';
      if (shouldAutoDetect) {
        getCurrentLocation();
      }
    }
    
    // Save this preference for future sessions
    localStorage.setItem('annapurna_auto_detect_location', 'true');
    
  }, [userLocation, searchRadius, refreshTrigger, profile?.id]);

  // Handle claiming a pickup
  const handleClaimPickup = async (donationId: string) => {
    try {
      console.log('Volunteer claiming pickup:', donationId);
      
      // Find the donation to update
      const donationToUpdate = availablePickups.find(d => d.id === donationId);
      if (!donationToUpdate) {
        throw new Error('Donation not found');
      }
      
      // Optimistically update the UI
      setAvailablePickups(prev => prev.filter(d => d.id !== donationId));
      
      // Call the claim function
      const result = await claimDonation(donationId);
      console.log('Claim result:', result);
      
      // Add to my active claims list
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
        
        setMyActiveClaims(prev => [claimedDonation, ...prev]);
      }
      
      toast({
        title: "Pickup claimed successfully!",
        description: "Head to the pickup location when ready.",
      });
      
      // Update the donations list to ensure everything is in sync
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Error claiming pickup:', error);
      toast({
        title: "Failed to claim pickup",
        description: error.message || "This pickup might already be claimed.",
        variant: "destructive",
      });
      // Refresh in case of error to ensure UI is in sync
      setRefreshTrigger(prev => prev + 1);
    }
  };

  // Handle updating donation status
  const handleStatusUpdate = async (donationId: string, status: 'picked_up' | 'delivered') => {
    try {
      console.log('Updating donation status:', donationId, status);
      
      // Find the donation in active claims
      const claimToUpdate = myActiveClaims.find(d => d.id === donationId);
      if (!claimToUpdate) {
        throw new Error('Donation not found in active claims');
      }
      
      // Optimistically update the UI
      setMyActiveClaims(prev => prev.map(d => {
        if (d.id === donationId) {
          return {
            ...d,
            status: status as any,
            claim: d.claim ? {
              ...d.claim,
              status,
              ...(status === 'picked_up' ? { picked_up_at: new Date().toISOString() } : {}),
              ...(status === 'delivered' ? { delivered_at: new Date().toISOString() } : {})
            } : undefined
          };
        }
        return d;
      }));
      
      // If marking as delivered, remove from active claims after a delay
      if (status === 'delivered') {
        setTimeout(() => {
          setMyActiveClaims(prev => prev.filter(d => d.id !== donationId));
        }, 2000);
      }
      
      // Call the API to update status
      await updateDonationStatus(donationId, status);
      
      toast({
        title: "Status updated successfully!",
        description: `Donation marked as ${status.replace('_', ' ')}`,
      });
      
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Failed to update status",
        description: error.message || "Failed to update donation status.",
        variant: "destructive",
      });
      // Refresh to ensure UI is in sync
      setRefreshTrigger(prev => prev + 1);
    }
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
      <div className="bg-gradient-to-r from-blue-600/90 to-blue-400/80 rounded-2xl p-8 text-white border border-blue-500/20 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors">
                <Bike className="h-3 w-3 mr-1" /> Volunteer
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">Volunteer Hub {profile?.first_name ? `- ${profile.first_name}` : ''}</h1>
            <p className="text-blue-100 text-lg">Your efforts are feeding communities and reducing waste</p>
            {locationAddress && (
              <div className="flex items-center gap-2 mt-2 text-blue-100">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{locationAddress}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-blue-300/20 p-2 rounded-lg">
              <Award className="h-5 w-5 text-blue-300" />
              <span className="text-sm">Community Champion</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-300/20 p-2 rounded-lg">
              <Truck className="h-5 w-5 text-blue-300" />
              <span className="text-sm">{tripDistance > 0 ? `${tripDistance.toFixed(1)}km traveled` : 'Ready to deliver'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Statistics with Share Button */}
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
                placeholder="Set your location to see nearby pickups"
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

      {/* Available Pickups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Available Pickups {userLocation ? `Within ${searchRadius}km` : 'Near You'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : availablePickups.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-neutral mb-2">No pickups available</h3>
              <p className="text-gray-600">Check back later for new pickup opportunities</p>
              {!userLocation && (
                <Button 
                  onClick={getCurrentLocation} 
                  className="mt-4"
                  variant="outline"
                >
                  Set Your Location
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availablePickups.map((donation) => (
                <DonationCard 
                  key={donation.id} 
                  donation={donation} 
                  showActions={true}
                  onClaim={() => handleClaimPickup(donation.id)}
                  claimLoading={loading}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
          ) : myActiveClaims.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No active pickups</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {myActiveClaims.map((donation) => (
                <div key={donation.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/donation/${donation.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(donation.status)}`}></div>
                    <div>
                      <p className="font-medium">{donation.food_type}</p>
                      <p className="text-sm text-gray-600">
                        From: {donation.location || 'Unknown location'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-primary hover:text-primary-dark mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/donation/${donation.id}`);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                    
                    <Badge variant="outline" className="capitalize">
                      {donation.status.replace('_', ' ')}
                    </Badge>
                    
                    {donation.status === "claimed" && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(donation.id, "picked_up");
                        }}
                        disabled={loading}
                      >
                        Mark Picked Up
                      </Button>
                    )}
                    
                    {donation.status === "picked_up" && (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(donation.id, "delivered");
                        }}
                        disabled={loading}
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
