-- Drop and recreate notifications table with correct structure
-- This migration fixes the broken notifications table

-- First, check if the table exists and drop it if necessary
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
    -- Disable existing triggers first to avoid conflicts
    DROP TRIGGER IF EXISTS set_notification_timestamp_trigger ON public.notifications;
  END IF;
END$$;

-- Drop and recreate the notifications table with the correct structure
DROP TABLE IF EXISTS public.notifications CASCADE;

-- Create a fresh notifications table with proper structure
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  action_url TEXT,
  -- Change to text to avoid UUID conversion issues
  related_entity_id TEXT,
  related_entity_type TEXT CHECK (related_entity_type IN ('donation', 'claim', 'profile'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications for any user"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Add realtime capability for notifications
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) THEN
    -- Check if table is already in publication
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'notifications'
    ) THEN
      ALTER publication supabase_realtime ADD TABLE public.notifications;
    END IF;
  END IF;
END$$;

-- Add a comment to document the change
COMMENT ON TABLE public.notifications IS 'User notifications for the Annapurna app - fixed structure';
