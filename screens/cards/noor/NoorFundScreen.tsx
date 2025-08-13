import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { NOOR_FUND_PRESETS, BARAKAH_BLUE } from '../../../constants/noor';
import { FONTS } from 'constants/theme';

type NoorFundNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoorFund'>;
type NoorFundRouteProp = RouteProp<RootStackParamList, 'NoorFund'>;

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card' },
  { id: 'mpesa', label: 'M-PESA' },
  { id: 'paypal', label: 'PayPal' },
];

const NoorFundScreen: React.FC = () => {
  const navigation = useNavigation<NoorFundNavigationProp>();
  const route = useRoute<NoorFundRouteProp>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedColor } = route.params;

  const [amount, setAmount] = useState('5');
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handleAmountSelect = (value: number) => {
    Haptics.selectionAsync();
    setAmount(value.toString());
  };

  const handleMethodSelect = (methodId: string) => {
    Haptics.selectionAsync();
    setSelectedMethod(methodId);
  };

  const handleNext = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    Haptics.selectionAsync();
    // PostHog.capture(NOOR_ANALYTICS.ACTIVATION_FUND_SUCCESS, {
    //   amount: parseFloat(amount),
    //   method: selectedMethod,
    // });

    // Show success sheet then navigate
    // @ts-ignore - TODO: Add WalletAdd to navigation types
    navigation.navigate('wallet/add');
  };

  return (
    <View className="flex-1 bg-[#F1F3F5]">
      {/* Header */}
      <View className="px-5 pt-12 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ ...FONTS.semibold(14), color: BARAKAH_BLUE }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ ...FONTS.bold(26), color: '#0F172A', marginTop: 12 }}>Fund & Activate</Text>
        <Text style={{ ...FONTS.medium(12), color: '#64748B', marginTop: 4 }}>
          Add funds to activate your Noor card.
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Amount Section */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text style={{ ...FONTS.semibold(16), color: '#0F172A', marginBottom: 16 }}>
            Choose Amount
          </Text>

          {/* Preset amounts */}
          <View className="flex-row mb-6">
            {NOOR_FUND_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => handleAmountSelect(preset)}
                className={`h-[45px] flex-1 items-center justify-center rounded-full mr-4 last:mr-0 ${
                  amount === preset.toString()
                    ? 'bg-[#0033FF]'
                    : 'bg-[#F8FAFC]'
                }`}
              >
                <Text
                  style={{
                    ...FONTS.semibold(14),
                    color: amount === preset.toString() ? 'white' : '#64748B',
                  }}
                >
                  ${preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom amount */}
          <View>
            <Text style={{ ...FONTS.medium(12), color: '#64748B', marginBottom: 4 }}>
              Or enter amount
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              placeholderTextColor="#94A3B8"
              className="bg-[#F8FAFC] h-[55px] px-4 rounded-xl"
              style={{ ...FONTS.medium(16), color: '#0F172A' }}
            />
          </View>
        </View>

        {/* Payment Method Section */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text style={{ ...FONTS.semibold(16), color: '#0F172A', marginBottom: 16 }}>
            Payment Method
          </Text>

          {PAYMENT_METHODS.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handleMethodSelect(method.id)}
              className={`flex-row items-center justify-between p-4 ${
                index < PAYMENT_METHODS.length - 1 ? 'border-b border-[#E2E8F0]' : ''
              }`}
            >
              <Text style={{ ...FONTS.medium(14), color: '#0F172A' }}>{method.label}</Text>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? 'border-[#0033FF] bg-[#0033FF]'
                    : 'border-[#E2E8F0]'
                } items-center justify-center`}
              >
                {selectedMethod === method.id && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View className="px-5 py-6 bg-white">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNext}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <LinearGradient
            colors={
              amount && parseFloat(amount) > 0
                ? [BARAKAH_BLUE, '#3366FF']
                : ['#E5E7EB', '#E5E7EB']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`h-[55px] items-center justify-center ${
              !amount || parseFloat(amount) <= 0 ? 'opacity-60' : ''
            }`}
            style={{ borderRadius: 40 }}
          >
            <Text style={{ ...FONTS.semibold(16), color: 'white' }}>
              Fund & Activate
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoorFundScreen;
