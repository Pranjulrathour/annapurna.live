import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface UserImpact {
  id: string
  user_id: string
  meals_donated: number
  meals_distributed: number
  deliveries_completed: number
  points: number
  carbon_footprint_reduced: number
  created_at: string
  updated_at: string
}

export interface PlatformStats {
  totalUsers: number
  totalDonations: number
  totalMeals: number
  activeDonations: number
  totalImpactPoints: number
}

export function useImpact() {
  const [userImpact, setUserImpact] = useState<UserImpact | null>(null)
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Fetch user impact data
  const fetchUserImpact = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from('impact')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      setUserImpact(data)
    } catch (err: any) {
      console.error('Error fetching user impact:', err)
    }
  }

  // Fetch platform statistics
  const fetchPlatformStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total donations
      const { count: totalDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })

      // Get active donations
      const { count: activeDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'submitted')

      // Get total meals donated
      const { data: mealsData } = await supabase
        .from('donations')
        .select('quantity')

      const totalMeals = mealsData?.reduce((sum, donation) => sum + donation.quantity, 0) || 0

      // Get total impact points
      const { data: impactData } = await supabase
        .from('impact')
        .select('points')

      const totalImpactPoints = impactData?.reduce((sum, impact) => sum + impact.points, 0) || 0

      setPlatformStats({
        totalUsers: totalUsers || 0,
        totalDonations: totalDonations || 0,
        totalMeals,
        activeDonations: activeDonations || 0,
        totalImpactPoints
      })
    } catch (err: any) {
      console.error('Error fetching platform stats:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchUserImpact(),
        fetchPlatformStats()
      ])
      setLoading(false)
    }

    fetchData()

    // Set up real-time subscription for impact updates
    const subscription = supabase
      .channel('impact')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'impact' 
      }, (payload) => {
        if (payload.new && user && (payload.new as any).user_id === user.id) {
          setUserImpact(payload.new as UserImpact)
        }
        fetchPlatformStats() // Refresh platform stats
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    userImpact,
    platformStats,
    loading,
    refetch: () => {
      fetchUserImpact()
      fetchPlatformStats()
    }
  }
}