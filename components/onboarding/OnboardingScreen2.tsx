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
  // Calculate responsive dimensions
  const imageWidth = width * 0.7; // 70% of screen width
  const imageHeight = imageWidth * 1.69; // Maintain aspect ratio (850/503)
  const maxImageHeight = height * 0.55; // Don't exceed 55% of screen height
  
  const finalImageHeight = Math.min(imageHeight, maxImageHeight);
  const finalImageWidth = finalImageHeight / 1.69;

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
              style={[
                styles.phoneImage,
                {
                  width: finalImageWidth,
                  height: finalImageHeight,
                }
              ]}
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
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: height * 0.1, // 10% of screen height for top padding
    paddingBottom: height * 0.15, // 15% for bottom padding (space for progress bar)
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: height * 0.6, // Maximum 60% of screen height
  },
  phoneImage: {
    // Dynamic dimensions will be applied inline
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subtitle: {
    ...FONTS.medium(Math.max(14, width * 0.04), Math.max(20, width * 0.055)), // Responsive font size
    color: COLORS.textWhite,
    textAlign: 'center',
    lineHeight: Math.max(22, width * 0.06), // Responsive line height
  },
  progressContainer: {
    position: 'absolute',
    bottom: height * 0.06, // 6% from bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // More visible on gradient
    borderRadius: 2,
    overflow: 'hidden', 
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF', // White for better contrast
    borderRadius: 2,
  },
});

export default OnboardingScreen2;