import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

type WalletAddNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WalletAdd'>;
type WalletAddScreenRouteProp = RouteProp<RootStackParamList, 'WalletAdd'>;

const WalletAddScreen: React.FC = () => {
  const navigation = useNavigation<WalletAddNavigationProp>();
  const route = useRoute<WalletAddScreenRouteProp>();
  const { cardId } = route.params;

  const handleAddToWallet = async (walletType: 'apple' | 'google') => {
    // In a real app, this would integrate with the respective wallet API
    console.log(`Adding card ${cardId} to ${walletType} wallet`);
    
    // Simulate success
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }]
      });
    }, 1000);
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' as never }]
    });
  };

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-center mb-2">
          Your Card Is Ready
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Funded: $1.00
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
            <Text className="text-center text-purple-600 font-semibold">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WalletAddScreen;
