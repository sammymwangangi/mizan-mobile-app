-- =====================================================
-- Mizan Money App - Supabase Database Schema
-- =====================================================

-- Note: auth.users already has RLS enabled by Supabase

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  phone_number TEXT,
  full_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  interests TEXT[],
  employment_status TEXT CHECK (employment_status IN ('employed', 'self_employed', 'unemployed', 'student', 'retired')),
  monthly_income DECIMAL(12,2),
  monthly_expenditure DECIMAL(12,2),
  financial_exposure INTEGER CHECK (financial_exposure >= 1 AND financial_exposure <= 10),
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'in_progress', 'completed', 'rejected')),
  kyc_data JSONB,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  biometric_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. OTP VERIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ROUND-UP SETTINGS TABLE
-- =====================================================
CREATE TABLE public.roundup_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  round_up_method TEXT DEFAULT 'nearest_dollar' CHECK (round_up_method IN ('nearest_dollar', 'custom_amount')),
  custom_amount DECIMAL(10,2),
  default_destination TEXT DEFAULT 'investment' CHECK (default_destination IN ('investment', 'charity')),
  minimum_roundup DECIMAL(10,2) DEFAULT 0.01,
  maximum_roundup DECIMAL(10,2) DEFAULT 5.00,
  monthly_limit DECIMAL(12,2),
  excluded_categories TEXT[],
  investment_allocation JSONB,
  charity_allocation JSONB,
  auto_invest_threshold DECIMAL(10,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TRANSACTIONS TABLE (for Round-Ups tracking)
-- =====================================================
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  roundup_amount DECIMAL(10,2),
  category TEXT,
  description TEXT,
  merchant_name TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  roundup_destination TEXT CHECK (roundup_destination IN ('investment', 'charity')),
  roundup_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CHARITY CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE public.charity_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. DONATIONS TABLE
-- =====================================================
CREATE TABLE public.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.charity_campaigns(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  donation_type TEXT CHECK (donation_type IN ('direct', 'roundup')) DEFAULT 'direct',
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all our custom tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roundup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- OTP verifications policies
CREATE POLICY "Users can manage own OTP verifications" ON public.otp_verifications
  FOR ALL USING (auth.uid() = user_id);

-- Round-up settings policies
CREATE POLICY "Users can manage own roundup settings" ON public.roundup_settings
  FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Charity campaigns policies (public read, admin write)
CREATE POLICY "Anyone can view active campaigns" ON public.charity_campaigns
  FOR SELECT USING (is_active = true);

-- Donations policies
CREATE POLICY "Users can view own donations" ON public.donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create donations" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 9. FUNCTIONS
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, email_verified)
  VALUES (NEW.id, NEW.email, NEW.email_confirmed_at IS NOT NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update campaign amount when donation is made
CREATE OR REPLACE FUNCTION public.update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.charity_campaigns 
    SET current_amount = current_amount + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. TRIGGERS
-- =====================================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roundup_settings_updated_at
  BEFORE UPDATE ON public.roundup_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_charity_campaigns_updated_at
  BEFORE UPDATE ON public.charity_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update campaign amounts
CREATE TRIGGER update_campaign_amount_trigger
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_amount();

-- =====================================================
-- 11. INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_phone ON public.users(phone_number);
CREATE INDEX idx_users_kyc_status ON public.users(kyc_status);

CREATE INDEX idx_otp_phone_created ON public.otp_verifications(phone_number, created_at DESC);
CREATE INDEX idx_otp_user_verified ON public.otp_verifications(user_id, verified);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_roundup ON public.transactions(user_id, roundup_processed);

CREATE INDEX idx_donations_user_created ON public.donations(user_id, created_at DESC);
CREATE INDEX idx_donations_campaign ON public.donations(campaign_id, status);

CREATE INDEX idx_campaigns_active ON public.charity_campaigns(is_active, start_date);

-- =====================================================
-- 12. SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample charity campaigns
INSERT INTO public.charity_campaigns (title, description, target_amount, image_url, category) VALUES
('Clean Water for Rural Kenya', 'Providing clean water access to rural communities in Kenya', 50000.00, 'https://example.com/water.jpg', 'Water & Sanitation'),
('Education for All', 'Supporting education initiatives for underprivileged children', 75000.00, 'https://example.com/education.jpg', 'Education'),
('Healthcare Support', 'Medical assistance for communities in need', 100000.00, 'https://example.com/healthcare.jpg', 'Healthcare');

-- =====================================================
-- SCHEMA SETUP COMPLETE!
-- =====================================================

-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.charity_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
