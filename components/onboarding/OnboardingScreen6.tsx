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

interface OnboardingScreen6Props {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingScreen6: React.FC<OnboardingScreen6Props> = ({ onNext, onBack }) => {
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
            0% Pay Later?{'\n'}Good habits first.
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Phone Image */}
          <Image
            source={require('../../assets/onboarding-images/card1.png')}
            style={styles.card1Image}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/onboarding-images/card2.png')}
            style={styles.card2Image}
            resizeMode="contain"
          />
          <View style={styles.card3Container}>
            <Image
              source={require('../../assets/onboarding-images/card-pay.png')}
              style={styles.cardPayImage}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>
              Our A.I. unlocks 0 % Buy now Pay-Later only when your habits are healthy. We grow you—not tempt you.
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
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
    top: height * 0.08, // More responsive top positioning
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    zIndex: 10,
  },
  headerTitle: {
    ...FONTS.semibold(27, 32),
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 32,
  },
  contentContainer: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding
  },

  card1Image: {
    position: 'absolute',
    top: height * 0, // More responsive positioning
    right: width * 0, // Position from right edge
    width: width * 0.52, // Responsive width
    height: height * 0.72, // Responsive height
    rotation: 40.1, // Add slight rotation
    zIndex: 1,
  },
  card2Image: {
    position: 'absolute',
    top: height * 0.12, // Slightly higher than card1
    left: width * 0.065, // Position from left edge
    width: width * 0.60, // Responsive width
    height: height * 0.43, // Responsive height
    rotation: 36.42, // Add slight rotation
  },
  card3Container: {
    position: 'absolute',
    top: height * 0.32, // Position in middle-lower area
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPayImage: {
    width: width * 3, // Responsive width
    height: height * 0.5, // Responsive height
  },
  textContainer: {
    position: 'absolute',
    bottom: height * 0.1, // More responsive bottom positioning
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: width * 0.1, // Add horizontal padding
  },
  subtitle: {
    ...FONTS.medium(16, 24),
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8, // Limit text width for better readability
  },
  progressContainer: {
    position: 'absolute',
    bottom: height * 0.06, // More responsive bottom positioning
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: width * 0.1, // Responsive horizontal padding
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

export default OnboardingScreen6;
