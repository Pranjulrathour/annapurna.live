import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
  (typeof window !== 'undefined' ? localStorage.getItem('VITE_SUPABASE_URL') : null) || 
  'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  (typeof window !== 'undefined' ? localStorage.getItem('VITE_SUPABASE_ANON_KEY') : null) || 
  'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Profile = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: 'donor' | 'ngo' | 'volunteer' | 'admin'
  verified: boolean
  created_at: string
  updated_at: string
}

export type Donation = {
  id: string
  donor_id: string
  food_type: string
  quantity: number
  expiry_hours: number
  location: string
  latitude?: number
  longitude?: number
  image_url?: string
  status: 'submitted' | 'claimed' | 'picked_up' | 'delivered'
  created_at: string
  updated_at: string
}

export type Claim = {
  id: string
  donation_id: string
  ngo_id?: string
  volunteer_id?: string
  status: 'claimed' | 'picked_up' | 'delivered'
  claimed_at: string
  picked_up_at?: string
  delivered_at?: string
  notes?: string
}

export type Impact = {
  id: string
  user_id: string
  meals_donated: number
  meals_distributed: number
  deliveries_completed: number
  points: number
  updated_at: string
}