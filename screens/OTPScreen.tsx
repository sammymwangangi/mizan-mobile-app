import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore - Ignore the missing type declaration file
import MaskedView from '@react-native-masked-view/masked-view';
import CustomGradientText from 'components/CustomGradientText';
import { smsService } from '../services/smsService';
import { useAuth } from '../hooks/useAuth';

type OTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTP'>;

type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

const OTPScreen = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const phoneNumber = route.params?.phoneNumber || '0722 123 456';
  const userId = route.params?.userId;
  const { updateProfile } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Set up timer for resend code
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus to next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (isResendActive) {
      // Reset timer and OTP
      setTimer(30);
      setIsResendActive(false);
      setOtp(['', '', '', '', '', '']);
      // In a real app, you would call an API to resend the code
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    setError('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setLoading(true);

    try {
      const result = await smsService.verifyOTP(phoneNumber, otpCode);

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

      Alert.alert(
        'Success',
        'Phone number verified successfully!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('KYC'),
          },
        ]
      );

    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleResend = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setResending(true);
    setError('');

    try {
      const result = await smsService.resendOTP(userId, phoneNumber);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setTimer(30);
      setIsResendActive(false);
      Alert.alert('Success', 'Verification code sent successfully!');

    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
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
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title */}
          {gradientText}


          {/* Subtitle with phone number */}
          <Text style={styles.subtitle}>
            Please enter the 6 digit code we have sent to {phoneNumber}
          </Text>

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.otpInputContainer,
                  index === 2 || index === 3 ? styles.otpInputWithDash : null
                ]}
              >
                <TextInput
                  ref={(ref) => {
                    if (ref) {
                      inputRefs.current[index] = ref;
                    }
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
                {digit ? <View style={styles.otpDot} /> : null}
              </View>
            ))}
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Resend Code */}
          <TouchableOpacity
            onPress={handleResend}
            style={styles.resendContainer}
            disabled={!isResendActive || resending}
          >
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={[
                styles.resendText,
                isResendActive ? styles.activeResendText : styles.inactiveResendText
              ]}>
                {resending ? 'Sending...' : 'Resend'} {''}
              </Text>
              <Text style={styles.resendText}>
                 your code if it doesnt arrive in {formatTime(timer)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Display entered OTP for demo */}
          <Text style={styles.demoOtp}>{otp.join('-')}</Text>
        </View>

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
                {loading ? 'VERIFYING...' : 'NEXT'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 15,
  },
  titleGradient: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  titleText: {
    fontSize: 32,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#6D6E8A',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginLeft: 40,
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
    marginRight: 15,
    position: 'relative',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    color: 'transparent',
  },
  otpDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C27D9',
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontFamily: 'Poppins',
    color: '#6D6E8A',
    textAlign: 'center',
  },
  activeResendText: {
    fontFamily: 'Poppins',
    color: '#6D6E8A',
    textDecorationLine: 'underline',
  },
  inactiveResendText: {
    color: COLORS.textLight,
  },
  demoOtp: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
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
  errorContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    ...FONTS.medium(14),
    color: COLORS.error || '#FF3B30',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default OTPScreen;
