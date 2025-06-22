import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { normalize, getResponsiveWidth } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
// @ts-ignore - Ignore the missing type declaration file
import MaskedView from '@react-native-masked-view/masked-view';
import { useAuth } from '../hooks/useAuth';
import { smsService } from '../services/smsService';

type PhoneNumberScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneNumber'>;

const PhoneNumberScreen = () => {
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('254'); // Kenya country code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debug user state
  useEffect(() => {
    console.log('📱 PhoneNumberScreen - User state:', {
      user: !!user,
      userId: user?.id,
      email: user?.email,
      authLoading
    });
  }, [user, authLoading]);

  const validatePhoneNumber = (phone: string): boolean => {
    // Kenya phone number validation
    const kenyanPhoneRegex = /^[17]\d{8}$/;
    return kenyanPhoneRegex.test(phone);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any spaces, dashes, or parentheses
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // If it starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    return `+254${cleaned}`;
  };

  const handleSubmit = async () => {
    setError('');

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    if (!user) {
      console.error('❌ User not authenticated in PhoneNumberScreen');
      Alert.alert(
        'Authentication Required',
        'Please sign in first to continue with phone verification.',
        [
          { text: 'Go to Sign In', onPress: () => navigation.navigate('Auth') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Send OTP
      const otpResult = await smsService.sendOTP(user.id, formattedPhone);

      if (!otpResult.success) {
        setError(otpResult.message);
        return;
      }

      // Update user profile with phone number
      const updateResult = await updateProfile({
        phone_number: formattedPhone,
      });

      if (updateResult.error) {
        console.error('Failed to update profile:', updateResult.error);
        // Continue anyway since OTP was sent successfully
      }

      // Navigate to OTP verification screen
      navigation.navigate('OTP', {
        phoneNumber: formattedPhone,
        userId: user.id,
      });

    } catch (error) {
      console.error('Phone number verification error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Auth');
  };

  const gradientText = (
    <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
      <MaskedView
        style={{ height: 90, width: 390 }}
        maskElement={
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 30, textAlign: 'center' }}>
              Powerhouse - Shariah Finance, Begins Now
            </Text>
          </View>
        }
      >
        <LinearGradient
          colors={['#80B2FF', '#7C27D9', '#FF68F0']}
          locations={[0, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
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
      {/* Pattern at the top */}
      <Image
        source={require('../assets/kyc/PhoneNumberPattern.png')}
        style={styles.patternImage}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Gradient Title */}
          {gradientText}

          {/* Subtitle */}
          <Text style={styles.subtitleText}>
            Your personal shariah compliant all in one banking app.
          </Text>

          {/* Phone Input Section */}
          <View style={styles.inputContainer}>
            {/* Country Code Picker */}
            <View style={styles.countrySection}>
              <TouchableOpacity style={styles.countryCodeContainer}>
                <Text style={styles.countryLabel}>Country</Text>
                <View style={styles.countryCodeRow}>
                  <View style={styles.flagContainer}>
                    <Text style={styles.flagEmoji}>🇰🇪</Text>
                  </View>
                  <Text style={styles.countryCodeText}>+{countryCode}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Phone Number Input */}
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder="712345678"
                placeholderTextColor={COLORS.placeholder}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={9}
                editable={!loading}
              />
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <View style={styles.submitButtonWrapper}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButtonContainer, loading && styles.submitButtonDisabled]}
              disabled={loading}
            >
              <LinearGradient
                colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.submitButton, { shadowColor: '#6943AF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 20 }]}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'SENDING...' : 'CONTINUE'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Sign In Link with dotted underline */}
          <View style={styles.signInContainer}>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInText}>I have another account</Text>
              <View style={styles.dottedUnderline} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
  },
  patternImage: {
    width: '100%',
    height: 330,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    marginTop: 40, // Overlap with the pattern image
    // alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleText: {
    ...FONTS.h1,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C27D9', // Using the middle color from the gradient
  },
  subtitleText: {
    ...FONTS.body3,
    color: '#6D6E8A',
    textAlign: 'center',
    marginBottom: 43,
    paddingHorizontal: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 57,
  },
  countrySection: {
    marginRight: 10,
  },
  phoneSection: {
    flex: 1,
  },
  inputLabel: {
    ...FONTS.medium(14),
    color: '#6D6E8A',
    marginBottom: 8,
    marginLeft: 5,
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    width: 120,
  },
  countryLabel: {
    ...FONTS.medium(10),
    color: '#6D6E8A',
    marginBottom: 5,
    textAlign: 'left',
  },
  countryCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    marginRight: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
  },
  countryCodeText: {
    ...FONTS.medium(14),
    color: COLORS.text,
    marginRight: 5,
  },
  phoneInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  phoneInput: {
    ...FONTS.medium(16),
    color: COLORS.text,
    height: 50,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },

  submitButtonWrapper: {
    shadowColor: '#391A73',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },

  submitButtonContainer: {
    marginBottom: 0,
    backgroundColor: 'white',
    borderRadius: 40,
    shadowColor: '#391A73', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .5, shadowRadius: 4, elevation: 20
  },
  submitButton: {
    height: normalize(55),
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  submitButtonText: {
    color: 'white',
    ...FONTS.semibold(15),
    letterSpacing: 1,
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 30,
    // overflow: 'hidden'
  },
  signInText: {
    ...FONTS.body4,
    color: '#6D6E8A',
  },
  dottedUnderline: {
    height: 1,
    marginTop: 5,
    borderRadius: 0.005,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#6D6E8A',
  },
  flagEmoji: {
    fontSize: 20,
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: getResponsiveWidth(24),
  },
  errorText: {
    ...FONTS.medium(14),
    color: COLORS.error || '#FF3B30',
    textAlign: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});

export default PhoneNumberScreen;
