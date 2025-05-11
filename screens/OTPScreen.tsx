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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type OTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTP'>;

type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

const OTPScreen = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const phoneNumber = route.params?.phoneNumber || '0722 123 456';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
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

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // In a real app, you would validate the OTP here
      navigation.navigate('KYC');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>6-digit code</Text>

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

          {/* Resend Code */}
          <TouchableOpacity
            onPress={handleResendCode}
            style={styles.resendContainer}
            disabled={!isResendActive}
          >
            <Text style={[
              styles.resendText,
              isResendActive ? styles.activeResendText : styles.inactiveResendText
            ]}>
              Resend your code if it doesnt arrive in {formatTime(timer)}
            </Text>
          </TouchableOpacity>

          {/* Display entered OTP for demo */}
          <Text style={styles.demoOtp}>{otp.join('-')}</Text>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButtonContainer}
            onPress={handleVerifyOTP}
          >
            <LinearGradient
              colors={['#5592EF', '#8532E0', '#F053E0']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>NEXT</Text>
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
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: '#7C27D9',
    marginBottom: 10,
    fontSize: 28,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
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
    ...FONTS.body4,
    textAlign: 'center',
  },
  activeResendText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  inactiveResendText: {
    color: COLORS.textLight,
  },
  demoOtp: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  nextButtonContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  nextButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 30,
  },
  nextButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default OTPScreen;
