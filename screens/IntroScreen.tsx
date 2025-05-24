import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, ImageBackground, StatusBar } from 'react-native';
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

  return (
    <LinearGradient
      colors={[
        '#D155FF',
        '#B532F2',
        '#A016E8',
        '#9406E2',
        '#8F00E0',
        '#A08CFF'
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <Image
        source={require('../assets/mastercard-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>
    // <ImageBackground
    //   source={require('../assets/splash2-bg.png')}
    //   style={styles.container}
    //   resizeMode="cover"
    // >
    //   <View style={styles.content}>
    //     <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
    //       <Image
    //         source={require('../assets/logo.png')}
    //         style={styles.logo}
    //         resizeMode="contain"
    //       />
    //     </Animated.View>
    //   </View>
    // </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
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
    width: 180,
    height: 91,
    alignSelf: 'center',
  },
});

export default IntroScreen;
