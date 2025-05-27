-- Fix claims table structure
-- Add missing columns and fix relationships

-- First, check if the claims table exists, if not, create it
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'claimed' CHECK (status IN ('claimed', 'picked_up', 'delivered', 'cancelled')),
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimant_id UUID REFERENCES auth.users(id) -- This is a general reference to any user
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add volunteer_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'claims' AND column_name = 'volunteer_id'
  ) THEN
    ALTER TABLE public.claims ADD COLUMN volunteer_id UUID REFERENCES auth.users(id);
  END IF;

  -- Add ngo_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'claims' AND column_name = 'ngo_id'
  ) THEN
    ALTER TABLE public.claims ADD COLUMN ngo_id UUID REFERENCES auth.users(id);
  END IF;
END
$$;

-- Create proper indexes
CREATE INDEX IF NOT EXISTS idx_claims_donation_id ON public.claims(donation_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant_id ON public.claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_volunteer_id ON public.claims(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_claims_ngo_id ON public.claims(ngo_id);

-- Enable Row Level Security
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Create policies for claims table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'claims' AND policyname = 'Claims are viewable by anyone'
  ) THEN
    CREATE POLICY "Claims are viewable by anyone" 
      ON public.claims
      FOR SELECT 
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'claims' AND policyname = 'Claims can be created by authenticated users'
  ) THEN
    CREATE POLICY "Claims can be created by authenticated users" 
      ON public.claims
      FOR INSERT 
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'claims' AND policyname = 'Claims can be updated by their creator'
  ) THEN
    CREATE POLICY "Claims can be updated by their creator" 
      ON public.claims
      FOR UPDATE 
      USING (auth.uid() = claimant_id OR auth.uid() = volunteer_id OR auth.uid() = ngo_id);
  END IF;
END
$$;

-- Add realtime capability for claims (if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'claims'
  ) THEN
    ALTER publication supabase_realtime ADD TABLE public.claims;
  END IF;
END$$;
