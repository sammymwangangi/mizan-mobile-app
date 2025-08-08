import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { METAL_SWATCHES, METAL_OPTIONS, CTA_GRADIENT, ANALYTICS_EVENTS } from '../../../constants/shams';

type ShamsStudioNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsStudio'>;

const ShamsStudioScreen: React.FC = () => {
  const navigation = useNavigation<ShamsStudioNavigationProp>();
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const scaleAnims = useRef(METAL_OPTIONS.map(() => new Animated.Value(1))).current;

  const handleMetalSelect = (metalId: string, index: number) => {
    setSelectedMetal(metalId);
    
    // Swatch tap animation: scale 1→1.15→1 in 100ms
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 1.15,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.selectionAsync();
    
    // Track analytics
    // PostHog.capture(ANALYTICS_EVENTS.CARD_METAL_COLOUR, { colour: metalId });
  };

  const handleNext = () => {
    if (!selectedMetal) return;
    
    Haptics.selectionAsync();
    navigation.navigate('ShamsAddress', { selectedMetal });
  };

  const MetalSwatch: React.FC<{ metal: typeof METAL_OPTIONS[0], index: number }> = ({ metal, index }) => (
    <TouchableOpacity
      onPress={() => handleMetalSelect(metal.id, index)}
      className="items-center mx-4"
      activeOpacity={0.8}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnims[index] }],
        }}
        className={`w-16 h-16 rounded-full mb-3 border-2 ${
          selectedMetal === metal.id ? 'border-white' : 'border-white/30'
        }`}
      >
        <LinearGradient
          colors={[metal.colors.light, metal.colors.base, metal.colors.dark]}
          className="w-full h-full rounded-full"
        />
      </Animated.View>
      <Text className={`text-sm font-medium ${
        selectedMetal === metal.id ? 'text-white' : 'text-white/70'
      }`}>
        {metal.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#1A1B23]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white/60 text-sm">Selection of cards</Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2" />
          <View className="w-2 h-2 rounded-full bg-white/30 mr-2" />
          <View className="w-2 h-2 rounded-full bg-white/30" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        <Text className="text-white text-2xl font-bold mb-2">
          Shams Gold Club
        </Text>
        <Text className="text-white/70 text-base mb-8">
          Metal finish that fits your style
        </Text>

        {/* Metal Card Preview */}
        <View className="items-center mb-8">
          <View className="relative">
            {Platform.OS === 'ios' ? (
              // WebGL/Skia implementation for iOS
              <View className="w-80 h-48 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 items-center justify-center">
                <Text className="text-white text-sm">WebGL Card Preview</Text>
              </View>
            ) : (
              // PNG + blur fallback for Android
              <Image
                source={require('../../../assets/cards/mizan-card.png')}
                style={{
                  width: 320,
                  height: 200,
                }}
                resizeMode="contain"
              />
            )}
            
            {/* Sound icon */}
            <TouchableOpacity className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-white text-xs">🔊</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metal Selection */}
        <View className="mb-8">
          <Text className="text-white text-lg font-semibold mb-6 text-center">
            Pick your finish
          </Text>
          
          <View className="flex-row justify-center">
            {METAL_OPTIONS.map((metal, index) => (
              <MetalSwatch key={metal.id} metal={metal} index={index} />
            ))}
          </View>
        </View>

        {/* Upgrade Banner */}
        <View className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 mb-8">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#D4AF37] items-center justify-center mr-3">
              <Text className="text-black text-xs font-bold">⭐</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[#D4AF37] font-semibold">Gold wait-list</Text>
              <Text className="text-white/70 text-sm">500 pcs limited edition</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedMetal}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={selectedMetal ? CTA_GRADIENT.colors : ['#666', '#666']}
            start={CTA_GRADIENT.start}
            end={CTA_GRADIENT.end}
            className={`h-14 rounded-full justify-center items-center ${
              !selectedMetal ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Claim My Metal
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShamsStudioScreen;
