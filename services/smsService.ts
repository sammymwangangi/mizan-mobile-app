import { supabase } from '../supabaseConfig';

interface SMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

class SMSService {
  private apiKey: string;
  private username: string;
  private baseUrl: string;

  constructor() {
    // Africa's Talking credentials (you'll need to set these up)
    this.apiKey = process.env.EXPO_PUBLIC_AFRICAS_TALKING_API_KEY || 'your-api-key';
    this.username = process.env.EXPO_PUBLIC_AFRICAS_TALKING_USERNAME || 'your-username';

    // Use sandbox URL for sandbox username, production URL for live
    this.baseUrl = this.username === 'sandbox'
      ? 'https://api.sandbox.africastalking.com/version1'
      : 'https://api.africastalking.com/version1';

    // Debug credentials (without exposing sensitive data)
    console.log('📱 SMS Service initialized:');
    console.log('  - API Key configured:', this.apiKey !== 'your-api-key' ? '✅ Yes' : '❌ No');
    console.log('  - Username configured:', this.username !== 'your-username' ? '✅ Yes' : '❌ No');
    console.log('  - Base URL:', this.baseUrl);
  }

  // Generate 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Format phone number for Kenya (+254)
  private formatPhoneNumber(phone: string): string {
    // Remove any spaces, dashes, or parentheses
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // For sandbox testing, use a valid test number
    if (this.username === 'sandbox') {
      console.log('🧪 Sandbox mode: Original number:', cleaned);

      // In sandbox mode, we can only send to registered test numbers
      // For development/testing, we'll use the known working test number
      const sandboxTestNumber = '+254711000000';

      console.log('🧪 Sandbox mode: Redirecting SMS to test number:', sandboxTestNumber);
      console.log('⚠️ Note: In production, remove this sandbox override');

      // Store the original number for logging but use test number for actual SMS
      cleaned = sandboxTestNumber;
    } else {
      // Production formatting
      if (cleaned.startsWith('0')) {
        cleaned = '+254' + cleaned.substring(1);
      }

      if (!cleaned.startsWith('+254')) {
        cleaned = '+254' + cleaned;
      }
    }

    return cleaned;
  }

  // Send SMS using Africa's Talking API
  private async sendSMS(to: string, message: string): Promise<SMSResponse> {
    try {
      console.log('📱 Sending SMS with Africa\'s Talking:');
      console.log('  - URL:', `${this.baseUrl}/messaging`);
      console.log('  - Username:', this.username);
      console.log('  - To:', to);
      console.log('  - API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');

      // Prepare request body - use manual encoding for better React Native compatibility
      const formData = `username=${encodeURIComponent(this.username)}&to=${encodeURIComponent(to)}&message=${encodeURIComponent(message)}`;

      console.log('📱 Request details:');
      console.log('  - Body:', formData);

      // Add timeout and better error handling for React Native
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${this.baseUrl}/messaging`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': this.apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      console.log('📱 Africa\'s Talking API Response:');
      console.log('  - Status:', response.status);
      console.log('  - Content-Type:', contentType);

      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('  - JSON Response:', JSON.stringify(data, null, 2));
      } else {
        // If not JSON, get as text to see what we're actually receiving
        const textResponse = await response.text();
        console.log('  - Text Response (first 500 chars):', textResponse.substring(0, 500));

        // Try to extract error message from HTML if it's an error page
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          return {
            success: false,
            message: `API returned HTML error page instead of JSON. Status: ${response.status}. This usually indicates an authentication or endpoint issue.`,
          };
        }

        // If it's not HTML, try to parse as JSON anyway
        try {
          data = JSON.parse(textResponse);
        } catch {
          return {
            success: false,
            message: `Invalid response format. Expected JSON but got: ${textResponse.substring(0, 100)}...`,
          };
        }
      }

      if (!response.ok) {
        console.error('📱 Africa\'s Talking API Error - Status:', response.status);
        return {
          success: false,
          message: `API Error: ${response.status} - ${data.message || 'Unknown error'}`,
        };
      }

      if (data.SMSMessageData && data.SMSMessageData.Recipients) {
        const recipient = data.SMSMessageData.Recipients[0];
        console.log('📱 SMS Recipient Status:', recipient);

        if (recipient.status === 'Success') {
          return {
            success: true,
            message: 'SMS sent successfully',
            messageId: recipient.messageId,
          };
        } else {
          return {
            success: false,
            message: `SMS failed: ${recipient.status} - ${recipient.statusCode || 'No status code'}`,
          };
        }
      }

      console.error('📱 Invalid API response structure:', data);
      return {
        success: false,
        message: `Invalid response from SMS service: ${JSON.stringify(data)}`,
      };
    } catch (error) {
      console.error('📱 SMS Network Error:', error);

      let errorMessage = 'Network error occurred while sending SMS';
      if (error instanceof Error) {
        errorMessage = `Network error: ${error.message}`;

        // If it's a JSON parse error, try XMLHttpRequest as fallback
        if (error.message.includes('JSON Parse error') || error.message.includes('Unexpected character')) {
          console.log('🔄 Trying XMLHttpRequest fallback...');
          return await this.sendSMSWithXHR(to, message);
        }
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // Fallback SMS method using XMLHttpRequest
  private async sendSMSWithXHR(to: string, message: string): Promise<SMSResponse> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const formData = `username=${encodeURIComponent(this.username)}&to=${encodeURIComponent(to)}&message=${encodeURIComponent(message)}`;

      xhr.open('POST', `${this.baseUrl}/messaging`, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('apiKey', this.apiKey);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log('📱 XHR Response Status:', xhr.status);
          console.log('📱 XHR Response Text:', xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);

              if (data.SMSMessageData && data.SMSMessageData.Recipients) {
                const recipient = data.SMSMessageData.Recipients[0];

                if (recipient.status === 'Success') {
                  resolve({
                    success: true,
                    message: 'SMS sent successfully',
                    messageId: recipient.messageId,
                  });
                } else {
                  resolve({
                    success: false,
                    message: `SMS failed: ${recipient.status} - ${recipient.statusCode || 'No status code'}`,
                  });
                }
              } else {
                resolve({
                  success: false,
                  message: `Invalid response structure: ${xhr.responseText}`,
                });
              }
            } catch {
              resolve({
                success: false,
                message: `XHR JSON parse error: ${xhr.responseText}`,
              });
            }
          } else {
            resolve({
              success: false,
              message: `XHR HTTP error: ${xhr.status} - ${xhr.responseText}`,
            });
          }
        }
      };

      xhr.onerror = function() {
        resolve({
          success: false,
          message: 'XHR network error occurred',
        });
      };

      xhr.send(formData);
    });
  }

  // Test Africa's Talking API credentials
  async testCredentials(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 Testing Africa\'s Talking API credentials...');

      if (this.apiKey === 'your-api-key' || this.username === 'your-username') {
        return {
          success: false,
          message: 'Africa\'s Talking credentials not configured. Please set EXPO_PUBLIC_AFRICAS_TALKING_API_KEY and EXPO_PUBLIC_AFRICAS_TALKING_USERNAME in your .env file',
        };
      }

      // Test with a simple API call to check balance or user info
      console.log('🧪 Testing credentials with URL:', `${this.baseUrl}/user?username=${this.username}`);

      const response = await fetch(`${this.baseUrl}/user?username=${this.username}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apiKey': this.apiKey,
        },
      });

      const data = await response.json();
      console.log('🧪 Credentials test response:', data);

      if (response.ok && data.UserData) {
        return {
          success: true,
          message: `Credentials valid. Balance: ${data.UserData.balance || 'Unknown'}`,
        };
      } else {
        return {
          success: false,
          message: `Invalid credentials: ${data.message || 'Authentication failed'}`,
        };
      }
    } catch (error) {
      console.error('🧪 Credentials test error:', error);
      return {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Send OTP to phone number
  async sendOTP(userId: string, phoneNumber: string): Promise<OTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const otpCode = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      console.log('📝 Attempting to store OTP in database...');
      console.log('  - User ID:', userId);
      console.log('  - Phone:', formattedPhone);
      console.log('  - OTP Code:', otpCode);

      // Check current session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('🔐 Current session:', {
        hasSession: !!sessionData.session,
        userId: sessionData.session?.user?.id,
        isAuthenticated: !!sessionData.session?.access_token
      });

      // Try to insert OTP record with different approaches
      let data, error;

      // First attempt: Try with current session
      const insertResult = await supabase
        .from('otp_verifications')
        .insert({
          user_id: userId,
          phone_number: formattedPhone,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString(),
          verified: false,
          attempts: 0,
        })
        .select()
        .single();

      data = insertResult.data;
      error = insertResult.error;

      // If RLS error, try with a direct SQL approach
      if (error && error.code === '42501') {
        console.log('🔄 RLS error detected, trying alternative approach...');

        // Use RPC function to bypass RLS
        const rpcResult = await supabase.rpc('insert_otp_verification', {
          p_user_id: userId,
          p_phone_number: formattedPhone,
          p_otp_code: otpCode,
          p_expires_at: expiresAt.toISOString()
        });

        if (rpcResult.error) {
          console.error('RPC insert also failed:', rpcResult.error);
        } else {
          // If RPC succeeds, get the inserted record
          const selectResult = await supabase
            .from('otp_verifications')
            .select('*')
            .eq('user_id', userId)
            .eq('phone_number', formattedPhone)
            .eq('otp_code', otpCode)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          data = selectResult.data;
          error = selectResult.error;
        }
      }

      if (error) {
        console.error('Error storing OTP:', error);

        // Provide specific error messages based on error code
        let errorMessage = 'Failed to generate OTP';
        if (error.code === '42501') {
          errorMessage = 'Database permission error: RLS policies need to be configured for otp_verifications table';
        } else if (error.code === '23503') {
          errorMessage = 'User not found in database';
        } else if (error.message) {
          errorMessage = `Database error: ${error.message}`;
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      // Send SMS
      let message = `Your Mizan Money verification code is: ${otpCode}. This code expires in 10 minutes. Do not share this code with anyone.`;

      // Add sandbox notice if in sandbox mode
      if (this.username === 'sandbox') {
        message += ` [SANDBOX MODE - This is a test SMS]`;
      }

      const smsResult = await this.sendSMS(formattedPhone, message);

      if (!smsResult.success) {
        console.error('📱 SMS sending failed:', smsResult.message);

        // Delete the OTP record if SMS failed
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('id', data.id);

        return {
          success: false,
          message: `SMS sending failed: ${smsResult.message}`,
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully',
        otpId: data.id,
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otpCode: string): Promise<OTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Get the latest OTP for this phone number
      const { data: otpRecord, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone_number', formattedPhone)
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !otpRecord) {
        return {
          success: false,
          message: 'No valid OTP found for this phone number',
        };
      }

      // Check if OTP has expired
      if (new Date() > new Date(otpRecord.expires_at)) {
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.',
        };
      }

      // Check if too many attempts
      if (otpRecord.attempts >= 3) {
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.',
        };
      }

      // Verify OTP code
      if (otpRecord.otp_code !== otpCode) {
        // Increment attempts
        await supabase
          .from('otp_verifications')
          .update({ attempts: otpRecord.attempts + 1 })
          .eq('id', otpRecord.id);

        return {
          success: false,
          message: 'Invalid OTP code',
        };
      }

      // Mark OTP as verified
      await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      // Update user's phone verification status
      await supabase
        .from('users')
        .update({ 
          phone_verified: true,
          phone_number: formattedPhone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', otpRecord.user_id);

      return {
        success: true,
        message: 'Phone number verified successfully',
        otpId: otpRecord.id,
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }

  // Resend OTP (with rate limiting)
  async resendOTP(userId: string, phoneNumber: string): Promise<OTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Check if user has requested OTP recently (rate limiting)
      const { data: recentOTP } = await supabase
        .from('otp_verifications')
        .select('created_at')
        .eq('user_id', userId)
        .eq('phone_number', formattedPhone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentOTP) {
        const timeSinceLastOTP = Date.now() - new Date(recentOTP.created_at).getTime();
        const minInterval = 60 * 1000; // 1 minute

        if (timeSinceLastOTP < minInterval) {
          const remainingTime = Math.ceil((minInterval - timeSinceLastOTP) / 1000);
          return {
            success: false,
            message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          };
        }
      }

      // Send new OTP
      return await this.sendOTP(userId, phoneNumber);
    } catch (error) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to resend OTP',
      };
    }
  }
}

export const smsService = new SMSService();
