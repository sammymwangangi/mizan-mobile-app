import { useEffect } from 'react';
import { Image, StyleSheet, StatusBar, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/types';

type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

const IntroScreen = () => {
  const navigation = useNavigation<IntroScreenNavigationProp>();
  const { width: screenWidth } = useWindowDimensions();
  const logoWidth = Math.min(220, Math.max(140, screenWidth * 0.45));
  const logoHeight = (logoWidth * 76) / 150;

  useEffect(() => {
    // Navigate to onboarding screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#A08CFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D155FF', // Match the top gradient color
  },
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