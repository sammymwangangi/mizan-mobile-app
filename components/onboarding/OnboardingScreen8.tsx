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

interface OnboardingScreen8Props {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingScreen8: React.FC<OnboardingScreen8Props> = ({ onNext, onBack }) => {
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
            Start free on our {'\n'}Noor Plan.
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Phone Image */}
          <Image
            source={require('../../assets/onboarding-images/plan-card.png')}
            style={styles.planCard}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/onboarding-images/choose-plan-mockup.png')}
            style={styles.choosePlan}
            resizeMode="contain"
          />
          <View style={styles.card3Container}>
            <Image
              source={require('../../assets/onboarding-images/watch.png')}
              style={styles.watchImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* button */}
        <View style={styles.buttonContainer}>
          <View className='flex items-center justify-center gap-1 w-[340px] h-[55px] bg-[#1B1C39] rounded-[40px]'>
            <Text className='text-white text-center font-medium text-[18px] m-auto'>Get Started {'›'}</Text>
            {/* <View style={styles.arrowContainer}>
            </View> */}
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

  planCard: {
    position: 'absolute',
    top: 60, // More responsive positioning
    left: 40, // Position from right edge
    width: 350, // Responsive width
    height: 472, // Responsive height
    rotation: -9.63, // Add slight rotation

  },
  choosePlan: {
    position: 'absolute',
    top: 231, // Slightly higher than card1
    left: -63, // Position from left edge
    width: 347, // Responsive width
    height: 544, // Responsive height
    zIndex: 1,
  },
  card3Container: {
    position: 'absolute',
    top: 325, // Position in middle-lower area
    left: 130,
  },
  watchImage: {
    width: 273, // Responsive width
    height: 402, // Responsive height
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
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.06, // More responsive bottom positioning
    left: 0,
    right: 0,
    alignItems: 'center',
    shadowColor: '#391A7380',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 8,
  },
  arrow: {
    ...FONTS.medium(18),
    color: COLORS.textWhite,
  },
});

export default OnboardingScreen8;
