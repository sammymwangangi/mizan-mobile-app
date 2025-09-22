import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

import { ChevronDown } from 'lucide-react-native';

import Input from '../components/Input';
import { smsService } from '../services/smsService';
import { supabase } from '../supabaseConfig';



import { normalize } from 'utils';
import { COUNTRIES } from '../constants/countries';

// Complete the auth session for better OAuth handling


type AuthOptionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthOptions'>;
type AuthOptionsScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'AuthOptions'>['route'];

const AuthOptionsScreen = () => {
  const navigation = useNavigation<AuthOptionsScreenNavigationProp>();
  const route = useRoute<AuthOptionsScreenRouteProp>();

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('United Arab Emirates (+971)');
  const [countries] = useState<string[]>(COUNTRIES);
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryCode, setCountryCode] = useState('971');
  const { user, session, updateProfile } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  // removed old fixed countryCode state; countryCode is managed via setCountryCode above
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');




  const routeParams = route.params;
  const tempUserId = routeParams?.tempUserId;









  // Handle terms checkbox toggle
  const handleTermsToggle = () => {
    setTermsAccepted(!termsAccepted);
  };



  const validatePhoneNumber = (phone: string) => {
    // Basic validation for Kenyan phone numbers
    const phoneRegex = /^[7][0-9]{8}$/;
    return phoneRegex.test(phone);
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

    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions to continue');
      return;
    }

    setLoading(true);

    try {
      // Format phone number with country code
      const formattedPhone = `+${countryCode}${phoneNumber}`;
      console.log('📱 Sending OTP to:', formattedPhone);

      // Get user ID (either from authenticated user or temp ID)
      const userId = user?.id || session?.user?.id || tempUserId || 'temp-user-id';

      // Send OTP
      const otpResult = await smsService.sendOTP(userId, formattedPhone);

      if (!otpResult.success) {
        console.error('❌ OTP sending failed:', otpResult.message);
        setError(otpResult.message);
        return;
      }

      console.log('✅ OTP sent successfully');

      // Update user profile with phone number (if user is authenticated)
      if (user || session) {
        const updateResult = await updateProfile({
          phone_number: formattedPhone,
        });

        if (updateResult.error) {
          console.error('⚠️ Failed to update profile:', updateResult.error);
          // Continue anyway since OTP was sent successfully
        } else {
          console.log('✅ User profile updated with phone number');
        }
      } else {
        console.log('ℹ️ Skipping profile update - user not fully authenticated yet');
      }

      // Navigate to OTP verification screen
      console.log('🔄 Navigating to OTP screen');
      navigation.navigate('OTP', {
        phoneNumber: formattedPhone,
        userId: userId,
      });

    } catch (error) {
      console.error('💥 Phone number verification error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Handle email authentication
  const handleEmailAuth = () => {
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms & Conditions to continue');
      return;
    }
    navigation.navigate('EmailInput');
  };

  // Handle Google Sign-in (UI only, disabled)
  const handleGoogleSignIn = async () => {
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the Terms & Conditions to continue');
      return;
    }
    Alert.alert('Not available', 'Google sign-in is temporarily disabled');
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, Let&apos;s get started</Text>
        </View>

        {/* Country/Region Selector */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.countrySelector}
            onPress={() => setCountryModalVisible(true)}
          >
            <View style={styles.countrySelectorContent}>
              <Text style={styles.countryPlaceholder}>Country / Region</Text>
              <Text style={styles.countrySelectorText}>{selectedCountry}</Text>
            </View>
            <ChevronDown size={20} color="#6D6E8A" />
          </TouchableOpacity>

          <Modal
            visible={isCountryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCountryModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
              <View style={{ maxHeight: '70%', backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }}>
                <TextInput
                  placeholder="Search country"
                  value={countrySearch}
                  onChangeText={setCountrySearch}
                  style={{ height: 44, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 }}
                />
                <ScrollView>
                  {countries
                    .filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
                    .map(countryLabel => (
                      <TouchableOpacity
                        key={countryLabel}
                        style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}
                        onPress={() => {
                          setSelectedCountry(countryLabel);
                          // extract digits inside parentheses as country code (e.g. +971 -> 971)
                          const match = countryLabel.match(/\(\+?([0-9\-]+)\)/);
                          if (match && match[1]) {
                            const code = match[1].replace(/[^0-9]/g, '');
                            setCountryCode(code);
                          }
                          setCountryModalVisible(false);
                        }}
                      >
                        <Text style={{ ...FONTS.body5 }}>{countryLabel}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Input
            placeholder="Your Mobile number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={9}
            style={styles.phoneInput}
          />
          <Text style={styles.inputHint}>
            We&apos;ll only use your number for verification – no spam. Promise.
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Confirm Identity Button */}
        <TouchableOpacity
          style={styles.primaryButtonContainer}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
            locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Confirm Identity</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.encryptionText}>Your data is encrypted end-to-end</Text>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Email Authentication */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          <Image source={require('../assets/email-icon.png')} style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Continue with e-mail</Text>
        </TouchableOpacity>

        {/* Apple Authentication (UI only) */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Not available', 'Apple sign-in is temporarily disabled')}
            disabled={loading}
          >
            <Image source={require('../assets/apple-icon.png')} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}


        {/* Google Authentication */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Image source={require('../assets/google-icon.png')} style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleTermsToggle}
            activeOpacity={0.7}
          >
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                termsAccepted && styles.radioOuterSelected
              ]}>
                {termsAccepted && (
                  <LinearGradient
                    colors={['#8BB4F2', 'rgba(124, 39, 217, 0.887)', 'rgba(222, 82, 208, 0.76)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.radioInner}
                  />
                )}
              </View>
            </View>
            <Text style={styles.termsText}>
              By continuing, you agree to Mizan Money{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    ...FONTS.body3,
    color: '#595975',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...FONTS.medium(14),
    color: '#6D6E8A',
    marginBottom: 8,
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#6D6E8A',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  countrySelectorContent: {
    flex: 1,
  },
  countryPlaceholder: {
    ...FONTS.body5,
    color: '#6D6E8A',
    fontSize: 12,
    marginBottom: 2,
  },
  countrySelectorText: {
    ...FONTS.semibold(15),
    color: '#1B1C39',
  },
  phoneInput: {
    marginBottom: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 55,
  },
  inputHint: {
    ...FONTS.body5,
    color: '#6D6E8A',
    textAlign: 'center',
  },
  primaryButtonContainer: {
    marginBottom: 16,
  },
  primaryButton: {
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    ...FONTS.semibold(16),
    letterSpacing: 0.5,
  },
  encryptionText: {
    ...FONTS.body5,
    color: '#6D6E8A',
    textAlign: 'left',
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    ...FONTS.semibold(15),
    color: '#6D6E8A',
    marginHorizontal: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    height: 55,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#6D6E8A',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  buttonIcon: {
    width: 28,
    height: 28,
    marginRight: 32,
  },
  secondaryButtonText: {
    ...FONTS.medium(15),
    color: '#6D6E8A',
  },
  termsContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioContainer: {
    marginRight: normalize(15),
  },
  radioOuter: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(40),
    borderWidth: 2,
    borderColor: '#A4A4A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    // Keep the border visible even when selected
    borderColor: '#A4A4A4',
  },
  radioInner: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(40),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8F00E0',
    backgroundColor: '#8F00E0',
    marginRight: 12,
    marginTop: 2,
  },
  termsText: {
    ...FONTS.body5,
    color: '#6D6E8A',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    ...FONTS.body5,
    color: '#6D6E8A',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    marginBottom: 15,
  },
  errorText: {
    ...FONTS.medium(14),
    color: COLORS.error || '#FF3B30',
  },
});

export default AuthOptionsScreen;