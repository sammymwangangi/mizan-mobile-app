import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface BiometricCapabilities {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  warning?: string;
}

class BiometricService {
  private static instance: BiometricService;
  private capabilities: BiometricCapabilities | null = null;

  static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  // Check device biometric capabilities
  async checkCapabilities(): Promise<BiometricCapabilities> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      this.capabilities = {
        isAvailable: hasHardware && isEnrolled,
        hasHardware,
        isEnrolled,
        supportedTypes,
      };

      return this.capabilities;
    } catch (error) {
      console.error('Error checking biometric capabilities:', error);
      this.capabilities = {
        isAvailable: false,
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
      return this.capabilities;
    }
  }

  // Get user-friendly biometric type name
  getBiometricTypeName(): string {
    if (!this.capabilities) {
      return 'Biometric';
    }

    const { supportedTypes } = this.capabilities;

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    }

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    }

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Recognition';
    }

    return 'Biometric';
  }

  // Authenticate user with biometrics
  async authenticate(reason?: string): Promise<BiometricAuthResult> {
    try {
      // Check capabilities first
      const capabilities = await this.checkCapabilities();

      if (!capabilities.hasHardware) {
        return {
          success: false,
          error: 'Biometric hardware not available on this device',
        };
      }

      if (!capabilities.isEnrolled) {
        return {
          success: false,
          error: 'No biometric credentials enrolled. Please set up biometric authentication in your device settings.',
        };
      }

      const biometricType = this.getBiometricTypeName();
      const defaultReason = `Use ${biometricType} to authenticate`;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || defaultReason,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
        };
      } else {
        let errorMessage = 'Authentication failed';

        if (result.error === 'user_cancel') {
          errorMessage = 'Authentication cancelled by user';
        } else if (result.error === 'user_fallback') {
          errorMessage = 'User chose to use device passcode';
        } else if (result.error === 'system_cancel') {
          errorMessage = 'Authentication cancelled by system';
        } else if (result.error === 'app_cancel') {
          errorMessage = 'Authentication cancelled by app';
        } else if (result.error === 'invalid_context') {
          errorMessage = 'Invalid authentication context';
        } else if (result.error === 'not_available') {
          errorMessage = 'Biometric authentication not available';
        } else if (result.error === 'not_enrolled') {
          errorMessage = 'No biometric credentials enrolled';
        } else if (result.error === 'lockout') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (result.error === 'lockout_permanent') {
          errorMessage = 'Biometric authentication permanently locked. Please use device passcode.';
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Biometric authentication failed',
      };
    }
  }

  // Enable biometric login for user
  async enableBiometricLogin(userId: string): Promise<BiometricAuthResult> {
    try {
      const capabilities = await this.checkCapabilities();

      if (!capabilities.isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication not available',
        };
      }

      // Authenticate first to confirm user identity
      const authResult = await this.authenticate('Enable biometric login for Mizan Money');

      if (!authResult.success) {
        return authResult;
      }

      // Store biometric preference
      await SecureStore.setItemAsync(`biometric_enabled_${userId}`, 'true');

      return {
        success: true,
      };
    } catch (error) {
      console.error('Enable biometric login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enable biometric login',
      };
    }
  }

  // Disable biometric login for user
  async disableBiometricLogin(userId: string): Promise<BiometricAuthResult> {
    try {
      // Remove biometric preference
      await SecureStore.deleteItemAsync(`biometric_enabled_${userId}`);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Disable biometric login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to disable biometric login',
      };
    }
  }

  // Check if biometric login is enabled for user
  async isBiometricLoginEnabled(userId: string): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(`biometric_enabled_${userId}`);
      return enabled === 'true';
    } catch (error) {
      console.error('Check biometric login status error:', error);
      return false;
    }
  }

  // Authenticate for biometric login
  async authenticateForLogin(userId: string): Promise<BiometricAuthResult> {
    try {
      const isEnabled = await this.isBiometricLoginEnabled(userId);

      if (!isEnabled) {
        return {
          success: false,
          error: 'Biometric login not enabled for this user',
        };
      }

      const biometricType = this.getBiometricTypeName();
      return await this.authenticate(`Use ${biometricType} to sign in to Mizan Money`);
    } catch (error) {
      console.error('Biometric login authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Biometric login failed',
      };
    }
  }

  // Get current capabilities (cached)
  getCurrentCapabilities(): BiometricCapabilities | null {
    return this.capabilities;
  }
}

export const biometricService = BiometricService.getInstance();
