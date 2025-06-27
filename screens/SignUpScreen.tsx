import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
// @ts-ignore - TypeScript module resolution issue
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const validateForm = () => {
    let isValid = true;

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordError(passwordError);
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate password confirmation
    const confirmPasswordError = validatePasswordConfirmation(password, confirmPassword);
    if (confirmPasswordError) {
      setConfirmPasswordError(confirmPasswordError);
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    // Username is optional for now
    // Could add validation here if needed

    return isValid;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        console.log('🔄 Starting signup process for:', email);
        
        const result = await signUp(email, password);
        
        if (result.error) {
          Alert.alert('Sign Up Error', result.error.message);
          return;
        }

        if (result.user) {
          console.log('✅ User account created successfully');
          console.log('🔄 Navigating to PhoneNumber screen with user data');

          // Small delay to ensure auth state is updated
          setTimeout(() => {
            navigation.navigate('PhoneNumber', {
              email,
              password,
              tempUserId: result.user!.id,
            });
          }, 100);
        }

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        Alert.alert('Sign Up Error', errorMessage);
        console.error('Signup error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Auth');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Mizan Money and start your financial journey</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Username (Optional)"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            leftIcon={<User size={20} color={COLORS.textLight} />}
            autoCapitalize="none"
          />

          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.signUpButtonGradient}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={styles.footerLink}>Sign in</Text>
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
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    ...FONTS.bold(28),
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    ...FONTS.medium(16),
    color: COLORS.textLight,
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  signUpButton: {
    height: 55,
    borderRadius: 40,
    marginTop: 20,
    shadowColor: '#6943AF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    ...FONTS.semibold(16),
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    ...FONTS.medium(14),
    color: COLORS.textLight,
  },
  footerLink: {
    fontSize: 14,
    ...FONTS.semibold(14),
    color: COLORS.primary,
  },
});

export default SignUpScreen;
