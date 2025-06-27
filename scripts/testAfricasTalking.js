/**
 * Test script for Africa's Talking SMS API
 * Run this to debug your AT credentials and API setup
 * 
 * Usage: node scripts/testAfricasTalking.js
 */

require('dotenv').config();

const API_KEY = process.env.EXPO_PUBLIC_AFRICAS_TALKING_API_KEY;
const USERNAME = process.env.EXPO_PUBLIC_AFRICAS_TALKING_USERNAME;

console.log('🧪 Africa\'s Talking API Test Script');
console.log('=====================================');

// Check credentials
console.log('\n1. Checking Credentials:');
console.log('  - API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : '❌ Not found');
console.log('  - Username:', USERNAME || '❌ Not found');

if (!API_KEY || !USERNAME) {
  console.error('\n❌ Missing credentials in .env file');
  process.exit(1);
}

// Determine base URL
const baseUrl = USERNAME === 'sandbox' 
  ? 'https://api.sandbox.africastalking.com/version1'
  : 'https://api.africastalking.com/version1';

console.log('  - Base URL:', baseUrl);

async function testCredentials() {
  console.log('\n2. Testing Credentials:');
  
  try {
    const response = await fetch(`${baseUrl}/user?username=${USERNAME}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'apiKey': API_KEY,
      },
    });

    const data = await response.json();
    
    console.log('  - Status:', response.status);
    console.log('  - Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.UserData) {
      console.log('✅ Credentials are valid!');
      console.log('  - Balance:', data.UserData.balance || 'Unknown');
      return true;
    } else {
      console.log('❌ Credentials test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testSMS() {
  console.log('\n3. Testing SMS Sending:');

  // Use sandbox test number
  const testNumber = USERNAME === 'sandbox' ? '+254711000000' : '+254700000000';
  const message = 'Test message from Mizan Money App';

  console.log('  - Test Number:', testNumber);
  console.log('  - Message:', message);

  try {
    console.log('  - Making request to:', `${baseUrl}/messaging`);
    console.log('  - Headers:', {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': `${API_KEY.substring(0, 10)}...`,
    });

    const response = await fetch(`${baseUrl}/messaging`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': API_KEY,
      },
      body: new URLSearchParams({
        username: USERNAME,
        to: testNumber,
        message: message,
      }),
    });

    console.log('  - Status:', response.status);
    console.log('  - Content-Type:', response.headers.get('content-type'));

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('  - JSON Response:', JSON.stringify(data, null, 2));
    } else {
      const textResponse = await response.text();
      console.log('  - Text Response (first 500 chars):', textResponse.substring(0, 500));
      console.log('❌ Expected JSON but got:', contentType);
      return false;
    }

    if (response.ok && data.SMSMessageData) {
      const recipient = data.SMSMessageData.Recipients[0];
      if (recipient.status === 'Success') {
        console.log('✅ SMS sent successfully!');
        console.log('  - Message ID:', recipient.messageId);
        return true;
      } else {
        console.log('❌ SMS failed:', recipient.status);
        console.log('  - Status Code:', recipient.statusCode);
        return false;
      }
    } else {
      console.log('❌ SMS API call failed');
      return false;
    }
  } catch (error) {
    console.error('❌ SMS Network error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('\n🚀 Starting Africa\'s Talking API Tests...\n');
  
  const credentialsValid = await testCredentials();
  
  if (credentialsValid) {
    await testSMS();
  } else {
    console.log('\n⚠️ Skipping SMS test due to invalid credentials');
  }
  
  console.log('\n📋 Troubleshooting Tips:');
  console.log('1. Ensure you\'re using the correct sandbox credentials');
  console.log('2. Check that your AT account has sufficient balance');
  console.log('3. Verify your phone number is registered for sandbox testing');
  console.log('4. Make sure you\'re using the sandbox API endpoint');
  console.log('5. Check AT dashboard for any account restrictions');
  
  console.log('\n🔗 Useful Links:');
  console.log('- AT Sandbox Dashboard: https://account.africastalking.com/apps/sandbox');
  console.log('- AT Documentation: https://developers.africastalking.com/docs');
}

// Run the tests
runTests().catch(console.error);
