import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { FONTS } from 'constants/theme';
import QamarCardPreview from '../../components/cards/qamar/QamarCardPreview';
import { QAMAR_COLORS } from '../../constants/qamar';
import { WalletAddedSheet } from '../../components/cards/qamar/QamarBottomSheets';



type WalletAddNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WalletAdd'>;
type WalletAddScreenRouteProp = RouteProp<RootStackParamList, 'WalletAdd'>;

const WalletAddScreen: React.FC = () => {
  const navigation = useNavigation<WalletAddNavigationProp>();
  const route = useRoute<WalletAddScreenRouteProp>();
  const { cardId, selectedColor } = route.params;

  const [showWalletSuccess, setShowWalletSuccess] = useState(false);

  const handleAddToWallet = async (_type: 'apple' | 'google') => {
    Haptics.selectionAsync();

    // Simulate wallet add instead of real integration for now
    setTimeout(() => {
      setShowWalletSuccess(true);
    }, 600);
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' as never }]
    });
  };



  return (
    <View className="flex-1 bg-white">
      {/* Top nav link (Home) */}
      <View className="px-6 pt-12">
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Text style={{ color: '#3B82F6', ...FONTS.medium(14) }}>Home</Text>
        </TouchableOpacity>
      </View>

      <View className="px-6 pt-2 pb-10">
        {/* Title and funded */}
        <Text style={{ ...FONTS.bold(26), color: '#0F172A' }}>Your Card Is Ready{`\n`}Funded: $1.00</Text>
        <Text style={{ ...FONTS.medium(12), color: '#64748B', marginTop: 10 }}>Here’s your shiny new Noor Card. Start{`\n`}spending ethically and fee–free right away</Text>

        {/* Card preview (selected color) */}
        <View style={{ marginTop: 22, alignItems: 'center' }}>
          <View style={{ width: 320, height: 200, borderRadius: 16, backgroundColor: '#FFFFFF',
            shadowColor: '#6943AF', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 16 }, elevation: 8, overflow: 'hidden' }}>
            <QamarCardPreview
              color={(QAMAR_COLORS.find(c => c.id === selectedColor) || null)}
              playSheen={true}
              expiryText="Exp 12/2026"
              width={320}
              height={200}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={{ marginTop: 22 }}>
          <TouchableOpacity onPress={() => handleAddToWallet('apple')} activeOpacity={0.9}
            style={{ height: 56, borderRadius: 28, backgroundColor: '#0F172A', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18,
              shadowColor: '#111827', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
            <Image source={require('../../assets/logos/apple-wallet.png')} style={{ width: 24, height: 24, marginRight: 12 }} />
            <Text style={{ ...FONTS.semibold(14), color: '#FFFFFF' }}>Add to Apple Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleAddToWallet('google')} activeOpacity={0.9}
            style={{ height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginTop: 14 }}>
            <Image source={require('../../assets/logos/google-wallet.png')} style={{ width: 24, height: 24, marginRight: 12 }} />
            <Text style={{ ...FONTS.semibold(14), color: '#111827' }}>Add to Google Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBackToHome} style={{ alignSelf: 'center', marginTop: 18 }}>
            <Text style={{ ...FONTS.medium(12), color: '#6B7280', textDecorationLine: 'underline' }}>{'< Back to Home'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallet success sheet (Sheet-WalletOK spec) */}
      <WalletAddedSheet
        visible={showWalletSuccess}
        onClose={() => setShowWalletSuccess(false)}
        onComplete={() => {
          setShowWalletSuccess(false);
          navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
        }}
      />
    </View>
  );
};

export default WalletAddScreen;
