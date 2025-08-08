import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { CTA_GRADIENT, ANALYTICS_EVENTS } from '../../constants/shams';
import MintingProgressSheet from '../../components/cards/shams/MintingProgressSheet';
import ConfettiSuccess from '../../components/cards/shams/ConfettiSuccess';

type CardMintingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardMinting'>;
type CardMintingRouteProp = RouteProp<RootStackParamList, 'CardMinting'>;

const CardMintingScreen: React.FC = () => {
  const navigation = useNavigation<CardMintingNavigationProp>();
  const route = useRoute<CardMintingRouteProp>();
  const { selectedMetal, deliveryAddress, settings } = route.params || {};

  const [mintingProgress, setMintingProgress] = useState(0);
  const [showMintingSheet, setShowMintingSheet] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [showErrorSheet, setShowErrorSheet] = useState(false);

  useEffect(() => {
    // Start minting process
    const interval = setInterval(() => {
      setMintingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Increment by 2% every 160ms (8 seconds total)
      });
    }, 160);

    return () => clearInterval(interval);
  }, []);

  const handleMintingComplete = () => {
    setShowMintingSheet(false);
    setShowSuccess(true);

    // Track analytics
    // PostHog.capture(ANALYTICS_EVENTS.CARD_ORDER_SUCCESS, { metal: selectedMetal });
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    navigation.navigate('FundCard', { cardId: 'shams-' + Date.now() });
  };

  const handleCancel = () => {
    setShowCancelSheet(true);
  };

  const handleKeepMinting = () => {
    setShowCancelSheet(false);
  };

  const handleSaveAndExit = () => {
    setShowCancelSheet(false);
    navigation.goBack();
  };

  const CancelSheet = () => (
    <Modal
      visible={showCancelSheet}
      transparent
      animationType="slide"
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

          <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
            Need a moment?
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            You can finish your order later. No fees charged yet.
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleKeepMinting}
              className="w-full"
            >
              <LinearGradient
                colors={CTA_GRADIENT.colors}
                start={CTA_GRADIENT.start}
                end={CTA_GRADIENT.end}
                className="h-14 rounded-full justify-center items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  Keep Minting
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveAndExit}
              className="w-full h-14 bg-gray-100 rounded-full justify-center items-center"
            >
              <Text className="text-gray-700 font-semibold text-lg">
                Save & Exit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const ErrorSheet = () => (
    <Modal
      visible={showErrorSheet}
      transparent
      animationType="slide"
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Text className="text-red-500 text-2xl">📶</Text>
            </View>

            <Text className="text-xl font-bold text-gray-800 mb-2">
              Connection lost
            </Text>
            <Text className="text-gray-600 text-center">
              Ouch! Seems lost. No fees charged.
            </Text>
          </View>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => setShowErrorSheet(false)}
              className="w-full"
            >
              <LinearGradient
                colors={CTA_GRADIENT.colors}
                start={CTA_GRADIENT.start}
                end={CTA_GRADIENT.end}
                className="h-14 rounded-full justify-center items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  Retry Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowErrorSheet(false);
                navigation.goBack();
              }}
              className="w-full h-14 bg-gray-100 rounded-full justify-center items-center"
            >
              <Text className="text-gray-700 font-semibold text-lg">
                Exit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-[#1A1B23]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={handleCancel}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white/60 text-sm">Review & Order</Text>
        <TouchableOpacity onPress={() => setShowErrorSheet(true)}>
          <Text className="text-white/60 text-sm">⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Card Preview */}
      <View className="flex-1 items-center justify-center px-5">
        <Image
          source={require('../../assets/cards/mizan-card.png')}
          style={{
            width: 280,
            height: 175,
          }}
          resizeMode="contain"
        />
      </View>

      {/* Bottom CTA */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={() => navigation.navigate('FundCard', { cardId: 'temp' })}
          className="w-full"
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={CTA_GRADIENT.colors}
            start={CTA_GRADIENT.start}
            end={CTA_GRADIENT.end}
            className="h-14 rounded-full justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Enter the Gold Club
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Minting Progress Sheet */}
      <Modal
        visible={showMintingSheet}
        transparent
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <MintingProgressSheet
            progress={mintingProgress}
            onComplete={handleMintingComplete}
          />
        </View>
      </Modal>

      {/* Success Confetti */}
      {showSuccess && (
        <ConfettiSuccess onComplete={handleSuccessComplete} />
      )}

      {/* Cancel Sheet */}
      <CancelSheet />

      {/* Error Sheet */}
      <ErrorSheet />
    </View>
  );
};

export default CardMintingScreen;
