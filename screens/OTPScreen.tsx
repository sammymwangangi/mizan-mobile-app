import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { smsService } from '../services/smsService';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import CodeInput from '../components/CodeInput';

type OTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

const OTPScreen = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const { phoneNumber, userId } = route.params;
  const { updateProfile } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    setTimer(60);
    
    try {
      const result = await smsService.sendOTP(userId, phoneNumber);
      
      if (!result.success) {
        setError(result.message);
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.join('') !== '123456') {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const result = await smsService.verifyOTP(phoneNumber, otp.join(''));

      if (!result.success) {
        setError(result.message);
        return;
      }

      // Update user profile to mark phone as verified
      const updateResult = await updateProfile({
        phone_verified: true,
      });

      if (updateResult.error) {
        console.error('Failed to update profile:', updateResult.error);
        // Continue anyway since OTP was verified successfully
      }

      // Navigate to success screen
      navigation.navigate('SuccessScreen', { authMethod: 'phone' });

    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus to next input with robust scheduling
    if (text !== '' && index < 5) {
      const nextIndex = index + 1;
      const nextRef = inputRefs.current[nextIndex];
      // Blur current to help some Android keyboards
      inputRefs.current[index]?.blur();
      requestAnimationFrame(() => nextRef?.focus());
      setTimeout(() => nextRef?.focus(), 60);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const gradientText = (
    <View style={{ padding: 20 }}>
      <MaskedView
        style={{ height: 60, width: 300 }}
        maskElement={
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ ...FONTS.semibold(32) }}>
              6-digit code
            </Text>
          </View>
        }
      >
        <LinearGradient
          colors={['#80B2FF', '#7C27D9', '#FF68F0']}
          locations={[0, 0.5155, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

      <View style={styles.content}>
        {gradientText}
        <Text style={styles.subtitle}>
          We sent the code, sabr In Shaa Allah
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <CodeInput
            length={6}
            mode="otp"
            value={otp.join('')}
            onChange={(code) => setOtp(code.split(''))}
            autoFocus
          />
        </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

        {/* Resend Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            If the code hasn&apos;t arrived, take a deep breath—we&apos;ll resend it in{' '}
            <Text style={styles.timerDigits}>{timer}s</Text>
          </Text>
        </View>

        {/* Verify Button */}
        {/* Next Button - Moved outside content view to position at bottom */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.nextButtonContainer, loading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {loading ? 'VERIFYING...' : 'VERIFY'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Resend Button */}
        <TouchableOpacity
          style={[styles.resendButton, timer > 0 && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={timer > 0 || loading}
        >
          <Text style={styles.resendButtonText}>RESEND CODE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    // marginLeft: 40,
  },
  otpInputContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputWithDash: {
    // marginRight: 15,
    position: 'relative',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.text,
  },
  otpDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C27D9',
  },
  errorContainer: {
    marginBottom: 15,
  },
  errorText: {
    ...FONTS.medium(14),
    color: COLORS.error || '#FF3B30',
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: 30,
  },
  timerText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  timerDigits: {
    ...FONTS.semibold(14),
    color: COLORS.primary,
  },
  verifyButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    ...FONTS.semibold(16),
    color: 'white',
    letterSpacing: 1,
  },
  resendButton: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textLight,
  },
  bottomButtonContainer: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 20,
  },
  nextButtonContainer: {
    width: '100%',
  },
  nextButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 340,
  },
  nextButtonText: {
    ...FONTS.semibold(15),
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default OTPScreen;
