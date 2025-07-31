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

interface OnboardingScreen1Props {
  onNext?: () => void;
  onSkip?: () => void;
}

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ onNext, onSkip }) => {
  return (
    <LinearGradient
      colors={[
        '#CB7AF0',
        '#9087FA'
      ]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Phone Image */}
          <Image
            source={require('../../assets/onboarding-images/screen1-image.png')}
            style={styles.phoneImage}
            resizeMode="contain"
          />

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Salaam, meet Mizan - your{'\n'}financial AI companion.
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <TouchableOpacity style={styles.bottomContainer} onPress={onNext}>
        <Text style={styles.startText}>Start</Text>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  logoContainer: {
    position: 'absolute',
    top: 400,
    left: 100,
    zIndex: 10,
  },
  logo: {
    width: 160,
    height: 82,
    tintColor: '#FFFFFF',
  },
  contentContainer: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },

  phoneImage: {
    position: 'absolute',
    top: -10,
    right: -170,  // Adjust this value to move the image to the right
    width: 500,
    height: 840,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 400,
    marginBottom: 0,
  },
  title: {
    ...FONTS.semibold(24, 20),
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: 32,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 160,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startText: {
    ...FONTS.medium(16),
    color: COLORS.textWhite,
    marginRight: 1,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    ...FONTS.medium(20),
    color: COLORS.textWhite,
  },
});

export default OnboardingScreen1;
