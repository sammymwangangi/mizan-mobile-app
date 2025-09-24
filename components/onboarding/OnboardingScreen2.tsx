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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ onNext, onBack }) => {
  const insets = useSafeAreaInsets();
  const isSmallPhone = width < 375; // iPhone SE and similar

  // Calculate responsive dimensions (503x850)
  const aspect = 850 / 503; // H/W
  const baseImageHeight = height * (isSmallPhone ? 0.9 : 1.05); // Larger to match the design
  const finalImageHeight = baseImageHeight;
  const finalImageWidth = finalImageHeight / aspect;

  // Image transform to match the diagonal composition
  const rotateDeg = isSmallPhone ? '-20deg' : '0deg';
  const translateX = width * (isSmallPhone ? -0.18 : -0.25);
  const translateY = height * (isSmallPhone ? -0.02 : -0.04);

  // Safe top/bottom paddings to avoid notch/home indicator (keep tight like design)
  const topPadding = insets.top + (isSmallPhone ? 8 : 12);
  const bottomPadding = insets.bottom + (isSmallPhone ? 20 : 28);
  const progressBottom = insets.bottom + (isSmallPhone ? 10 : 16);
  const imageTop = insets.top + (isSmallPhone ? 0 : 4);

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
        <View style={[styles.contentContainer, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
          {/* Phone Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/onboarding-images/screen2-image.png')}
              style={[
                styles.phoneImage,
                {
                  width: finalImageWidth,
                  height: finalImageHeight,
                  transform: [
                    { translateY },
                    { translateX },
                    { rotate: rotateDeg },
                  ],
                  marginTop: imageTop,
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
        <View style={[styles.progressContainer, { bottom: progressBottom }]}>
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
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 130,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    ...FONTS.medium(Math.max(15, width * 0.042), Math.max(22, width * 0.062)),
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  progressBar: {
    width: '70%',
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