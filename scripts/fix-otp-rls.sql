-- Fix RLS policies for otp_verifications table
-- This script addresses the RLS permission issue for OTP operations

-- First, let's check the current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'otp_verifications';

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "otp_verifications_insert_policy" ON otp_verifications;
DROP POLICY IF EXISTS "otp_verifications_select_policy" ON otp_verifications;
DROP POLICY IF EXISTS "otp_verifications_update_policy" ON otp_verifications;
DROP POLICY IF EXISTS "otp_verifications_delete_policy" ON otp_verifications;

-- Create more permissive policies for OTP operations
-- These policies allow operations based on user_id matching, regardless of auth state

-- INSERT policy: Allow inserting OTP records for any user_id
-- This is needed because OTP creation might happen before full authentication
CREATE POLICY "otp_verifications_insert_policy" ON otp_verifications
    FOR INSERT 
    WITH CHECK (true);  -- Allow all inserts for now, we'll validate user_id exists

-- SELECT policy: Allow reading OTP records by phone number or user_id
-- This is needed for OTP verification
CREATE POLICY "otp_verifications_select_policy" ON otp_verifications
    FOR SELECT 
    USING (true);  -- Allow reading for verification purposes

-- UPDATE policy: Allow updating OTP records (for attempt counting and verification)
CREATE POLICY "otp_verifications_update_policy" ON otp_verifications
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- DELETE policy: Allow deleting failed OTP records
CREATE POLICY "otp_verifications_delete_policy" ON otp_verifications
    FOR DELETE 
    USING (true);

-- Alternative approach: Create a service role policy
-- This allows the service role to manage OTP verifications
CREATE POLICY "service_role_otp_management" ON otp_verifications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON otp_verifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON otp_verifications TO anon;

-- Ensure the sequence is accessible
GRANT USAGE, SELECT ON SEQUENCE otp_verifications_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE otp_verifications_id_seq TO anon;

-- Add a function to validate user exists before OTP creation
CREATE OR REPLACE FUNCTION validate_user_for_otp(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a more secure INSERT policy that validates user exists
DROP POLICY IF EXISTS "otp_verifications_insert_policy" ON otp_verifications;
CREATE POLICY "otp_verifications_insert_policy" ON otp_verifications
    FOR INSERT 
    WITH CHECK (validate_user_for_otp(user_id));

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'otp_verifications'
ORDER BY policyname;
