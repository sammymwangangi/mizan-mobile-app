import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Button from '../components/Button';
import ProgressDots from '../components/ProgressDots';
import GradientBackground from '../components/GradientBackground';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    image: require('../assets/onboarding-images/ob1.png'),
    title: 'No yidi yadas',
    description: 'Open your account in minutes...jump into a saving habit',
  },
  {
    id: '2',
    image: require('../assets/onboarding-images/ob2.png'),
    title: 'Interest Free Products',
    description: 'All our products are interest-free and Shariah compliant',
  },
  {
    id: '3',
    image: require('../assets/onboarding-images/ob3.png'),
    title: 'Secure Banking',
    description: 'Your money and data are protected with the highest security standards',
  },
  {
    id: '4',
    image: require('../assets/onboarding-images/ob4.png'),
    title: 'Smart Budgeting',
    description: 'Track your spending and save more with our smart budgeting tools',
  },
  {
    id: '5',
    image: require('../assets/onboarding-images/ob5.png'),
    title: 'Easy Transfers',
    description: 'Send money to friends and family with just a few taps',
  },
  {
    id: '6',
    image: require('../assets/onboarding-images/ob6.png'),
    title: 'Ready to Start?',
    description: 'Create your account now and experience ethical banking',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    navigation.replace('Auth');
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <GradientBackground
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <ProgressDots count={onboardingData.length} activeIndex={currentIndex} />
        
        <View style={styles.buttonContainer}>
          {!isLastSlide && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={isLastSlide ? "Get Started" : "Next"}
            onPress={handleNext}
            gradient={true}
            style={styles.nextButton}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    padding: SIZES.padding,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 50,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textWhite,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: SIZES.padding,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SIZES.padding,
    marginTop: 20,
  },
  skipButton: {
    justifyContent: 'center',
  },
  skipText: {
    ...FONTS.body3,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  nextButton: {
    width: 120,
  },
});

export default OnboardingScreen;
