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
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
// import Button from '../components/Button'; // Not used
import Input from '../components/Input';
import { User } from 'lucide-react-native';
import { validateEmail, validatePassword } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        let userCredential: UserCredential;
        if (isLogin) {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in!');
        } else {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('User account created & signed in!');
        }

        const user = userCredential.user;
        if (user) {
          const idToken = await user.getIdToken();
          await SecureStore.setItemAsync('userToken', idToken);
          await SecureStore.setItemAsync('userUID', user.uid);
          console.log('User token and UID stored securely.');
        }

        navigation.navigate('Home', { screen: 'Home' });

      } catch (error: any) {
        Alert.alert('Authentication Error', error.message);
        console.error(error);
      }
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password
  };

  const toggleAuthMode = () => {
    if (isLogin) {
      // If currently in login mode, navigate to phone number screen for sign up
      navigation.navigate('PhoneNumber');
    } else {
      // If in sign up mode, switch to login
      setIsLogin(true);
      // Clear form when switching modes
      setEmailError('');
      setPasswordError('');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Biometric hardware not available on this device.');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometrics enrolled on this device. Please set up Face ID or Fingerprint.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to sign in',
        fallbackLabel: 'Enter Password', // Fallback for iOS
      });

      if (result.success) {
        console.log('Biometric authentication successful.');
        // Simplified approach: Assume token is still valid or will be handled by onAuthStateChanged
        const userToken = await SecureStore.getItemAsync('userToken');
        const userUID = await SecureStore.getItemAsync('userUID');

        if (userToken && userUID) {
          console.log('Stored token and UID found, navigating to Home.');
          // Navigate to Home. App.tsx's onAuthStateChanged will handle session validity.
          navigation.navigate('Home', { screen: 'Home' });
        } else {
          Alert.alert(
            'Login Required',
            'Biometric authentication successful, but no stored credentials found. Please log in with your email and password first to enable biometric sign-in for future sessions.'
          );
        }
      } else {
        console.log('Biometric authentication failed or cancelled:', result.error);
        // Don't show an alert if user cancelled, as result.error might be 'user_cancel'
        if (result.error && result.error !== 'user_cancel' && result.error !== 'system_cancel' && result.error !== 'app_cancel') {
          Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again or use your password.');
        }
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Authentication Error', 'An unexpected error occurred during biometric authentication.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Pattern in top-right corner */}
      <Image
        source={require('../assets/pattern1.png')}
        style={styles.patternImage}
        resizeMode="contain"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('../assets/colored-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          {!isLogin && (
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              leftIcon={<User size={20} color={COLORS.textLight} />}
              autoCapitalize="none"
            />
          )}

          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            placeholder="Type your password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
          />

          {isLogin && (
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>I forgot my password</Text>
            </TouchableOpacity>
          )}

          <View style={styles.submitButtonContainer}>
            <ImageBackground
              source={require('../assets/button-bg.png')}
              style={styles.buttonBackground}
              resizeMode="contain"
            >
              <TouchableOpacity
                style={styles.submitButtonTouchable}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
                  locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>
                    {isLogin ? "SIGN IN" : "SIGN UP"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.orContainer}>
            <Text style={styles.orText}>or sign in with biometrics</Text>
          </View>

          <View style={styles.biometricsContainer}>
            <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
              <Image
                source={require('../assets/FaceID.png')}
                style={styles.biometricIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
              <Image
                source={require('../assets/fingerprint.png')}
                style={styles.biometricIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={toggleAuthMode}>
            <Text style={styles.footerLink}>{isLogin ? "Sign up" : "Sign in"}</Text>
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
    position: 'absolute',
    top: 0,
    right: 0,
    width: 308,
    height: 308,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  header: {
    alignItems: 'center',
    marginTop: 160,
    marginBottom: 40,
  },
  logo: {
    width: 145,
    height: 75,
    marginBottom: 10,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  formContainer: {
    marginBottom: 30,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    ...FONTS.semibold(14),
    color: '#705EE7',
    textDecorationLine:'underline',
  },
  submitButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
    marginRight: -24, // Negative margin to make the button background touch the edge of the screen
  },
  buttonBackground: {
    width: 220,
    height: 80,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align to the left to position the button correctly
    paddingLeft: 20, // Add padding to position the button within the background
  },
  submitButtonTouchable: {
    width: '84%', // Adjusted width to better fit in the visible part of the background
    height: '64.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    ...FONTS.semibold(15),
    letterSpacing: 1,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  orText: {
    ...FONTS.body4,
    color: '#9797A6',
  },
  biometricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 20,
  },
  biometricButton: {
    padding: 10,
  },
  biometricIcon: {
    width: 74,
    height: 74,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    ...FONTS.medium(14),
    color: COLORS.text,
  },
  footerLink: {
    ...FONTS.semibold(14),
    color: '#A276FF',
    textDecorationLine:'underline',
  },
});

export default AuthScreen;
