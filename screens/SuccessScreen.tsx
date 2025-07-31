import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ThumbsUp } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

type SuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SuccessScreen'>;
type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'SuccessScreen'>;

const SuccessScreen = () => {
  const navigation = useNavigation<SuccessScreenNavigationProp>();
  const route = useRoute<SuccessScreenRouteProp>();
  const { authMethod } = route.params;
  const confettiRef = useRef<any>(null);

  // Trigger confetti animation when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    }, 500); // Small delay for better effect

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigation.navigate('KYC');
  };

  return (
    <View style={styles.container}>
      {/* Animated Confetti Effect */}
      <ConfettiCannon
        ref={confettiRef}
        count={120}
        origin={{ x: -10, y: 0 }}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={3000}
        autoStart={false}
      />

      {/* Additional confetti from the right side for more dramatic effect */}
      <ConfettiCannon
        count={80}
        origin={{ x: 400, y: 0 }}
        fadeOut={true}
        explosionSpeed={300}
        fallSpeed={2500}
        autoStart={true}
      />

      <View style={styles.content}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>You&apos;re in! <ThumbsUp size={24} color="#000000" /></Text>
          
          <Text style={styles.subtitle}>
            Perfect, now let&apos;s unlock your ethical financial journey.
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
            locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    ...FONTS.bold(34),
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    ...FONTS.body3,
    color: '#3E3E55',
    textAlign: 'left',
    marginBottom: 40,
  },
  continueButton: {
    width: '100%',
    marginTop: 'auto',
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
});

export default SuccessScreen;