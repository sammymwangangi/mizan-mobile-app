import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { CTA_GRADIENT, SHAMS_TOKENS } from '../../../constants/shams';
import { FONTS } from 'constants/theme';
import { FundSuccessSheet, ShamsReferralSheet } from '../../../components/cards/shams/ShamsBottomSheets';

type ShamsFundNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsFund'>;
type ShamsFundRouteProp = RouteProp<RootStackParamList, 'ShamsFund'>;

const MIN_TOPUP = 10; // USD

const ShamsFundScreen: React.FC = () => {
  const navigation = useNavigation<ShamsFundNavigationProp>();
  const route = useRoute<ShamsFundRouteProp>();
  const { selectedMetal, selectedColor, cardId } = route.params;

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  // Bottom sheet states
  const [showFundSuccess, setShowFundSuccess] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const isReady = (customAmount ? parseFloat(customAmount) >= MIN_TOPUP : selectedAmount >= MIN_TOPUP) && selectedPayment;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    Haptics.selectionAsync();
  };

  const handleCustomAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    setCustomAmount(numericText);
    if (numericText) {
      setSelectedAmount(0);
    }
  };

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
    Haptics.selectionAsync();
  };

  const handleFundAndActivate = async () => {
    if (!isReady) return;

    Haptics.selectionAsync();

    // Show success sheet immediately
    setShowFundSuccess(true);
  };

  const handleReferralShare = (channel: string) => {
    console.log('Sharing via:', channel);
    // TODO: Implement actual sharing logic
    Haptics.selectionAsync();
  };

  const handleReferralSkip = () => {
    setShowReferral(false);
    navigation.navigate('ShamsWalletAdd', { selectedMetal, selectedColor, cardId });
  };

  // Amount Button Component with gradient border for active state
  const AmountButton: React.FC<{ amount: number }> = ({ amount }) => {
    const isActive = selectedAmount === amount && !customAmount;

    if (isActive) {
      // Active button with rose gold gradient border
      return (
        <TouchableOpacity
          onPress={() => handleAmountSelect(amount)}
          activeOpacity={0.9}
          style={{ flex: 1, marginHorizontal: 4 }}
        >
          <LinearGradient
            colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 2,
            }}
          >
            <View
              style={{
                backgroundColor: SHAMS_TOKENS.background,
                borderRadius: 18,
                height: 64,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...FONTS.semibold(20), color: '#DDA79B' }}>
                ${amount}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    // Inactive button
    return (
      <TouchableOpacity
        onPress={() => handleAmountSelect(amount)}
        activeOpacity={0.9}
        style={{
          flex: 1,
          marginHorizontal: 4,
          backgroundColor: '#2A2B4A',
          borderRadius: 20,
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#3A3B5A',
        }}
      >
        <Text style={{ ...FONTS.semibold(20), color: '#6D6E8A' }}>
          ${amount}
        </Text>
      </TouchableOpacity>
    );
  };

  // Payment Method Component
  const PaymentMethod: React.FC<{ id: string; name: string; iconPath: any }> = ({ id, name, iconPath }) => {
    const isActive = selectedPayment === id;

    return (
      <TouchableOpacity
        onPress={() => handlePaymentSelect(id)}
        activeOpacity={0.9}
        style={{ marginBottom: 12 }}
      >
        <View
          style={{
            backgroundColor: isActive ? '#5A5B7A' : '#2A2B4A',
            borderRadius: 20,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isActive ? '#6D6E8A' : '#3A3B5A',
          }}
        >
          {/* Radio Circle */}
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: isActive ? '#DDA79B' : '#6D6E8A',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {isActive && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#DDA79B',
                }}
              />
            )}
          </View>

          {/* Payment Method Name */}
          <Text style={{ ...FONTS.medium(16), color: isActive ? '#FFFFFF' : '#9CA3AF', flex: 1 }}>
            {name}
          </Text>

          {/* Icon */}
          <Image
            source={iconPath}
            style={{ width: 32, height: 32, tintColor: isActive ? '#DDA79B' : '#6D6E8A' }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: SHAMS_TOKENS.background }}>
      {/* Background Decorative Circles */}
      <Image source={SHAMS_TOKENS.pattern} style={styles.pattern} resizeMode="contain" />

      {/* Back Button */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, marginBottom: 16, zIndex: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', width: 80 }}
          accessibilityLabel="Go back"
        >
          <Text style={{ ...FONTS.medium(16), color: '#FFFFFF' }}>{'<'} Back</Text>
        </TouchableOpacity>
      </View>

      {/* Glassmorphic "Fund to Activate" Card */}
      {/* Glassmorphic "Fund to Activate" Card */}
      <View style={{ marginHorizontal: 20, marginBottom: 42, zIndex: 10 }}>
        <LinearGradient
          colors={['rgba(221, 167, 155, 0.4)', 'rgba(246, 207, 202, 0.4)', 'rgba(211, 155, 142, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            padding: 1.5,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Glass effect container */}
          <View
            style={{
              borderRadius: 22.5,
              backgroundColor: 'rgba(50, 55, 80, 0.4)', // Semi-transparent navy that matches your background
              overflow: 'hidden',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* Left Side - Card Thumbnail */}
            <Image
              source={require('../../../assets/cards/shams/fund-card-thumbnail.png')}
              style={{
                width: 96,
                height: 118,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />

            {/* Right Side - Text Content */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              {/* Title with Gradient */}
              <MaskedView
                maskElement={
                  <View>
                    <Text style={{ ...FONTS.semibold(32), lineHeight: 36 }}>Fund to</Text>
                    <Text style={{ ...FONTS.semibold(32), lineHeight: 36 }}>Activate</Text>
                  </View>
                }
              >
                <LinearGradient
                  colors={['#E8B5A8', '#FFFFFF', '#E8B5A8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ height: 72 }}
                >
                  <Text style={{ ...FONTS.semibold(32), lineHeight: 36, opacity: 0 }}>Fund to</Text>
                  <Text style={{ ...FONTS.semibold(32), lineHeight: 36, opacity: 0 }}>Activate</Text>
                </LinearGradient>
              </MaskedView>

              {/* Subtitle */}
              <Text
                style={{
                  ...FONTS.medium(10),
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginTop: 4,
                  lineHeight: 14,
                }}
              >
                Claim your first month FREE when you top up now.
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Amount Selection */}
        <View style={{ marginBottom: 24 }}>

          {/* Preset Amounts - First Row */}
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <AmountButton amount={10} />
            <AmountButton amount={20} />
          </View>

          {/* Second Row */}
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <AmountButton amount={50} />

            {/* Custom Amount Input */}
            <View style={{ flex: 1, marginHorizontal: 4 }}>
              <TextInput
                value={customAmount}
                onChangeText={handleCustomAmountChange}
                placeholder="Enter Amount ($)"
                placeholderTextColor="#6D6E8A"
                style={{
                  backgroundColor: customAmount ? '#2A2B4A' : '#2A2B4A',
                  borderRadius: 20,
                  height: 64,
                  paddingHorizontal: 16,
                  ...FONTS.medium(14),
                  color: customAmount ? '#DDA79B' : '#9CA3AF',
                  textAlign: 'center',
                  borderWidth: customAmount ? 2 : 1,
                  borderColor: customAmount ? '#DDA79B' : '#3A3B5A',
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ ...FONTS.medium(14), color: '#9CA3AF', marginBottom: 12 }}>
            Select payment method
          </Text>

          <PaymentMethod
            id="card"
            name="Via Card"
            iconPath={require('../../../assets/cards/shams/gradient-radio-card.png')}
          />

          <PaymentMethod
            id="mobile"
            name="Via Mobile Money"
            iconPath={require('../../../assets/cards/shams/gradient-radio-mobile.png')}
          />

          <PaymentMethod
            id="paypal"
            name="Via Paypal"
            iconPath={require('../../../assets/cards/shams/gradient-radio-card.png')}
          />
        </View>

        {/* Fund & Activate Button */}
        <TouchableOpacity
          onPress={handleFundAndActivate}
          disabled={!isReady}
          activeOpacity={0.9}
          style={{ marginTop: 8 }}
        >
          <LinearGradient
            colors={['#D39C90', '#FFFFFF', '#D39B8E']}
            start={CTA_GRADIENT.start as any}
            end={CTA_GRADIENT.end as any}
            style={{
              height: 56,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isReady ? 1 : 0.5,
            }}
          >
            <Text style={{ ...FONTS.bold(16), color: isReady ? '#1B1C39' : '#6D6E8A' }}>
              Fund & Activate
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Fund Success */}
      <FundSuccessSheet
        visible={showFundSuccess}
        onClose={() => {
          setShowFundSuccess(false);
          setShowReferral(true);
        }}
        onComplete={() => {
          setShowFundSuccess(false);
          setShowReferral(true);
        }}
      />

      {/* Referral */}
      <ShamsReferralSheet
        visible={showReferral}
        onClose={handleReferralSkip}
        onShare={handleReferralShare}
        onSkip={handleReferralSkip}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  pattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: 238,
    opacity: 0.8,
  },
});

export default ShamsFundScreen;

