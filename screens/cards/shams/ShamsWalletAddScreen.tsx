import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { FONTS } from 'constants/theme';
import ShamsCardPreview from '../../../components/cards/shams/ShamsCardPreview';
import { SHAMS_TOKENS } from '../../../constants/shams';
import { ShamsAppleWalletSheet, ShamsGoogleWalletSheet } from '../../../components/cards/shams/ShamsBottomSheets';
import ShamsHeader from '../../../components/cards/shams/ShamsHeader';

type ShamsWalletAddNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsWalletAdd'>;
type ShamsWalletAddScreenRouteProp = RouteProp<RootStackParamList, 'ShamsWalletAdd'>;

const ShamsWalletAddScreen: React.FC = () => {
  const navigation = useNavigation<ShamsWalletAddNavigationProp>();
  const route = useRoute<ShamsWalletAddScreenRouteProp>();
  const { cardId, selectedMetal, selectedColor } = route.params;

  const [showAppleWalletSuccess, setShowAppleWalletSuccess] = useState(false);
  const [showGoogleWalletSuccess, setShowGoogleWalletSuccess] = useState(false);

  const handleAddToWallet = async (type: 'apple' | 'google') => {
    Haptics.selectionAsync();

    // Simulate wallet add instead of real integration for now
    setTimeout(() => {
      if (type === 'apple') {
        setShowAppleWalletSuccess(true);
      } else {
        setShowGoogleWalletSuccess(true);
      }
    }, 600);
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' as never }]
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: SHAMS_TOKENS.background }}>
      {/* Background Pattern */}
      <Image source={SHAMS_TOKENS.pattern} style={styles.pattern} resizeMode="contain" />

      {/* Header */}
      <ShamsHeader title="" onBack={() => navigation.goBack()} />

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
        {/* Title and funded */}
        <Text style={{ ...FONTS.bold(26), color: '#FFFFFF', marginBottom: 10 }}>
          Your Card Is Ready{'\n'}Funded: $10.00
        </Text>
        <Text style={{ ...FONTS.medium(12), color: '#9CA3AF', marginBottom: 22 }}>
          Here&apos;s your shiny new Shams Card. Start{'\n'}spending ethically and fee–free right away
        </Text>

        {/* Card preview (selected metal) */}
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <View
            style={{
              width: 320,
              height: 200,
              borderRadius: 16,
              backgroundColor: SHAMS_TOKENS.background,
              shadowColor: '#DDA79B',
              shadowOpacity: 0.18,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 16 },
              elevation: 8,
              overflow: 'hidden',
            }}
          >
            <ShamsCardPreview
              metalId={selectedMetal}
              playSheen={true}
              expiryText="Exp 12/2026"
              width={320}
              height={200}
            />
          </View>
        </View>

        {/* Buttons */}
        <View>
          {/* Add to Apple Wallet */}
          <TouchableOpacity
            onPress={() => handleAddToWallet('apple')}
            activeOpacity={0.9}
            style={{ marginBottom: 14 }}
          >
            <LinearGradient
              colors={['#DDA79B', '#F6CFCA', '#D39B8E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 56,
                borderRadius: 40,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 18,
                shadowColor: '#DDA79B',
                shadowOpacity: 0.26,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4,
              }}
            >
              <Image
                source={require('../../../assets/logos/apple-wallet.png')}
                style={{ width: 24, height: 24, marginRight: 12 }}
              />
              <Text style={{ ...FONTS.semibold(16), color: '#1B1C39' }}>Add to Apple Wallet</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Add to Google Wallet */}
          <TouchableOpacity
            onPress={() => handleAddToWallet('google')}
            activeOpacity={0.9}
            style={{ marginBottom: 18 }}
          >
            <View
              style={{
                height: 56,
                borderRadius: 40,
                backgroundColor: '#2A2B4A',
                borderWidth: 1,
                borderColor: '#3A3B5A',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 18,
              }}
            >
              <Image
                source={require('../../../assets/logos/google-wallet.png')}
                style={{ width: 24, height: 24, marginRight: 12 }}
              />
              <Text style={{ ...FONTS.semibold(16), color: '#FFFFFF' }}>Add to Google Wallet</Text>
            </View>
          </TouchableOpacity>

          {/* Back to Home Link */}
          <TouchableOpacity onPress={handleBackToHome} style={{ alignSelf: 'center' }}>
            <Text style={{ ...FONTS.medium(12), color: '#9CA3AF', textDecorationLine: 'underline' }}>
              {'< Back to Home'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Apple Wallet success sheet */}
      <ShamsAppleWalletSheet
        visible={showAppleWalletSuccess}
        onClose={() => setShowAppleWalletSuccess(false)}
        onComplete={() => {
          setShowAppleWalletSuccess(false);
          handleBackToHome();
        }}
      />

      {/* Google Wallet success sheet */}
      <ShamsGoogleWalletSheet
        visible={showGoogleWalletSuccess}
        onClose={() => setShowGoogleWalletSuccess(false)}
        onComplete={() => {
          setShowGoogleWalletSuccess(false);
          handleBackToHome();
        }}
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

export default ShamsWalletAddScreen;

