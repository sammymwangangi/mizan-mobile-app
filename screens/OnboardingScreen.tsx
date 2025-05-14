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
import { SIZES } from '../constants/theme';

import ProgressDots from '../components/ProgressDots';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  image: ImageSourcePropType;
  title?: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    image: require('../assets/onboarding-images/ob1.png'),
    description: 'No yidi yadas,open your account in minutes...jump into a saving habit, interest free product loans. No Tricks, and all shariah compliant',
  },
  {
    id: '2',
    image: require('../assets/onboarding-images/ob2.png'),
    description: 'No Hidden fees, no tricks no boring paper work. Get your guest plus shopping card and get those sneakers!',
  },
  {
    id: '3',
    image: require('../assets/onboarding-images/ob3.png'),
    title: 'Jump into a Saving habit, habibi, its time',
    description: 'Whether that\'s a new phone or a ticket to Space - we can help you form the right saving habits.It\'s not so much about how much really - it\'s about how often.',
  },
  {
    id: '4',
    image: require('../assets/onboarding-images/ob4.png'),
    title: 'Investing is a game Robin-habibi is your coach',
    description: 'Forget complex brokerage paperwork, Take your moolah global with Robin Habibi',
  },
  {
    id: '5',
    image: require('../assets/onboarding-images/ob5.png'),
    title: 'Invest Spare Change',
    description: 'Get the heavy metal debit card that saves and invests for you every time you spend.With round-up, robin habit silently invest that cash into low cost index fund in the background of life.',
  },
  {
    id: '6',
    image: require('../assets/onboarding-images/ob6.png'),
    title: '& many more',
    description: 'Customise your debit card, save for your kids, automate your monthly sadaqa to your favourite charity guided by leading Shariah Review Bureau of Bahrain.',
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

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />

        <ProgressDots
          count={onboardingData.length}
          activeIndex={currentIndex}
          style={styles.progressDots}
        />

        <View style={styles.textContainer}>
          {item.title && <Text style={styles.title}>{item.title}</Text>}
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <View style={styles.container}>
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

        <View style={styles.buttonContainer}>
          {isLastSlide ? (
            <>
              <TouchableOpacity onPress={handleBack} style={styles.skipButton}>
                <Text style={styles.skipText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                <Text style={styles.skipText}>Done</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                <Text style={styles.skipText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: SIZES.padding,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    marginTop: 80,
  },
  progressDots: {
    marginTop: 84,
    marginBottom: 65,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 24,
    textAlign: 'center',
    color: '#6B3BA6',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
    color: '#1B1C39',
    paddingHorizontal: SIZES.padding,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
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
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 18,
    color: '#A276FF',
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

});

export default OnboardingScreen;
