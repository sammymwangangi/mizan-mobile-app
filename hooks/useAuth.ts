import { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabaseConfig';
import { UserProfile } from '../types/supabase';
import * as SecureStore from 'expo-secure-store';

interface UseAuthReturn {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, phone?: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  sendOTP: (phone: string) => Promise<{ error: AuthError | null }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (session && mounted) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Authentication initialization failed');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
            // Store session info securely
            await SecureStore.setItemAsync('userToken', session.access_token);
            await SecureStore.setItemAsync('userUID', session.user.id);
          } else {
            setUserProfile(null);
            // Clear stored session info
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userUID');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const signUp = async (email: string, password: string, phone?: string) => {
    try {
      setError(null);
      console.log('🔄 Starting signup process for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone_number: phone,
          }
        }
      });

      console.log('📝 Signup response:', { data: !!data, error: error?.message });

      if (error) {
        console.error('❌ Signup error:', error);
        setError(error.message);
        return { user: null, error };
      }

      // Create user profile - Note: This might fail if user already exists
      if (data.user) {
        console.log('👤 Creating user profile for:', data.user.id);
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            phone_number: phone || null,
            kyc_status: 'pending',
            is_active: true,
            email_verified: false,
            phone_verified: false,
            biometric_enabled: false,
          });

        if (profileError) {
          console.error('⚠️ Error creating user profile (might already exist):', profileError);
          // Don't fail the signup if profile creation fails - it might already exist
        } else {
          console.log('✅ User profile created successfully');
        }
      }

      return { user: data.user, error: null };
    } catch (err) {
      console.error('💥 Signup catch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { user: null, error: { message: errorMessage } as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('🔄 Starting signin process for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📝 Signin response:', {
        user: !!data.user,
        session: !!data.session,
        error: error?.message
      });

      if (error) {
        console.error('❌ Signin error:', error);
        setError(error.message);
        return { user: null, error };
      }

      console.log('✅ Signin successful');
      return { user: data.user, error: null };
    } catch (err) {
      console.error('💥 Signin catch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { user: null, error: { message: errorMessage } as AuthError };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      setError(null);
      // This will be implemented with SMS service integration
      // For now, return success
      console.log('Sending OTP to:', phone);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      setError(null);
      // This will be implemented with SMS service integration
      // For now, return success
      console.log('Verifying OTP for:', phone, otp);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed';
      setError(errorMessage);
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      setError(null);
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        setError(error.message);
        return { error: new Error(error.message) };
      }

      // Refresh profile
      await fetchUserProfile(user.id);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      return { error: new Error(errorMessage) };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  return {
    user,
    userProfile,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    sendOTP,
    verifyOTP,
    updateProfile,
    refreshProfile,
  };
};
