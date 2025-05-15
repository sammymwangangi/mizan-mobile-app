import React, { useState } from 'react';
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
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
// @ts-ignore - Ignore the missing type declaration file
import MaskedView from '@react-native-masked-view/masked-view';

type PhoneNumberScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneNumber'>;

const PhoneNumberScreen = () => {
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('254');

  const handleSubmit = () => {
    // In a real app, you would validate the phone number here
    // Then navigate to OTP screen
    navigation.navigate('OTP', { phoneNumber: `+${countryCode} ${phoneNumber}` });
  };

  const handleSignIn = () => {
    navigation.navigate('Auth');
  };

  const gradientText = (
      <View style={{ padding: 20 }}>
        <MaskedView
          style={{ height: 90, width: 300 }}
          maskElement={
            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{...FONTS.body1, textAlign: 'center' }}>
              Powerhouse - Shariah Finance, Begins Now
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={['#80B2FF', '#7C27D9', '#FF68F0']}
            locations={[0, 0.7155, 1]}
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
            <TouchableOpacity style={styles.countryCodeContainer}>
              <View style={styles.flagContainer}>
                <Image
                  source={require('../assets/kyc/kenya-flag.png')}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <ChevronDown size={16} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Phone Number Input */}
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder="Insert your number here"
                placeholderTextColor={COLORS.placeholder}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButtonContainer}>
            <LinearGradient
              colors={['#5592EF', '#8532E0', '#F053E0']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>SIGN-UP</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity onPress={handleSignIn} style={styles.signInContainer}>
            <Text style={styles.signInText}>I have another account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  patternImage: {
    width: '100%',
    height: 300,
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
    marginBottom: 40,

  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  flagContainer: {
    marginRight: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
  },
  countryCodeText: {
    ...FONTS.body3,
    color: COLORS.text,
    marginRight: 5,
  },
  phoneInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  phoneInput: {
    ...FONTS.body3,
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
  submitButtonContainer: {
    marginBottom: 20,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  signInText: {
    ...FONTS.body4,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default PhoneNumberScreen;
