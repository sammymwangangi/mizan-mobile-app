import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { QAMAR_ANALYTICS } from '../../../constants/qamar';
import {
  TnCSheet,
  MintingSheet,
  CancelSheet,
  ErrorSheet,
  SuccessSheet
} from '../../../components/cards/shams/ShamsBottomSheets';

type ShamsMintingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsMinting'>;
type ShamsMintingRouteProp = RouteProp<RootStackParamList, 'ShamsMinting'>;

const ShamsMintingScreen: React.FC = () => {
  const navigation = useNavigation<ShamsMintingNavigationProp>();
  const route = useRoute<ShamsMintingRouteProp>();
  const { planId, selectedColor, deliveryAddress, features } = route.params;

  const [showTnC, setShowTnC] = useState(true);
  const [showMinting, setShowMinting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showMinting && mintingProgress < 100) {
      interval = setInterval(() => {
        setMintingProgress(prev => {
          const newProgress = prev + 2; // 2% every 100ms = 5 seconds total
          
          // Haptic feedback every 20%
          if (newProgress % 20 === 0 && newProgress <= 100) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowMinting(false);
              setShowSuccess(true);
            }, 500);
            return 100;
          }
          
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showMinting, mintingProgress]);

  const handleTnCAgree = () => {
    setShowTnC(false);
    setShowMinting(true);
    setMintingProgress(0);
    Haptics.selectionAsync();
  };

  const handleTnCDecline = () => {
    setShowTnC(false);
    navigation.goBack();
  };

  const handleMintingCancel = () => {
    setShowCancel(true);
  };

  const handleKeepMinting = () => {
    setShowCancel(false);
  };

  const handleCancelOrder = () => {
    setShowCancel(false);
    setShowMinting(false);
    // machine.send('CANCELLED')
    navigation.goBack();
  };

  const handleRetryError = () => {
    setShowError(false);
    setShowMinting(true);
    setMintingProgress(0);
  };

  const handleExitError = () => {
    setShowError(false);
    navigation.goBack();
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    
    // Track analytics
    // PostHog.capture(QAMAR_ANALYTICS.CARD_ORDER_SUCCESS, { 
    //   elapsedMs: Date.now() - startTime,
    //   colour: selectedColor 
    // });
    
    // Navigate to funding with cardId
    navigation.navigate('FundCard', { 
      cardId: `qamar-${Date.now()}` 
    });
  };

  // Simulate network error (for demo)
  const simulateError = () => {
    if (mintingProgress > 50 && Math.random() < 0.1) {
      setShowMinting(false);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (showMinting) {
      const errorTimer = setTimeout(simulateError, 3000);
      return () => clearTimeout(errorTimer);
    }
  }, [showMinting, mintingProgress]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Text className="text-gray-600 text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">Processing Order</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
          Creating your Qamar card
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please review and accept our terms to continue
        </Text>

        {/* Card Preview */}
        <Image
          source={require('../../../assets/cards/mizan-card.png')}
          style={{
            width: 280,
            height: 175,
          }}
          resizeMode="contain"
        />

        <View className="mt-8 items-center">
          <Text className="text-gray-600 text-sm">
            {selectedColor} • Qamar Card
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            Delivering to: {deliveryAddress.address}
          </Text>
        </View>
      </View>

      {/* Bottom Info */}
      <View className="px-5 pb-8">
        <View className="bg-purple-50 rounded-2xl p-4">
          <Text className="text-purple-900 font-semibold text-center">
            Processing your order...
          </Text>
          <Text className="text-purple-700 text-sm text-center mt-1">
            This may take a few moments
          </Text>
        </View>
      </View>

      {/* Bottom Sheets */}
      <TnCSheet
        visible={showTnC}
        onClose={() => setShowTnC(false)}
        onAgree={handleTnCAgree}
        onDecline={handleTnCDecline}
      />

      <MintingSheet
        visible={showMinting}
        onClose={() => setShowMinting(false)}
        progress={mintingProgress}
        onCancel={handleMintingCancel}
      />

      <CancelSheet
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        onKeep={handleKeepMinting}
        onCancel={handleCancelOrder}
      />

      <ErrorSheet
        visible={showError}
        onClose={() => setShowError(false)}
        onRetry={handleRetryError}
        onExit={handleExitError}
      />

      <SuccessSheet
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onComplete={handleSuccessComplete}
      />
    </View>
  );
};

export default ShamsMintingScreen;
