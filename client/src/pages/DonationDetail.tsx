import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, ChevronLeft, Share2 } from 'lucide-react';
import { DonationStatus } from '@/components/DonationStatus';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDonations } from '@/hooks/useDonations';
import { formatTimeframe } from '@/lib/donationUtils';

export default function DonationDetail() {
  const [, params] = useRoute('/donation/:id');
  const donationId = params?.id;
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { claimDonation, updateDonationStatus } = useDonations();
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<any>(null);
  const [claiming, setClaiming] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) return;
      
      try {
        setLoading(true);
        console.log('Fetching donation with ID:', donationId);
        
        // Try to fetch the donation with its related data
        let { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            donor:profiles!donor_id(
              id, 
              first_name, 
              last_name, 
              phone, 
              organization_name
            )
          `)
          .eq('id', donationId)
          .single();
        
        // If we get the donation, fetch its claims separately with profile data
        if (!error && data) {
          const { data: claimsData, error: claimsError } = await supabase
            .from('claims_with_profiles')
            .select('*')
            .eq('donation_id', donationId);
            
          if (!claimsError && claimsData) {
            // Attach the claims data to our donation
            data.claims = claimsData;
          } else {
            console.log('No claims found or error fetching claims:', claimsError);
            data.claims = [];
          }
        }
          
        if (error) {
          console.error('Error with complex query:', error);
          // Fall back to a simpler query if the complex one fails
          const simpleResult = await supabase
            .from('donations')
            .select('*')
            .eq('id', donationId)
            .single();
            
          if (simpleResult.error) {
            throw simpleResult.error;
          }
          
          data = simpleResult.data;
        }
        
        console.log('Donation data retrieved:', data);
        setDonation(data);
      } catch (err: any) {
        console.error('Error fetching donation:', err);
        toast({
          title: "Error",
          description: "Couldn't load donation details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonation();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`donation-${donationId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'donations',
        filter: `id=eq.${donationId}`
      }, (payload) => {
        console.log('Donation updated:', payload);
        if (payload.new) {
          // Only update the status and related fields, keep the rest
          setDonation((prev: any) => ({
            ...prev,
            ...payload.new,
          }));
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'claims',
        filter: `donation_id=eq.${donationId}`
      }, async (payload) => {
        console.log('Claim updated:', payload);
        // Refetch the full donation with claims to ensure we have the latest data
        if (donationId) {
          const { data } = await supabase
            .from('donations')
            .select(`
              *,
              donor:profiles!donor_id(
                id, 
                first_name, 
                last_name, 
                phone, 
                organization_name
              ),
              claims(
                id,
                claimed_at,
                picked_up_at,
                delivered_at,
                volunteer:profiles!volunteer_id(
                  id,
                  first_name,
                  last_name
                ),
                ngo:profiles!ngo_id(
                  id,
                  organization_name,
                  first_name,
                  last_name
                )
              )
            `)
            .eq('id', donationId)
            .single();
            
          if (data) {
            setDonation(data);
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [donationId, toast]);

  const handleClaim = async () => {
    if (!donation?.id || claiming) return;
    
    setClaiming(true);
    try {
      console.log('Claiming donation with ID:', donation.id);
      const result = await claimDonation(donation.id);
      console.log('Claim result:', result);
      
      // Update the donation locally with the new claimed status
      setDonation(prev => ({
        ...prev,
        status: 'claimed',
        claim: {
          id: 'temp-id', // Will be replaced on refetch
          claimant_id: user?.id || '',
          status: 'claimed',
          claimed_at: new Date().toISOString(),
          claimant: {
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            organization_name: profile?.organization_name
          }
        }
      }));
      
      toast({
        title: "Success",
        description: "Donation claimed successfully"
      });
    } catch (err: any) {
      console.error('Error claiming donation:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to claim donation",
        variant: "destructive"
      });
    } finally {
      setClaiming(false);
    }
  };

  const handleStatusUpdate = async (status: 'picked_up' | 'delivered') => {
    if (!donation?.id || updatingStatus) return;
    
    setUpdatingStatus(true);
    try {
      console.log('Updating donation status:', donation.id, status);
      await updateDonationStatus(donation.id, status);
      
      // Update the donation locally with the new status
      setDonation(prev => {
        // Update the claim timestamps if it exists
        if (prev?.claim) {
          const updatedClaim = {...prev.claim};
          if (status === 'picked_up') {
            updatedClaim.picked_up_at = new Date().toISOString();
          } else if (status === 'delivered') {
            updatedClaim.delivered_at = new Date().toISOString();
          }
          return {
            ...prev,
            status,
            claim: updatedClaim
          };
        }
        
        // Otherwise just update the status
        return {
          ...prev,
          status
        };
      });
      
      toast({
        title: "Status Updated",
        description: `Donation marked as ${status.replace('_', ' ')}`
      });
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-500 text-white";
      case "claimed": return "bg-yellow-500 text-white";
      case "picked_up": return "bg-orange-500 text-white";
      case "delivered": return "bg-green-500 text-white";
      case "cancelled": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const formatExpiryTime = (dateString: string, hours: number) => {
    if (!dateString || !hours) return "Unknown expiry";
    
    try {
      return formatTimeframe(dateString, hours);
    } catch (error) {
      return "Unknown expiry";
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Donation Not Found</h2>
              <p className="text-gray-600 mb-6">
                The donation you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const claim = donation.claims && donation.claims.length > 0 ? donation.claims[0] : null;
  
  // Determine if the current user can claim this donation
  const canClaim = profile && ['ngo', 'volunteer'].includes(profile.role) && donation.status === 'submitted';
  
  // Determine if the current user is the claimer
  const isClaimedByMe = profile && claim && 
    ((profile.role === 'ngo' && claim.ngo?.id === profile.id) || 
     (profile.role === 'volunteer' && claim.volunteer?.id === profile.id));
  
  // Determine if the current user can update the status
  const canUpdateStatus = isClaimedByMe && profile.role === 'volunteer';

  // Get claimant info
  const claimantInfo = claim ? {
    name: claim.volunteer 
      ? `${claim.volunteer.first_name} ${claim.volunteer.last_name}` 
      : claim.ngo 
        ? claim.ngo.organization_name || `${claim.ngo.first_name} ${claim.ngo.last_name}`
        : 'Unknown',
    role: claim.volunteer ? 'volunteer' as const : 'ngo' as const,
    organizationName: claim.ngo?.organization_name
  } : undefined;

  return (
    <div className="container max-w-4xl py-8">
      <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{donation.food_type}</CardTitle>
                <Badge className={getStatusColor(donation.status)}>
                  {donation.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>Serves {donation.quantity} {donation.unit || 'servings'}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{formatExpiryTime(donation.created_at, donation.expiry_hours)}</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <span className="flex-1">{donation.location || 'No location provided'}</span>
                </div>
                
                {donation.description && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{donation.description}</p>
                  </div>
                )}
              </div>
              
              {donation.dietary_info && donation.dietary_info.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Dietary Information:</p>
                  <div className="flex flex-wrap gap-1">
                    {donation.dietary_info.map((info: string, i: number) => (
                      <Badge key={i} variant="outline">{info}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {donation.pickup_instructions && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Pickup Instructions:</p>
                  <p className="text-sm text-yellow-900">{donation.pickup_instructions}</p>
                </div>
              )}
              
              {donation.image_url && (
                <div className="mt-4">
                  <img 
                    src={donation.image_url} 
                    alt={donation.food_type}
                    className="rounded-md w-full max-h-80 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Donation Timeline/Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DonationStatus 
                status={donation.status}
                createdAt={donation.created_at}
                claimedAt={claim?.claimed_at}
                pickedUpAt={claim?.picked_up_at}
                deliveredAt={claim?.delivered_at}
                claimedBy={claimantInfo}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Donor Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donor Information</CardTitle>
            </CardHeader>
            <CardContent>
              {donation.donor ? (
                <div className="space-y-3">
                  <div className="font-medium">
                    {donation.donor.organization_name ? (
                      <>
                        <p>{donation.donor.organization_name}</p>
                        <p className="text-sm text-gray-500">
                          Contact: {donation.donor.first_name} {donation.donor.last_name}
                        </p>
                      </>
                    ) : (
                      <p>{donation.donor.first_name} {donation.donor.last_name}</p>
                    )}
                  </div>
                  
                  {(profile?.role === 'volunteer' || profile?.role === 'ngo') && donation.donor.phone && (
                    <div className="text-sm">
                      <span className="text-gray-500">Phone:</span> {donation.donor.phone}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Donor information unavailable</p>
              )}
            </CardContent>
          </Card>
          
          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canClaim && (
                <Button 
                  className="w-full" 
                  onClick={handleClaim} 
                  disabled={claiming}
                >
                  {claiming ? "Claiming..." : "Claim This Donation"}
                </Button>
              )}
              
              {canUpdateStatus && donation.status === 'claimed' && (
                <Button 
                  className="w-full" 
                  onClick={() => handleStatusUpdate('picked_up')} 
                  disabled={updatingStatus}
                  variant="secondary"
                >
                  Mark as Picked Up
                </Button>
              )}
              
              {canUpdateStatus && donation.status === 'picked_up' && (
                <Button 
                  className="w-full" 
                  onClick={() => handleStatusUpdate('delivered')} 
                  disabled={updatingStatus}
                  variant="secondary"
                >
                  Mark as Delivered
                </Button>
              )}

              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
