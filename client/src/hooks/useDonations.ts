import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'
import { notifyDonationStatusChange, notifyNGOOfStatusChange } from '@/lib/donationUtils'

export interface Donation {
  id: string
  donor_id: string
  food_type: string
  quantity: number
  unit: string
  expiry_hours: number
  location: string
  latitude?: number
  longitude?: number
  image_url?: string
  description?: string
  dietary_info?: string[]
  status: 'submitted' | 'claimed' | 'picked_up' | 'delivered' | 'cancelled'
  pickup_instructions?: string
  contact_phone?: string
  created_at: string
  updated_at: string
  donor?: {
    first_name: string
    last_name: string
    phone?: string
  }
  claim?: {
    id: string
    claimant_id: string
    status: string
    claimed_at: string
    claimant: {
      first_name: string
      last_name: string
      organization_name?: string
    }
  }
}

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, profile } = useAuth()
  const { toast } = useToast()

  // Fetch donations
  const fetchDonations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donor:profiles!donor_id(first_name, last_name, phone),
          claim:claims(
            id,
            claimant_id,
            status,
            claimed_at,
            claimant:profiles!claimant_id(first_name, last_name, organization_name)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setDonations(data || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error fetching donations",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Create donation
  const createDonation = async (donationData: Partial<Donation>) => {
    try {
      if (!user) throw new Error('User not authenticated')

      console.log('Creating donation with data:', donationData)
      
      // Make sure status is included with default 'submitted'
      const donation = {
        ...donationData,
        donor_id: user.id,
        status: 'submitted' as const,
        unit: donationData.unit || 'servings',
        dietary_info: donationData.dietary_info || []
      }

      const { data, error } = await supabase
        .from('donations')
        .insert([donation])
        .select()
        .single()

      if (error) {
        console.error('Error creating donation:', error)
        throw error
      }

      console.log('Donation created successfully:', data)
      
      toast({
        title: "Donation created successfully!",
        description: "Your food donation is now live and available for NGOs and volunteers.",
      })

      // Optimistically add the donation to the list
      setDonations(prev => [data, ...prev])
      
      return data
    } catch (err: any) {
      console.error('Error in createDonation:', err)
      toast({
        title: "Error creating donation",
        description: err.message,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update donation
  const updateDonation = async (id: string, updates: Partial<Donation>) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Update the donation in the list
      setDonations(prev => prev.map(d => d.id === id ? { ...d, ...data } : d))
      
      toast({
        title: "Donation updated successfully!",
        description: "Your donation details have been updated.",
      })

      return data
    } catch (err: any) {
      toast({
        title: "Error updating donation",
        description: err.message,
        variant: "destructive"
      })
      throw err
    }
  }

  // Claim donation
  const claimDonation = async (donationId: string, notes?: string) => {
    try {
      console.log('Starting claim process for donation:', donationId);
      if (!user) throw new Error('User not authenticated');
      if (!profile) throw new Error('User profile not loaded');

      // First, update the donation status to 'claimed'
      console.log('Updating donation status to claimed');
      const { error: donationError } = await supabase
        .from('donations')
        .update({ 
          status: 'claimed',
          updated_at: new Date().toISOString() 
        })
        .eq('id', donationId);

      if (donationError) {
        console.error('Error updating donation status:', donationError);
        throw donationError;
      }

      // Then create a claim record with proper role information
      const claimData = {
        donation_id: donationId,
        claimant_id: user.id, // This is always the current user
        // Set role-specific fields
        volunteer_id: profile?.role === 'volunteer' ? user.id : null,
        ngo_id: profile?.role === 'ngo' ? user.id : null,
        status: 'claimed',
        claimed_at: new Date().toISOString(),
        notes
      };

      console.log('Creating claim record:', claimData);
      const { data, error: claimError } = await supabase
        .from('claims')
        .insert([claimData])
        .select()
        .single();

      if (claimError) {
        console.error('Error creating claim:', claimError);
        throw claimError;
      }

      console.log('Claim created successfully:', data);

      // Notify the donor of the claim - use direct insertion instead of helper function
      try {
        // Get the donation to get the donor ID and details
        const { data: donationData } = await supabase
          .from('donations')
          .select('donor_id, food_type, quantity, unit')
          .eq('id', donationId)
          .single();

        if (donationData?.donor_id) {
          const title = 'Your donation has been claimed';
          const description = `Your donation of ${donationData.quantity} ${donationData.unit} of ${donationData.food_type} has been claimed${ 
            profile?.organization_name ? ` by ${profile.organization_name}` : ''
          }${
            profile?.role === 'volunteer' ? ' for pickup' : ''
          }`;
          
          console.log('Creating donation claim notification directly');
          
          // Create notification directly instead of using helper
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert([
              {
                user_id: donationData.donor_id,
                title: title,
                description: description,
                type: 'info',
                read: false,
                related_entity_id: donationId,
                related_entity_type: 'donation',
                action_url: `/donation/${donationId}`
              }
            ]);
            
          if (notificationError) {
            console.error('Error creating notification directly:', notificationError);
          } else {
            console.log('Notification created successfully');
          }
        }
      } catch (notifyError) {
        // Don't stop the claim if notification fails
        console.error('Error in notification process:', notifyError);
      }
      
      // Optimistically update the donation in the list
      setDonations(prev => prev.map(d => {
        if (d.id === donationId) {
          const claimantData = {
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            organization_name: profile?.organization_name
          };
          
          return { 
            ...d, 
            status: 'claimed',
            claim: {
              id: data?.id || 'temp-id',
              claimant_id: user.id,
              status: 'claimed',
              claimed_at: new Date().toISOString(),
              claimant: claimantData
            }
          };
        }
        return d;
      }));
      
      toast({
        title: "Donation claimed successfully!",
        description: "You can now coordinate pickup with the donor.",
      });
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in claimDonation:', err);
      toast({
        title: "Error claiming donation",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  }

  // Get user's donations (for donors)
  const getUserDonations = async (userId?: string) => {
    try {
      const targetUserId = userId || user?.id
      if (!targetUserId) return []

      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          claim:claims(
            id,
            claimant_id,
            status,
            claimed_at,
            claimant:profiles!claimant_id(first_name, last_name, organization_name)
          )
        `)
        .eq('donor_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err: any) {
      console.error('Error fetching user donations:', err)
      return []
    }
  }

  // Get nearby donations (for NGOs and volunteers)
  const getNearbyDonations = async (latitude?: number, longitude?: number, radius: number = 25) => {
    try {
      console.log('Getting nearby donations, user coords:', { latitude, longitude, radius })
      
      // Always fetch donations that are in 'submitted' status
      let query = supabase
        .from('donations')
        .select(`
          *,
          donor:profiles!donor_id(first_name, last_name, phone)
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })
      
      const { data, error } = await query

      if (error) {
        console.error('Error in getNearbyDonations:', error)
        throw error
      }
      
      console.log('Found donations before filtering:', data?.length || 0)
      
      // If user has location, apply sophisticated proximity filtering
      if (latitude && longitude && data && data.length > 0) {
        // Implementation of Haversine formula for accurate Earth distance calculation
        const filteredData = data.filter((donation: Donation) => {
          // Skip donations without coordinates
          if (!donation.latitude || !donation.longitude) {
            // For demo purposes, include donations without coordinates
            // In production, you might want to exclude these
            return true;
          }
          
          // Haversine formula for accurate Earth distance calculation
          const R = 6371; // Earth's radius in km
          const dLat = (donation.latitude - latitude) * Math.PI / 180;
          const dLon = (donation.longitude - longitude) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(latitude * Math.PI / 180) * Math.cos(donation.latitude * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c; // Distance in km
          
          // Debug distance calculation
          console.log(`Donation ${donation.id} is ${distance.toFixed(2)}km away`);
          
          return distance <= radius;
        });
        
        console.log(`Filtered to ${filteredData.length} donations within ${radius}km radius`);
        return filteredData;
      }
      
      return data || []
    } catch (err: any) {
      console.error('Error fetching nearby donations:', err)
      return []
    }
  }

  // Set up real-time subscription with optimistic updates
  useEffect(() => {
    fetchDonations();

    // Subscribe to real-time changes with more granular handling
    const donationChannel = supabase
      .channel('public:donations')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'donations' 
      }, (payload) => {
        console.log('New donation created:', payload);
        // Optimistically add the new donation to the list
        if (payload.new) {
          setDonations(prev => {
            // Check if donation already exists to avoid duplicates
            if (!prev.find(d => d.id === payload.new.id)) {
              return [payload.new as Donation, ...prev];
            }
            return prev;
          });
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'donations' 
      }, (payload) => {
        console.log('Donation updated:', payload);
        // Update the donation in the list
        if (payload.new) {
          setDonations(prev => 
            prev.map(d => d.id === payload.new.id ? {...d, ...payload.new as Donation} : d)
          );
        }
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'donations' 
      }, (payload) => {
        console.log('Donation deleted:', payload);
        // Remove the donation from the list
        if (payload.old) {
          setDonations(prev => prev.filter(d => d.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      // Properly clean up the channel on unmount
      supabase.removeChannel(donationChannel);
    }
  }, [user?.id]);

  // Update donation status (for volunteers to mark as picked up or delivered)
  const updateDonationStatus = async (donationId: string, status: 'submitted' | 'claimed' | 'picked_up' | 'delivered' | 'cancelled') => {
    try {
      // First get the donation to access donor info
      const { data: donation, error: fetchError } = await supabase
        .from('donations')
        .select(`
          donor_id,
          claim:claims(ngo_id)
        `)
        .eq('id', donationId)
        .single();

      if (fetchError) throw fetchError;
      if (!donation) throw new Error('Donation not found');

      // Update the donation status in the database
      const { error } = await supabase
        .from('donations')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId);

      if (error) throw error;

      // Also update the claim status if necessary
      if (status === 'picked_up' || status === 'delivered') {
        const updateData = status === 'picked_up' 
          ? { status, picked_up_at: new Date().toISOString() }
          : { status, delivered_at: new Date().toISOString() };

        await supabase
          .from('claims')
          .update(updateData)
          .eq('donation_id', donationId);
      }
      
      // Send notification to donor
      if (donation.donor_id && user) {
        await notifyDonationStatusChange(
          donation.donor_id, 
          donationId, 
          status, 
          user && profile ? { 
            id: user.id, 
            first_name: profile?.first_name, 
            last_name: profile?.last_name,
            role: 'volunteer'
          } : undefined
        );
      }

      // Send notification to NGO if applicable
      if (donation.claim && donation.claim[0]?.ngo_id && user) {
        await notifyNGOOfStatusChange(
          donation.claim[0].ngo_id,
          donationId,
          status,
          user && profile ? { 
            id: user.id, 
            first_name: profile?.first_name, 
            last_name: profile?.last_name 
          } : undefined
        );
      }

      // Update local state for immediate UI feedback
      setDonations(prev => 
        prev.map(d => d.id === donationId ? { ...d, status } : d)
      );
      
      // Show success toast
      toast({
        title: `Donation marked as ${status.replace('_', ' ')}`,
        description: status === 'delivered' 
          ? 'Thank you for completing this delivery!'
          : 'Status updated successfully.',
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating donation status:', error);
      toast({
        title: 'Error updating status',
        description: error.message || 'Failed to update donation status',
        variant: 'destructive'
      });
      throw new Error(error.message || 'Failed to update donation status');
    }
  };

  return {
    donations,
    loading,
    error,
    createDonation,
    updateDonation,
    claimDonation,
    getUserDonations,
    getNearbyDonations,
    updateDonationStatus,
    refetch: fetchDonations
  }
}
