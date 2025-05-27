import { createClient } from '@supabase/supabase-js'

// Default values for development - in production, these should be set in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bglndjumihlkxppgzbbs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbG5kanVtaWhsa3hwcGd6YmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODgyNzYsImV4cCI6MjA2Mzg2NDI3Nn0.dcA2-kXi20mFpnmNgdsgcRZCAtdVRW5DOCh832H3Wjg'

// Log for debugging
console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Profile = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: 'donor' | 'ngo' | 'volunteer' | 'admin'
  verified: boolean
  phone?: string
  organization_name?: string
  address?: string
  latitude?: number
  longitude?: number
  profile_image_url?: string
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