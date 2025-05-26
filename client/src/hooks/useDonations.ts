import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

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
  const { user } = useAuth()
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

      const { data, error } = await supabase
        .from('donations')
        .insert([{ ...donationData, donor_id: user.id }])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Donation created successfully!",
        description: "Your food donation is now live and available for NGOs and volunteers.",
      })

      fetchDonations() // Refresh the list
      return data
    } catch (err: any) {
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
      if (!user) throw new Error('User not authenticated')

      // Create claim
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .insert([{
          donation_id: donationId,
          claimant_id: user.id,
          notes
        }])
        .select()
        .single()

      if (claimError) throw claimError

      // Update donation status
      await updateDonation(donationId, { status: 'claimed' })

      toast({
        title: "Donation claimed successfully!",
        description: "You can now coordinate pickup with the donor.",
      })

      return claimData
    } catch (err: any) {
      toast({
        title: "Error claiming donation",
        description: err.message,
        variant: "destructive"
      })
      throw err
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
  const getNearbyDonations = async (latitude?: number, longitude?: number) => {
    try {
      let query = supabase
        .from('donations')
        .select(`
          *,
          donor:profiles!donor_id(first_name, last_name, phone)
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (err: any) {
      console.error('Error fetching nearby donations:', err)
      return []
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    fetchDonations()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('donations')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'donations' 
      }, (payload) => {
        console.log('Real-time donation update:', payload)
        fetchDonations() // Refresh data on any change
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    donations,
    loading,
    error,
    createDonation,
    updateDonation,
    claimDonation,
    getUserDonations,
    getNearbyDonations,
    refetch: fetchDonations
  }
}