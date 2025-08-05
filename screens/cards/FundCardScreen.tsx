import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

type FundCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FundCard'>;
type FundCardScreenRouteProp = RouteProp<RootStackParamList, 'FundCard'>;

interface AmountOption {
  value: number;
  label: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any; // Replace with proper icon type
}

const MIN_AMOUNT = 1;

const FundCardScreen: React.FC = () => {
  const navigation = useNavigation<FundCardNavigationProp>();
  const route = useRoute<FundCardScreenRouteProp>();
  const { cardId } = route.params;

  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const amountOptions: AmountOption[] = [
    { value: 1, label: '$1' },
    { value: 5, label: '$5' },
    { value: 10, label: '$10' },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Via Card',
      icon: require('../../assets/payments/card-icon.png')
    },
    {
      id: 'mobile',
      name: 'Via Mobile Money',
      icon: require('../../assets/payments/mobile-money-icon.png')
    },
    {
      id: 'paypal',
      name: 'Via PayPal',
      icon: require('../../assets/payments/card-icon.png')
    }
  ];

  const handleFund = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('WalletAdd', { cardId });
    }, 2000);
  };

  const AmountButton: React.FC<{ option: AmountOption }> = ({ option }) => (
    <TouchableOpacity
      onPress={() => setSelectedAmount(option.value)}
      className={`flex-1 h-12 rounded-xl justify-center items-center mx-2 ${
        selectedAmount === option.value
          ? 'bg-purple-100 border-2 border-purple-500'
          : 'bg-gray-100'
      }`}
    >
      <Text
        className={`font-semibold ${
          selectedAmount === option.value ? 'text-purple-600' : 'text-gray-700'
        }`}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <View className="items-center mb-8">
          <Image
            source={require('../../assets/cards/mizan-card.png')}
            style={{
              width: normalize(300),
              height: normalize(190)
            }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-2xl font-bold mb-2">
          Fund your Virtual card
        </Text>
        <Text className="text-gray-600 mb-6">
          We won&apos;t charge you, its free
        </Text>

        {/* Amount Selection */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-4">Select amount</Text>
          <View className="flex-row justify-between mb-4">
            {amountOptions.map((option) => (
              <AmountButton key={option.value} option={option} />
            ))}
          </View>
        </View>

        {/* Payment Method Selection */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-4">Select payment</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              className={`flex-row items-center p-4 rounded-xl mb-3 ${
                selectedPayment === method.id
                  ? 'bg-purple-50 border-2 border-purple-500'
                  : 'border border-gray-200'
              }`}
            >
              <Image
                source={method.icon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text className="ml-3 flex-1">{method.name}</Text>
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  selectedPayment === method.id
                    ? 'border-purple-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPayment === method.id && (
                  <View className="w-3 h-3 rounded-full bg-purple-500" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fund Button */}
        <TouchableOpacity
          onPress={handleFund}
          disabled={isProcessing}
          className="w-full"
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className={`h-14 rounded-full justify-center items-center ${
              isProcessing ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {isProcessing ? 'Processing...' : `Fund & Activate`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FundCardScreen;
