import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// Import the new onboarding screen components
import {
  OnboardingScreen1,
  OnboardingScreen2,
  OnboardingScreen3,
  OnboardingScreen4,
  OnboardingScreen5,
  OnboardingScreen6,
  OnboardingScreen7,
  OnboardingScreen8,
} from '../components/onboarding';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

// Define the onboarding screens data
const onboardingScreens = [
  { id: '1', component: OnboardingScreen1 },
  { id: '2', component: OnboardingScreen2 },
  { id: '3', component: OnboardingScreen3 },
  { id: '4', component: OnboardingScreen4 },
  { id: '5', component: OnboardingScreen5 },
  { id: '6', component: OnboardingScreen6 },
  { id: '7', component: OnboardingScreen7 },
  { id: '8', component: OnboardingScreen8 },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingScreens.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Welcome');
    }
  };

  const renderItem = ({ item }: { item: typeof onboardingScreens[0] }) => {
    const ScreenComponent = item.component;
    return (
      <View style={styles.slide}>
        <ScreenComponent
          onNext={handleNext}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingScreens}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
  },
});

export default OnboardingScreen;
