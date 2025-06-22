import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: require('@react-native-async-storage/async-storage').default,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

console.log('✅ Supabase client initialized');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
