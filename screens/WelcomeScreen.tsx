import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleExploreMizan = () => {
    navigation.navigate('AuthOptions', {});
  };

  const handleHaveAccount = () => {
    navigation.navigate('Auth');
  };

  const gradientText = (
    <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
      <MaskedView
        style={{ height: 90, width: 390 }}
        maskElement={
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 30, textAlign: 'center' }}>
              Shariah compliant {'\n'} Finance, made simple.
            </Text>
          </View>
        }
      >
        <LinearGradient
          colors={['#80B2FF', '#7C27D9', '#FF68F0']}
          locations={[0, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Decorative Pattern Background */}
      <Image
        source={require('../assets/kyc/PhoneNumberPattern.png')}
        style={styles.patternImage}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>

        <View style={styles.mainContent}>
          {/* Gradient Title */}
          {gradientText}
          
          <Text style={styles.subtitle}>No Hidden fees, tricks or catches.{'\n'} 100% Transparent.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleExploreMizan}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Explore Mizan</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleHaveAccount}
          >
            <Text style={styles.secondaryButtonText}>I have an account</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom indicator */}
        <View style={styles.bottomIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  patternImage: {
    width: '100%',
    height: 330,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  welcomeText: {
    ...FONTS.body3,
    color: '#666666',
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },
  title: {
    ...FONTS.bold(32),
    color: '#1B1C39',
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    ...FONTS.body3,
    color: '#595975',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  primaryButton: {
    marginBottom: 16,
  },
  buttonGradient: {
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6943AF',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.26,
    shadowRadius: 40,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    ...FONTS.semibold(16),
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 55,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(206, 114, 227, 0.1)',
  },
  secondaryButtonText: {
    color: '#8F00E0',
    ...FONTS.semibold(16),
    letterSpacing: 0.5,
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default WelcomeScreen;
