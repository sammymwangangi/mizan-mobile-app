import React, { useEffect } from 'react';
import { Image, StyleSheet, Animated, ImageBackground, StatusBar, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';


type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

const IntroScreen = () => {
  const navigation = useNavigation<IntroScreenNavigationProp>();
  const logoOpacity = React.useMemo(() => new Animated.Value(0), []);
  const { width: screenWidth } = useWindowDimensions();
  const logoWidth = Math.min(220, Math.max(140, screenWidth * 0.45));
  const logoHeight = (logoWidth * 76) / 150;

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
    <ImageBackground
      source={require('../assets/splash2-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </Animated.View>
    </ImageBackground>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 76,
  },
});

export default IntroScreen;
