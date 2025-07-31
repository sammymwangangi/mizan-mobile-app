import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ onNext, onBack }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onNext} activeOpacity={1}>
      <LinearGradient
        colors={[
          '#CB7AF0',
          '#9087FA'
        ]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Phone Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/onboarding-images/screen2-image.png')}
            style={styles.phoneImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Save • Spend • Invest{'\n'}All-in-one, 100% Shariah compliant.
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  gradient: {
    flex: 1,
    width,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    padding: 0,
  },
  phoneImage: {
    width: 503,
    height: 850,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  subtitle: {
    ...FONTS.medium(16, 24),
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#EEEFF5',
    borderRadius: 2,
    overflow: 'hidden', 
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#7A4BFF',
    borderRadius: 2,
  },
});

export default OnboardingScreen2;
