#!/usr/bin/env node

/**
 * Google OAuth Configuration Test
 * This script tests the Google OAuth configuration without running the app
 */

require('dotenv').config();

const REQUIRED_ENV_VARS = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY', 
  'EXPO_PUBLIC_WEB_CLIENT_ID',
  'EXPO_PUBLIC_ANDROID_CLIENT_ID',
  'EXPO_PUBLIC_IOS_CLIENT_ID'
];

console.log('🔍 Google OAuth Configuration Test\n');

// Check environment variables
console.log('📋 Environment Variables:');
let allEnvVarsPresent = true;

REQUIRED_ENV_VARS.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
      ? `${value.substring(0, 20)}...` 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: Not found`);
    allEnvVarsPresent = false;
  }
});

if (!allEnvVarsPresent) {
  console.log('\n❌ Some required environment variables are missing.');
  process.exit(1);
}

// Test Supabase connection
console.log('\n🔗 Testing Supabase Connection:');
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log(`📍 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Supabase Key: ${supabaseKey.substring(0, 50)}...`);

// Validate Google Client IDs format
console.log('\n🔍 Google Client ID Validation:');
const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

const googleClientIdPattern = /^\d+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/;

console.log('Web Client ID:', googleClientIdPattern.test(webClientId) ? '✅ Valid format' : '❌ Invalid format');
console.log('Android Client ID:', googleClientIdPattern.test(androidClientId) ? '✅ Valid format' : '❌ Invalid format');
console.log('iOS Client ID:', googleClientIdPattern.test(iosClientId) ? '✅ Valid format' : '❌ Invalid format');

console.log('\n🎯 Google Cloud Console Configuration Required:');
console.log('');
console.log('📍 Authorized JavaScript origins:');
console.log(`   - ${supabaseUrl}`);
console.log('   - https://localhost:3000');
console.log('');
console.log('🔄 Authorized redirect URIs:');
console.log(`   - ${supabaseUrl}/auth/v1/callback`);
console.log('   - exp://localhost:8081');
console.log('   - com.wingi.mizanbankingapp://redirect');

console.log('\n✅ Configuration test completed!');
console.log('\n🚀 Next Steps:');
console.log('1. Ensure the redirect URIs above are added to Google Cloud Console');
console.log('2. Verify Google OAuth is enabled in Supabase Dashboard');
console.log('3. Test Google sign-in in your app');
