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

interface OnboardingScreen5Props {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingScreen5: React.FC<OnboardingScreen5Props> = ({ onNext, onBack }) => {
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

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Meet Robin-Habibi{'\n'}your Best Financial Friend{'\n'} {'(BFF)'}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Phone Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/onboarding-images/portfolio-mockup.png')}
              style={styles.phoneImage}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>
              Just live your life, while we automatically grow{'\n'}your spare change into halal investments.
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
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
  headerContainer: {
    position: 'absolute',
    top: 60,
    right: 0,
    left: 0,
    zIndex: 10,
  },
  headerTitle: {
    ...FONTS.bold(28, 32),
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 40,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    position: 'relative',
  },
  imageContainer: {
    position: 'absolute',
    top: 129,
    left: -270,
    rotation: 7.45,
  },
  phoneImage: {
    width: 940,
    height: 640,
  },

  textContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  subtitle: {
    ...FONTS.medium(16, 24),
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
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

export default OnboardingScreen5;
