-- Fix relationships between profiles and other tables
-- This will ensure proper querying of profile data with claims

-- Note: We can't modify the auth.users table directly due to permissions
-- Instead, we'll create a view that joins the necessary tables

-- Create a simpler view that joins claims with profiles for easier queries
CREATE OR REPLACE VIEW public.claims_with_profiles AS
SELECT
  c.*,
  vol.first_name AS volunteer_first_name,
  vol.last_name AS volunteer_last_name,
  ngo.first_name AS ngo_first_name,
  ngo.last_name AS ngo_last_name,
  ngo.organization_name AS ngo_organization_name
FROM
  public.claims c
LEFT JOIN
  public.profiles vol ON c.volunteer_id = vol.id
LEFT JOIN
  public.profiles ngo ON c.ngo_id = ngo.id;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.claims_with_profiles TO authenticated;
GRANT SELECT ON public.claims_with_profiles TO anon;
GRANT SELECT ON public.claims_with_profiles TO service_role;

-- Add the view to realtime publication if it's not already added
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'claims_with_profiles'
  ) THEN
    -- Views can't be added to publications directly, so we'll handle this differently
    -- In a real setup you'd need to use triggers or other approaches for realtime views
    NULL; -- Placeholder for potential future implementation
  END IF;
END$$;
