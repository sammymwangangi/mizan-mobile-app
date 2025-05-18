import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Import Camera component
// Note: You may need to install expo-camera with: npx expo install expo-camera
// For now, we'll create a mock camera view
// import { Camera as ExpoCamera, CameraType } from 'expo-camera';

type CardLinkingBackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardLinkingBack'>;

const CardLinkingBackScreen = () => {
  const navigation = useNavigation<CardLinkingBackScreenNavigationProp>();

  const handleCapture = () => {
    // Navigate to verification screen
    navigation.navigate('CardVerification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Link Card</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Back of card</Text>
        <Text style={styles.instructionsText}>
          Position all 4 corners of the BACK clearly in the frame and remove any cover
        </Text>
      </View>

      {/* Mock Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.camera}>
          <Image
            source={require('../assets/cards/back-of-card-icon.png')}
            style={styles.cardOverlay}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Capture Button */}
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity onPress={handleCapture}>
          <LinearGradient
            colors={['#CE72E3', '#8A2BE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.captureButton}
          >
            <Camera size={32} color={COLORS.textWhite} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  instructionsContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  instructionsTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 8,
  },
  instructionsText: {
    ...FONTS.body4,
    color: COLORS.textLight,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    margin: SIZES.padding,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Dark background to simulate camera
  },
  cardOverlay: {
    width: '80%',
    height: '80%',
    opacity: 0.5,
  },
  captureButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default CardLinkingBackScreen;
