// SMS Service for OTP verification

interface OTPResponse {
  success: boolean;
  message: string;
  data?: any;
}

class SMSService {
  // Send OTP to phone number
  async sendOTP(userId: string, phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`📱 Sending OTP to ${phoneNumber} for user ${userId}`);
      
      // In a real implementation, you would call your backend API
      // For demo purposes, we'll simulate a successful response
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        message: 'OTP sent successfully',
        data: {
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        },
      };
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  // Verify OTP code
  async verifyOTP(phoneNumber: string, otpCode: string): Promise<OTPResponse> {
    try {
      console.log(`🔐 Verifying OTP ${otpCode} for ${phoneNumber}`);
      
      // In a real implementation, you would call your backend API
      // For demo purposes, we'll simulate a successful response if code is valid
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit code
      if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
        return {
          success: false,
          message: 'Invalid OTP code. Please enter a valid 6-digit code.',
        };
      }
      
      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }
}

export const smsService = new SMSService();
