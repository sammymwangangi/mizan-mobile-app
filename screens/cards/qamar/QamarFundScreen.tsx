import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { 
  FUND_PRESETS, 
  PAYMENT_METHODS, 
  BARAKAH_PURPLE, 
  QAMAR_ANALYTICS,
  REFERRAL_CHANNELS,
  REFERRAL_MESSAGE,
  MIN_TOPUP
} from '../../../constants/qamar';
import { 
  FundLoaderSheet, 
  FundSuccessSheet, 
  ReferralSheet 
} from '../../../components/cards/qamar/QamarBottomSheets';

type QamarFundNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FundCard'>;
type QamarFundRouteProp = RouteProp<RootStackParamList, 'FundCard'>;

const QamarFundScreen: React.FC = () => {
  const navigation = useNavigation<QamarFundNavigationProp>();
  const route = useRoute<QamarFundRouteProp>();
  const { cardId } = route.params;

  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [showFundLoader, setShowFundLoader] = useState(false);
  const [showFundSuccess, setShowFundSuccess] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const isReady = (customAmount ? parseFloat(customAmount) >= MIN_TOPUP : selectedAmount >= MIN_TOPUP) && selectedPayment;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    Haptics.selectionAsync();
  };

  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text);
    if (text) {
      setSelectedAmount(0);
    }
  };

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
    Haptics.selectionAsync();
  };

  const handleFundAndActivate = async () => {
    if (!isReady) return;

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    Haptics.selectionAsync();
    setShowFundLoader(true);

    // Track analytics
    // PostHog.capture(QAMAR_ANALYTICS.ACTIVATION_FUND_SUCCESS, { 
    //   amount, 
    //   method: selectedPayment 
    // });

    // Simulate funding process
    setTimeout(() => {
      setShowFundLoader(false);
      setShowFundSuccess(true);
    }, 2000);
  };

  const handleFundSuccess = () => {
    setShowFundSuccess(false);
    setShowReferral(true);
  };

  const handleReferralShare = async (channel: string) => {
    const channelData = REFERRAL_CHANNELS.find(c => c.id === channel);
    if (!channelData) return;

    // Track analytics
    // PostHog.capture(QAMAR_ANALYTICS.SHARE_REFERRAL_CLICKED, { channel });

    try {
      const shareUrl = channelData.shareUrl + encodeURIComponent(REFERRAL_MESSAGE);
      await Linking.openURL(shareUrl);
    } catch (error) {
      console.error('Failed to open sharing app:', error);
    }

    Haptics.selectionAsync();
  };

  const handleReferralSkip = () => {
    setShowReferral(false);
    navigation.navigate('WalletAdd', { cardId });
  };

  const AmountButton: React.FC<{ amount: number }> = ({ amount }) => (
    <TouchableOpacity
      onPress={() => handleAmountSelect(amount)}
      className={`flex-1 h-12 rounded-xl justify-center items-center mx-1 ${
        selectedAmount === amount && !customAmount
          ? 'bg-purple-100 border-2 border-purple-600'
          : 'bg-gray-100'
      }`}
    >
      <Text
        className={`font-semibold ${
          selectedAmount === amount && !customAmount ? 'text-purple-600' : 'text-gray-700'
        }`}
      >
        ${amount}
      </Text>
    </TouchableOpacity>
  );

  const PaymentMethod: React.FC<{ method: typeof PAYMENT_METHODS[0] }> = ({ method }) => (
    <TouchableOpacity
      onPress={() => handlePaymentSelect(method.id)}
      className={`flex-row items-center p-4 rounded-xl mb-3 ${
        selectedPayment === method.id
          ? 'bg-purple-50 border-2 border-purple-600'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <Image
        source={method.icon}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />
      <Text className={`ml-3 flex-1 font-medium ${
        selectedPayment === method.id ? 'text-purple-600' : 'text-gray-700'
      }`}>
        {method.name}
      </Text>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          selectedPayment === method.id
            ? 'border-purple-600'
            : 'border-gray-300'
        }`}
      >
        {selectedPayment === method.id && (
          <View className="w-3 h-3 rounded-full bg-purple-600" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Text className="text-gray-600 text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">Fund & Activate</Text>
        <View className="w-10" />
      </View>

      <View className="px-5">
        {/* Card Preview */}
        <View className="items-center mb-8">
          <Image
            source={require('../../../assets/cards/mizan-card.png')}
            style={{
              width: 300,
              height: 190
            }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Fund & Activate
        </Text>
        <Text className="text-gray-600 mb-8">
          Add money to start using your Qamar card
        </Text>

        {/* Amount Selection */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-4 font-medium">Choose amount</Text>
          
          {/* Preset Amounts */}
          <View className="flex-row justify-between mb-4">
            {FUND_PRESETS.map((preset) => (
              <AmountButton key={preset.value} amount={preset.value} />
            ))}
          </View>
          
          {/* Custom Amount */}
          <TextInput
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            placeholder="Enter custom amount"
            placeholderTextColor="#9CA3AF"
            className={`bg-gray-50 rounded-xl p-4 text-gray-900 ${
              customAmount ? 'border-2 border-purple-600' : ''
            }`}
            keyboardType="numeric"
          />
        </View>

        {/* Payment Method Selection */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-4 font-medium">Payment method</Text>
          {PAYMENT_METHODS.map((method) => (
            <PaymentMethod key={method.id} method={method} />
          ))}
        </View>

        {/* Fund Button */}
        <TouchableOpacity
          onPress={handleFundAndActivate}
          disabled={!isReady}
          activeOpacity={0.9}
          className="w-full mb-8"
        >
          <LinearGradient
            colors={isReady ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#D1D5DB', '#D1D5DB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`h-14 rounded-full justify-center items-center ${
              !isReady ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Fund & Activate
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheets */}
      <FundLoaderSheet
        visible={showFundLoader}
        onClose={() => setShowFundLoader(false)}
      />

      <FundSuccessSheet
        visible={showFundSuccess}
        onClose={() => setShowFundSuccess(false)}
        onComplete={handleFundSuccess}
      />

      <ReferralSheet
        visible={showReferral}
        onClose={() => setShowReferral(false)}
        onShare={handleReferralShare}
        onSkip={handleReferralSkip}
      />
    </ScrollView>
  );
};

export default QamarFundScreen;
