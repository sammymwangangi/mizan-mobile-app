import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { CTA_GRADIENT, SHAMS_TOKENS } from '../../../constants/shams';
import ShamsCardPreview from '../../../components/cards/shams/ShamsCardPreview';
import ShamsHeader from '../../../components/cards/shams/ShamsHeader';
import { GlassInput } from '../../../components/shared/GlassInput';
import { SearchIcon } from 'lucide-react-native';
import { FONTS } from 'constants/theme';

type ShamsAddressNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsAddress'>;
type ShamsAddressRouteProp = RouteProp<RootStackParamList, 'ShamsAddress'>;

const ShamsAddressScreen: React.FC = () => {
  const navigation = useNavigation<ShamsAddressNavigationProp>();
  const route = useRoute<ShamsAddressRouteProp>();
  const { selectedMetal, selectedColor } = route.params;

  const [address, setAddress] = useState('');

  const handleNext = () => {
    if (!address.trim()) return;
    
    Haptics.selectionAsync();
    navigation.navigate('ShamsReview', { 
      planId: 'shams',
      selectedMetal,
      selectedColor,
      deliveryAddress: {
        address: address.trim()
      }
    });
  };

  const isValid = address.trim().length > 0;

  return (
    <View className="flex-1" style={{ backgroundColor: SHAMS_TOKENS.background }}>
      <ShamsHeader
        title="Your Card, Your Way"
        subtitle="Let us know where to deliver your exquisite Shams card"
        step={2}
        onBack={() => navigation.goBack()}
      />

      <ScrollView className="flex-1 px-5 relative">
        {/* Selected card preview */}
        <View className="items-center mb-8">
          <ShamsCardPreview metalId={selectedMetal} playSheen />
        </View>

        {/* Glass Address Input */}
        <View className="space-y-4" style={{ position: 'absolute', left: 0, right: 0, top: 120, zIndex: 2  }}>
          <GlassInput
            value={address}
            onChangeText={setAddress}
            placeholder="Type your address, we'll find it"
            height={55}
            radius={28}
            multiline
            numberOfLines={4}
            showNoise
            left={<SearchIcon size={18} color="rgba(255,255,255,0.75)" />}
          />
        </View>

      </ScrollView>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={['#D39C90', '#FFFFFF', '#D39B8E']}
            start={CTA_GRADIENT.start}
            end={CTA_GRADIENT.end}
            className={`h-14 ${
              !isValid ? 'opacity-50' : ''
            }`}
            style={{ borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{...FONTS.semibold(18), color: '#000000'}}>
              Confirm Address
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShamsAddressScreen;
