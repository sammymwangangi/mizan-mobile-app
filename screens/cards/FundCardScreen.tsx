import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { PAYMENT_METHODS } from '../../constants/shams';
import QamarCardPreview from '../../components/cards/qamar/QamarCardPreview';
import { QAMAR_COLORS, REFERRAL_CHANNELS, REFERRAL_MESSAGE } from '../../constants/qamar';
import { FONTS } from 'constants/theme';
import { Check } from 'lucide-react-native';
import { FundSuccessSheet, ReferralSheet } from '../../components/cards/qamar/QamarBottomSheets';

type FundCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FundCard'>;
type FundCardScreenRouteProp = RouteProp<RootStackParamList, 'FundCard'>;



interface PaymentMethod {
  id: string;
  name: string;
  icon: any; // Replace with proper icon type
}

const FundCardScreen: React.FC = () => {
  const navigation = useNavigation<FundCardNavigationProp>();
  const route = useRoute<FundCardScreenRouteProp>();
  const { cardId, selectedColor } = route.params;

  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFundSuccess, setShowFundSuccess] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const paymentMethods: PaymentMethod[] = PAYMENT_METHODS;

  const handleFund = async () => {
    setIsProcessing(true);
    Haptics.selectionAsync();

    // Simulate funding API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowFundSuccess(true);
    }, 1000);
  };

  const handleFundSuccessComplete = () => {
    setShowFundSuccess(false);
    setShowReferral(true);
  };

  const handleReferralShare = async (channel: string) => {
    const channelData = REFERRAL_CHANNELS.find(c => c.id === channel);
    if (!channelData) return;
    try {
      const shareUrl = channelData.shareUrl + encodeURIComponent(REFERRAL_MESSAGE);
      await Linking.openURL(shareUrl);
    } catch (e) {
      console.warn('Failed to share referral:', e);
    }
    Haptics.selectionAsync();
  };

  const handleReferralSkip = () => {
    setShowReferral(false);
    navigation.navigate('WalletAdd', { cardId });
  };
  const PurpleGradientStroke: React.FC<{ selected?: boolean; radius?: number; children: React.ReactNode }>
    = ({ selected, radius = 20, children }) => {
      if (!selected) return <>{children}</> as any;
      return (
        <View style={{ borderRadius: radius }}>
          <View style={{ position: 'absolute', top: -1, left: -1, right: -1, bottom: -1, borderRadius: radius, overflow: 'hidden' }}>
            <LinearGradient
              colors={['#D155FF', '#A016E8', '#8F00E0', '#A08CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          </View>
          <View style={{ borderRadius: radius, overflow: 'hidden' }}>{children}</View>
        </View>
      );
    };


  const AmountTile: React.FC<{ value?: number; label: string; isInput?: boolean }>
    = ({ value, label, isInput }) => {
      const isSelected = typeof value === 'number' && selectedAmount === value;
      const baseStyle = {
        width: 160, height: 88, borderRadius: 18,
        marginBottom: 12, alignItems: 'center' as const, justifyContent: 'center' as const,
        backgroundColor: '#FFFFFF', borderWidth: isSelected ? 0 : 1,
        borderColor: '#E6E2F5',
        shadowColor: isSelected ? '#6943AF' : 'transparent',
        shadowOpacity: isSelected ? 0.15 : 0,
        shadowOffset: { width: 0, height: 10 }, shadowRadius: isSelected ? 18 : 0,
        elevation: isSelected ? 4 : 0
      };

      if (isInput) {
        const valid = /^\d+(\.\d{0,2})?$/.test(customAmount) && customAmount.length > 0;
        return (
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <PurpleGradientStroke selected={valid}>
              <View style={[baseStyle, { alignItems: 'flex-start', paddingHorizontal: 16 }]}>
                <TextInput
                  value={customAmount}
                  onChangeText={(t) => {
                    setCustomAmount(t);
                    if (/^\d*(\.\d{0,2})?$/.test(t)) {
                      const n = parseFloat(t);
                      if (!isNaN(n)) setSelectedAmount(n);
                    }
                  }}
                  onFocus={() => setSelectedAmount(NaN as any)}
                  onBlur={() => {
                    if (!/^\d+(\.\d{0,2})?$/.test(customAmount)) {
                      setCustomAmount('');
                      setSelectedAmount(NaN as any);
                    }
                  }}
                  placeholder={label}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={{ ...FONTS.semibold(16), color: '#111827', width: '100%' }}
                />
              </View>
            </PurpleGradientStroke>
          </TouchableOpacity>
        );
      }

      return (
        <TouchableOpacity
          onPress={() => { if (typeof value === 'number') setSelectedAmount(value); Haptics.selectionAsync(); }}
          activeOpacity={0.9}
        >
          <PurpleGradientStroke selected={isSelected}>
            <View style={baseStyle}>
              <Text style={{ ...FONTS.bold(20), color: isSelected ? '#0F172A' : '#6B7280' }}>{label}</Text>
            </View>
          </PurpleGradientStroke>
        </TouchableOpacity>
      );
    };
  const PaymentMethodItem: React.FC<{ method: PaymentMethod; selected: boolean; onPress: () => void }> = ({ method, selected, onPress }) => {
    const containerStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E6E2F5',
      marginBottom: 12,
      shadowColor: selected ? '#6943AF' : 'transparent',
      shadowOpacity: selected ? 0.12 : 0,
      shadowOffset: { width: 0, height: 14 },
      shadowRadius: selected ? 22 : 0,
      elevation: selected ? 6 : 0,
    };

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={containerStyle}>
          {/* Left radio */}
          {selected ? (
            <LinearGradient
              colors={['#D155FF', '#A016E8', '#8F00E0', '#A08CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
            </LinearGradient>
          ) : (
            <View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: '#D9D3F2', backgroundColor: '#FFFFFF' }} />
          )}

          {/* Label */}
          <Text style={{ ...FONTS.bold(16), color: '#0F172A', marginLeft: 12, flex: 1 }}>
            {method.name}
          </Text>

          {/* Right icon with gradient stroke container */}
          <PurpleGradientStroke selected={true} radius={12}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={method.icon} style={{ width: 22, height: 22 }} resizeMode="contain" />
            </View>
          </PurpleGradientStroke>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <ScrollView className="flex-1 bg-[#FFFFFF]">
      {/* Header and Hero card */}
      <View className="px-5 pt-12 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#3B82F6', fontWeight: '500' }}>Back</Text>
        </TouchableOpacity>

        {/* Hero card with partial card preview bottom-left */}
        <PurpleGradientStroke selected={false}>
          <View
            style={{
              marginTop: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 16,
              paddingHorizontal: 16,
              shadowColor: '#6943AF',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 20 },
              shadowRadius: 20,
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {/* Partial card preview container positioned bottom-left */}
              <View style={{ width: 96, height: 106, borderRadius: 16, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
                  <QamarCardPreview
                    color={(selectedColor ? QAMAR_COLORS.find(c => c.id === selectedColor) : null) || QAMAR_COLORS[0]}
                    width={128}
                    height={160}
                    playSheen={false}
                    expiryText=""
                  />
                </View>
              </View>

              {/* Title and subtitle */}
              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>Fund to{String.fromCharCode(10)}Activate.</Text>
                <Text style={{ marginTop: 8, color: '#6B7280', fontSize: 11 }}>Get your first month FREE when{String.fromCharCode(10)}you top-up now.</Text>
              </View>
            </View>
          </View>
        </PurpleGradientStroke>
      </View>

      <View className="px-5">
        {/* Select amount */}
        <Text style={{ color: '#0F172A', fontWeight: '600', marginBottom: 10 }}>Select amount</Text>

        <Text className="text-white text-2xl font-bold mb-2">
          Fund to Activate
        </Text>
        <Text className="text-white/70 mb-6">
          Choose your starting amount
        </Text>

        {/* Amount Selection */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Row 1 */}
            <AmountTile value={1} label="$1" />
            <AmountTile value={5} label="$5" />
            {/* Row 2 */}
            <AmountTile value={10} label="$10" />
            <AmountTile label="Enter Amount ($)" isInput />
          </View>
        </View>

        {/* Payment Method Selection */}
        <Text style={{ color: '#0F172A', fontWeight: '600', marginBottom: 10 }}>Select payment</Text>
        <View style={{ marginBottom: 24 }}>
          {paymentMethods.map((method) => (
            <PaymentMethodItem
              key={method.id}
              method={method}
              selected={selectedPayment === method.id}
              onPress={() => {
                setSelectedPayment(method.id);
                Haptics.selectionAsync();
              }}
            />
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
            colors={[ '#D155FF', '#B532F2', '#A016E8', '#8F00E0', '#A08CFF' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ height: 55, borderRadius: 40, alignItems: 'center', justifyContent: 'center',
              shadowColor: '#6943AF', shadowOpacity: 0.26, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 6,
              opacity: isProcessing ? 0.5 : 1 }}
          >
            <Text style={{ ...FONTS.bold(18), color: '#FFFFFF' }}>
              {isProcessing ? 'Processing...' : `Fund & Activate`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modals / Bottom Sheets */}
      <FundSuccessSheet
        visible={showFundSuccess}
        onClose={() => setShowFundSuccess(false)}
        onComplete={handleFundSuccessComplete}
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

export default FundCardScreen;
