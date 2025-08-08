import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { addToAppleWallet, addToGoogleWallet, ANALYTICS_EVENTS } from '../../constants/shams';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

type WalletAddNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WalletAdd'>;
type WalletAddScreenRouteProp = RouteProp<RootStackParamList, 'WalletAdd'>;

const WalletAddScreen: React.FC = () => {
  const navigation = useNavigation<WalletAddNavigationProp>();
  const route = useRoute<WalletAddScreenRouteProp>();
  const { cardId } = route.params;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletType, setWalletType] = useState<'apple' | 'google'>('apple');

  const handleAddToWallet = async (type: 'apple' | 'google') => {
    setWalletType(type);
    Haptics.selectionAsync();

    try {
      if (type === 'apple') {
        await addToAppleWallet(cardId);
      } else {
        await addToGoogleWallet(cardId);
      }

      // Track analytics
      // PostHog.capture(ANALYTICS_EVENTS.WALLET_ADD_SUCCESS, { wallet: type });

      setShowSuccessModal(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        handleBackToHome();
      }, 2000);
    } catch (error) {
      console.error(`Failed to add to ${type} wallet:`, error);
    }
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' as never }]
    });
  };

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white rounded-3xl p-8 mx-8 items-center">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Text className="text-green-500 text-2xl">✓</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            {walletType === 'apple' ? 'Added to Apple' : 'Added to Google'}
          </Text>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Wallet
          </Text>
          <Text className="text-gray-600 text-center">
            Your card is ready to use
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-[#1A1B23]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white/60 text-sm">Home</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-white text-2xl font-bold text-center mb-2">
          Your Card is Ready
        </Text>
        <Text className="text-white/70 text-center mb-8">
          Funded: $10.00{'\n'}
          Here&apos;s your shiny new Habibi card. Start spending ethically and live free right away
        </Text>

        <Image
          source={require('../../assets/cards/mizan-card.png')}
          style={{
            width: normalize(300),
            height: normalize(190)
          }}
          resizeMode="contain"
        />

        <View className="w-full mt-8 space-y-4">
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              onPress={() => handleAddToWallet('apple')}
              className="w-full h-14 bg-black rounded-full flex-row items-center justify-center space-x-2"
            >
              <Image
                source={require('../../assets/logos/apple-wallet.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text className="text-white font-semibold">
                Add to Apple Wallet
              </Text>
            </TouchableOpacity>
          )}

          {Platform.OS === 'android' && (
            <TouchableOpacity
              onPress={() => handleAddToWallet('google')}
              className="w-full h-14 bg-white border-2 border-gray-200 rounded-full flex-row items-center justify-center space-x-2"
            >
              <Image
                source={require('../../assets/logos/google-wallet.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text className="text-gray-900 font-semibold">
                Add to Google Wallet
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleBackToHome}
            className="w-full"
          >
            <Text className="text-center text-[#D4AF37] font-semibold">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <SuccessModal />
    </View>
  );
};

export default WalletAddScreen;
