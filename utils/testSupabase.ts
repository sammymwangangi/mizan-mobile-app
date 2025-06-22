import { supabase } from '../supabaseConfig';

export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection test passed');
    return true;
  } catch (err) {
    console.error('💥 Supabase connection test error:', err);
    return false;
  }
};

export const testSupabaseAuth = async () => {
  try {
    console.log('🧪 Testing Supabase auth...');
    
    // Test auth session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase auth test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase auth test passed. Session:', !!session);
    return true;
  } catch (err) {
    console.error('💥 Supabase auth test error:', err);
    return false;
  }
};
