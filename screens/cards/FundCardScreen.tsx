import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { FUND_AMOUNTS, PAYMENT_METHODS, CTA_GRADIENT, ANALYTICS_EVENTS } from '../../constants/shams';

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

const FundCardScreen: React.FC = () => {
  const navigation = useNavigation<FundCardNavigationProp>();
  const route = useRoute<FundCardScreenRouteProp>();
  const { cardId } = route.params;

  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const amountOptions: AmountOption[] = FUND_AMOUNTS;
  const paymentMethods: PaymentMethod[] = PAYMENT_METHODS;

  const handleFund = async () => {
    setIsProcessing(true);
    Haptics.selectionAsync();

    // Track analytics
    // PostHog.capture(ANALYTICS_EVENTS.FUND_SUCCESS, { amount: selectedAmount, method: selectedPayment });

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('WalletAdd', { cardId });
    }, 2000);
  };

  const AmountButton: React.FC<{ option: AmountOption }> = ({ option }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedAmount(option.value);
        Haptics.selectionAsync();
      }}
      className={`flex-1 h-12 rounded-xl justify-center items-center mx-2 ${
        selectedAmount === option.value
          ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
          : 'bg-[#F6F5F8]'
      }`}
    >
      <Text
        className={`font-semibold ${
          selectedAmount === option.value ? 'text-[#D4AF37]' : 'text-gray-700'
        }`}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-[#1A1B23]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white/60 text-sm">Fund to Activate</Text>
        <View className="w-10" />
      </View>

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

        <Text className="text-white text-2xl font-bold mb-2">
          Fund to Activate
        </Text>
        <Text className="text-white/70 mb-6">
          Choose your starting amount
        </Text>

        {/* Amount Selection */}
        <View className="mb-8">
          <View className="flex-row justify-between mb-4">
            {amountOptions.map((option) => (
              <AmountButton key={option.value} option={option} />
            ))}
          </View>

          {/* Custom Amount Input */}
          <TouchableOpacity className="bg-[#F6F5F8] rounded-xl p-4 mt-3">
            <Text className="text-gray-700 text-center">Enter Amount ($)</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method Selection */}
        <View className="mb-8">
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => {
                setSelectedPayment(method.id);
                Haptics.selectionAsync();
              }}
              className={`flex-row items-center p-4 rounded-xl mb-3 ${
                selectedPayment === method.id
                  ? 'bg-[#D4AF37]/10 border-2 border-[#D4AF37]'
                  : 'bg-white/5 border border-white/20'
              }`}
            >
              <Image
                source={method.icon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text className={`ml-3 flex-1 ${
                selectedPayment === method.id ? 'text-[#D4AF37]' : 'text-white'
              }`}>
                {method.name}
              </Text>
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  selectedPayment === method.id
                    ? 'border-[#D4AF37]'
                    : 'border-white/30'
                }`}
              >
                {selectedPayment === method.id && (
                  <View className="w-3 h-3 rounded-full bg-[#D4AF37]" />
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
            colors={CTA_GRADIENT.colors}
            start={CTA_GRADIENT.start}
            end={CTA_GRADIENT.end}
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
