import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { LinearGradient } from 'expo-linear-gradient';

type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

const IntroScreen = () => {
  const navigation = useNavigation<IntroScreenNavigationProp>();
  const logoOpacity = React.useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Animate logo appearance
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate to onboarding screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, logoOpacity]);

  // Calculate the angle of 11.18 degrees for the gradient
  // This approximates the angle by adjusting start and end points
  return (
    <LinearGradient
      colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#A08CFF']}
      locations={[0.0063, 0.1475, 0.2856, 0.4075, 0.5002, 0.9941]}
      style={styles.container}
      start={{ x: 0.45, y: 0.0 }}
      end={{ x: 0.55, y: 1.0 }}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 50,
    alignSelf: 'center',
  },
});

export default IntroScreen;
