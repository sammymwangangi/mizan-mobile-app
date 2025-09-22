import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import { validateEmail } from '../utils';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseConfig';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';

type EmailInputScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailInput'>;

// Generate proper redirect for Expo Go vs standalone builds
const getEmailRedirectTo = () => {
  // @ts-ignore: some versions don't surface `useProxy` in types though it works at runtime
  return makeRedirectUri({
    scheme: 'com.wingi.mizanbankingapp',
    path: 'auth',
    useProxy: (Constants as any)?.appOwnership === 'expo',
  } as any);
};

const EmailInputScreen = () => {
  const navigation = useNavigation<EmailInputScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getEmailRedirectTo() },
      });

      if (error) throw error;

      // Navigate to verification screen to await Magic link
      navigation.navigate('EmailVerification', { email });
    } catch (error: any) {
      console.error('Email verification error:', error);
      Alert.alert('Verification Error', error?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.backTitle}>Back</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.headerTitle}>Type your emails</Text>
          <Input
            placeholder="Type your email here"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Image source={require('../assets/email-icon.png')} style={styles.emailIcon} />}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
            locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Sending...' : 'Confirm Identity'}
            </Text>
          </LinearGradient>
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
  backTitle: {
    ...FONTS.medium(15),
    color: COLORS.text,
    marginLeft: 100,
  },
  headerTitle: {
    ...FONTS.bold(34),
    color: COLORS.text,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginTop: 200,
  },
  emailIcon: {
    width: 24,
    height: 24,
  },
  submitButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    ...FONTS.semibold(20),
    letterSpacing: 1,
  },
});

export default EmailInputScreen;