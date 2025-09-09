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

interface OnboardingScreen4Props {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingScreen4: React.FC<OnboardingScreen4Props> = ({ onNext, onBack }) => {
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
            Turn spare change{'\n'}into big change
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View className='h-[54px] w-[138px] flex flex-col items-center text-black justify-center bg-[#FFFFFF63] rounded-3xl absolute top-[174px] left-[166px]'>
            <Text className='font-semibold text-2xl'>+$0.20</Text>
            <Text className='font-medium  text-xs'>Invested</Text>
          </View>

          <View className='h-[54px] w-[138px] flex flex-col items-center text-black justify-center bg-[#FFFFFF63] rounded-3xl absolute top-[405px] left-[14px]'>
            <Text className='font-semibold text-2xl'>+$1.80</Text>
            <Text className='font-medium  text-xs'>Buy Coffee</Text>
          </View>
          {/* Phone Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/onboarding-images/screen4-image.png')}
              style={styles.phoneImage}
              resizeMode="contain"
            />
          </View>

          <Image
            source={require('../../assets/onboarding-images/white-arrow.png')}
            style={styles.whiteArrow}
            resizeMode="contain"
          />

          <Image
            source={require('../../assets/onboarding-images/coffee-cup.png')}
            style={styles.coffeeCup}
            resizeMode="contain"
          />

          <Image
            source={require('../../assets/onboarding-images/screen4-mockup.png')}
            style={styles.phoneMockup}
            resizeMode="contain"
          />

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
            <View style={[styles.progressFill, { width: '60%' }]} />
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
    top: 71,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    ...FONTS.semibold(27, 32),
    color: COLORS.textWhite,
    textAlign: 'center',
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
    top: 254,
    left: 126,
    zIndex: 1,
  },
  phoneImage: {
    width: 211,
    height: 437,
  },

  whiteArrow: {
    position: 'absolute',
    top: 196,
    left: 37,
    width: 120,
    height: 185,
  },

  coffeeCup: {
    position: 'absolute',
    top: 300,
    left: -145,
    width: 677,
    height: 539,
    rotation: 8.97,
  },

  phoneMockup: {
    position: 'absolute',
    top: 148,
    right: -338,
    width: 1002,
    height: 626,
    rotation: 7.23,
  },

  textContainer: {
    position: 'absolute',
    top: 725,
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

export default OnboardingScreen4;
