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
    this.baseUrl = 'https://api.africastalking.com/version1';
  }

  // Generate 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Format phone number for Kenya (+254)
  private formatPhoneNumber(phone: string): string {
    // Remove any spaces, dashes, or parentheses
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If it starts with 0, replace with +254
    if (cleaned.startsWith('0')) {
      cleaned = '+254' + cleaned.substring(1);
    }
    
    // If it doesn't start with +254, add it
    if (!cleaned.startsWith('+254')) {
      cleaned = '+254' + cleaned;
    }
    
    return cleaned;
  }

  // Send SMS using Africa's Talking API
  private async sendSMS(to: string, message: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messaging`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': this.apiKey,
        },
        body: new URLSearchParams({
          username: this.username,
          to: to,
          message: message,
        }),
      });

      const data = await response.json();

      if (data.SMSMessageData && data.SMSMessageData.Recipients) {
        const recipient = data.SMSMessageData.Recipients[0];
        if (recipient.status === 'Success') {
          return {
            success: true,
            message: 'SMS sent successfully',
            messageId: recipient.messageId,
          };
        } else {
          return {
            success: false,
            message: recipient.status || 'Failed to send SMS',
          };
        }
      }

      return {
        success: false,
        message: 'Invalid response from SMS service',
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send SMS',
      };
    }
  }

  // Send OTP to phone number
  async sendOTP(userId: string, phoneNumber: string): Promise<OTPResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const otpCode = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Store OTP in database
      const { data, error } = await supabase
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

      if (error) {
        console.error('Error storing OTP:', error);
        return {
          success: false,
          message: 'Failed to generate OTP',
        };
      }

      // Send SMS
      const message = `Your Mizan Money verification code is: ${otpCode}. This code expires in 10 minutes. Do not share this code with anyone.`;
      const smsResult = await this.sendSMS(formattedPhone, message);

      if (!smsResult.success) {
        // Delete the OTP record if SMS failed
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('id', data.id);

        return {
          success: false,
          message: smsResult.message,
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
