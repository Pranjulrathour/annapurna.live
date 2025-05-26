-- Annapurna Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE user_role AS ENUM ('donor', 'ngo', 'volunteer', 'admin');
CREATE TYPE donation_status AS ENUM ('submitted', 'claimed', 'picked_up', 'delivered', 'cancelled');
CREATE TYPE claim_status AS ENUM ('claimed', 'picked_up', 'delivered', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role user_role NOT NULL DEFAULT 'donor',
  verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  organization_name VARCHAR(255), -- For NGOs
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  food_type VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit VARCHAR(50) DEFAULT 'servings',
  expiry_hours INTEGER NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  description TEXT,
  dietary_info TEXT[], -- ['vegetarian', 'gluten-free', etc.]
  status donation_status DEFAULT 'submitted',
  pickup_instructions TEXT,
  contact_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table
CREATE TABLE claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE NOT NULL,
  claimant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status claim_status DEFAULT 'claimed',
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  delivery_location TEXT,
  beneficiaries_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact tracking table
CREATE TABLE impact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meals_donated INTEGER DEFAULT 0,
  meals_distributed INTEGER DEFAULT 0,
  deliveries_completed INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  carbon_footprint_reduced DECIMAL(10, 2) DEFAULT 0, -- in kg CO2
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'donation', 'claim', 'delivery', 'system'
  read BOOLEAN DEFAULT FALSE,
  data JSONB, -- Additional data for the notification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_location ON donations(latitude, longitude);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_created ON donations(created_at DESC);
CREATE INDEX idx_claims_donation ON claims(donation_id);
CREATE INDEX idx_claims_claimant ON claims(claimant_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impact_updated_at BEFORE UPDATE ON impact FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all verified profiles" ON profiles
  FOR SELECT USING (verified = true OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Donations policies
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active donations" ON donations
  FOR SELECT USING (status IN ('submitted', 'claimed'));

CREATE POLICY "Donors can manage own donations" ON donations
  FOR ALL USING (auth.uid() = donor_id);

CREATE POLICY "Authenticated users can create donations" ON donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- Claims policies
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view related claims" ON claims
  FOR SELECT USING (
    auth.uid() = claimant_id OR 
    auth.uid() IN (SELECT donor_id FROM donations WHERE id = donation_id)
  );

CREATE POLICY "Users can create claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Claimants can update own claims" ON claims
  FOR UPDATE USING (auth.uid() = claimant_id);

-- Impact policies
ALTER TABLE impact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all impact data" ON impact
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own impact" ON impact
  FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for real-time updates

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.impact (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update impact when donation is completed
CREATE OR REPLACE FUNCTION update_impact_on_delivery()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Update donor impact
    UPDATE impact 
    SET meals_donated = meals_donated + (SELECT quantity FROM donations WHERE id = NEW.donation_id),
        points = points + 10
    WHERE user_id = (SELECT donor_id FROM donations WHERE id = NEW.donation_id);
    
    -- Update claimant impact
    UPDATE impact 
    SET meals_distributed = meals_distributed + COALESCE(NEW.beneficiaries_count, 1),
        deliveries_completed = deliveries_completed + 1,
        points = points + 15
    WHERE user_id = NEW.claimant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for impact updates
CREATE TRIGGER on_claim_delivery
  AFTER UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_impact_on_delivery();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE donations;
ALTER PUBLICATION supabase_realtime ADD TABLE claims;
ALTER PUBLICATION supabase_realtime ADD TABLE impact;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;