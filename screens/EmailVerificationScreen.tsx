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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';

type EmailVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;
type EmailVerificationScreenRouteProp = RouteProp<RootStackParamList, 'EmailVerification'>;

const EmailVerificationScreen = () => {
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const route = useRoute<EmailVerificationScreenRouteProp>();
  const { email } = route.params;
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

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

  const handleOpenEmailApp = () => {
    // In a real app, you would use Linking to open the email app
    Alert.alert('Open Email App', 'This would open the default email app');
  };

  const handleResendLink = () => {
    setLoading(true);
    setTimer(60);
    
    // Simulate sending a new verification link
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Link Sent', 'A new verification link has been sent to your email');
    }, 1500);
  };

  const handleVerificationSuccess = () => {
    // This would be called when the user returns from verifying their email
    navigation.navigate('SuccessScreen', { authMethod: 'email' });
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
        <Text style={styles.headerTitle}>Check your e-mail</Text>
      </View>

      <View style={styles.content}>
        <Image
          source={require('../assets/email-verification.png')}
          style={styles.emailImage}
          resizeMode="contain"
        />
        
        <Text style={styles.description}>
          We&apos;ve sent a magic link to <Text style={styles.emailText}>{email}</Text>. Open your inbox to log in. Can&apos;t spot it? Check in Spam or Promotions.
        </Text>

        <TouchableOpacity
          style={styles.openEmailButton}
          onPress={handleOpenEmailApp}
        >
          <LinearGradient
            colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
            locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>OPEN EMAIL APP</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, timer > 0 && styles.resendButtonDisabled]}
          onPress={handleResendLink}
          disabled={timer > 0 || loading}
        >
          <Text style={styles.resendButtonText}>
            {timer > 0 ? `RE-SEND IN ${timer}s` : 'RE-SEND LINK'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.expiryText}>
          Link expires in 10 min for your safety.
        </Text>

        {/* For demo purposes - this button simulates successful verification */}
        <TouchableOpacity
          style={styles.demoButton}
          onPress={handleVerificationSuccess}
        >
          <Text style={styles.demoButtonText}>
            (Demo: Simulate Successful Verification)
          </Text>
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
    alignItems: 'center',
  },
  emailImage: {
    width: 120,
    height: 120,
    marginVertical: 30,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  emailText: {
    ...FONTS.semibold(16),
    color: COLORS.primary,
  },
  openEmailButton: {
    width: '100%',
    marginBottom: 15,
  },
  buttonGradient: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    ...FONTS.semibold(16),
    letterSpacing: 1,
  },
  resendButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendButtonText: {
    ...FONTS.semibold(16),
    color: COLORS.textLight,
  },
  expiryText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 30,
  },
  demoButton: {
    padding: 10,
    marginTop: 20,
  },
  demoButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default EmailVerificationScreen;