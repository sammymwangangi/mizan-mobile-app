import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseConfig';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';


const getEmailRedirectTo = () => {
  // Use Expo proxy in Expo Go, otherwise use app scheme
  // @ts-ignore - some versions don't surface `useProxy` in types though it works at runtime
  return makeRedirectUri({
    scheme: 'com.wingi.mizanbankingapp',
    path: 'auth',
    // Expo Go: Constants.appOwnership === 'expo'
    useProxy: (Constants as any)?.appOwnership === 'expo',
  } as any);
};

type EmailVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;
type EmailVerificationScreenRouteProp = RouteProp<RootStackParamList, 'EmailVerification'>;

const EmailVerificationScreen = () => {
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const route = useRoute<EmailVerificationScreenRouteProp>();
  const { email } = route.params;
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('SuccessScreen', { authMethod: 'email' });
    }
  }, [isAuthenticated, navigation]);

  const formatMMSS = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleOpenEmailApp = async () => {
    try {
      const supported = await Linking.canOpenURL('mailto:');
      if (supported) {
        await Linking.openURL('mailto:');
      } else {
        Alert.alert('Open Email App', 'Please open your email app to find the Magic link.');
      }
    } catch {
      Alert.alert('Open Email App', 'Unable to open email app on this device.');
    }
  };

  const handleResendLink = async () => {
    try {
      setLoading(true);
      setTimer(60);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getEmailRedirectTo() },
      });
      if (error) throw error;

      Alert.alert('Link Sent', 'A new Magic link has been sent to your email.');
    } catch (e: any) {
      Alert.alert('Resend Failed', e?.message || 'Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={styles.container}
    >
      <View style={styles.content}>
        <View>
          <Image
            source={require('../assets/email-verification.png')}
            style={styles.emailImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>Check your e-mail</Text>
          <Text style={styles.description}>
            We’ve sent a Magic link! Open your inbox to hop in. Can’t spot it? Peek in Spam or Promotions
          </Text>
        </View>

        <View style={{marginBottom: 60}}>
          <TouchableOpacity
            style={styles.openEmailButton}
            onPress={handleOpenEmailApp}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Open Email App</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resendButton, (timer > 0 || loading) && styles.resendButtonDisabled]}
            onPress={handleResendLink}
            disabled={timer > 0 || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.resendButtonText}>
              {timer > 0 ? `Re-send in ${formatMMSS(timer)}` : 'Re-send link'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.expiryText}>Link expires in 10 min for your safety.</Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    paddingTop: 120,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  emailImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  title: {
    ...FONTS.bold(34),
    color: COLORS.text,
    textAlign: 'left',
    marginBottom: 10,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'left',
    marginBottom: 36,
  },
  openEmailButton: {
    width: '100%',
    marginBottom: 14,
  },
  primaryButton: {
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    ...FONTS.semibold(16),
    letterSpacing: 0.5,
  },
  resendButton: {
    width: '100%',
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE8FF',
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 4,
    marginBottom: 16,
  },
  resendButtonDisabled: {
    opacity: 0.7,
  },
  resendButtonText: {
    ...FONTS.semibold(16),
    color: '#B9B2E3',
  },
  expiryText: {
    ...FONTS.h6,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;