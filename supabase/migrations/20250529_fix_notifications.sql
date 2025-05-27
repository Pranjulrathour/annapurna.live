-- Fix notifications table issues
-- This ensures notifications can be created properly

-- First, check for required columns and default values
DO $$
BEGIN
  -- Make timestamp column optional (nullable) as client is having issues with it
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'notifications'
    AND column_name = 'timestamp'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.notifications ALTER COLUMN timestamp DROP NOT NULL;
  END IF;
  
  -- Ensure created_at and updated_at have default values
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'notifications'
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.notifications 
    ALTER COLUMN created_at SET DEFAULT now();
    
    ALTER TABLE public.notifications 
    ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END$$;

-- Create a function to automatically set timestamp from created_at if not provided
CREATE OR REPLACE FUNCTION public.set_notification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.timestamp IS NULL THEN
    NEW.timestamp := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add or replace the trigger
DO $$
BEGIN
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS set_notification_timestamp_trigger ON public.notifications;
  
  -- Create the trigger
  CREATE TRIGGER set_notification_timestamp_trigger
  BEFORE INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_notification_timestamp();
END$$;

-- Ensure related_entity_id is properly typed
DO $$
BEGIN
  -- Make related_entity_id text type instead of UUID as it might be causing issues
  -- Only if it's currently UUID type
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'notifications'
    AND column_name = 'related_entity_id'
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.notifications 
    ALTER COLUMN related_entity_id TYPE TEXT USING related_entity_id::TEXT;
  END IF;
END$$;
