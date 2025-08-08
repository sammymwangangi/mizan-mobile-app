import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { QAMAR_COLORS, BARAKAH_PURPLE, QAMAR_ANALYTICS } from '../../../constants/qamar';
import { AnimatedSwatch } from '../../../components/shared/AnimatedComponents';

type QamarStudioNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarStudio'>;
type QamarStudioRouteProp = RouteProp<RootStackParamList, 'QamarStudio'>;

const QamarStudioScreen: React.FC = () => {
  const navigation = useNavigation<QamarStudioNavigationProp>();
  const route = useRoute<QamarStudioRouteProp>();
  const { planId } = route.params;

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    
    // Track analytics
    // PostHog.capture(QAMAR_ANALYTICS.EVENT_COLOUR_CHOSEN, { colour: colorId });
  };

  const handleNext = () => {
    if (!selectedColor) return;
    
    Haptics.selectionAsync();
    navigation.navigate('QamarAddress', { 
      planId, 
      selectedColor 
    });
  };

  const ColorSwatch: React.FC<{ color: typeof QAMAR_COLORS[0] }> = ({ color }) => (
    <AnimatedSwatch
      onPress={() => handleColorSelect(color.id)}
      style={{ marginHorizontal: 8, marginBottom: 16 }}
    >
      <View className="items-center">
        <View
          className={`w-16 h-16 rounded-full mb-3 border-4 ${
            selectedColor === color.id ? 'border-white shadow-lg' : 'border-gray-200'
          }`}
          style={{ backgroundColor: color.value }}
        />
        <Text className={`text-sm font-medium ${
          selectedColor === color.id ? 'text-gray-900' : 'text-gray-600'
        }`}>
          {color.name}
        </Text>
        <Text className="text-xs text-gray-500 text-center">
          {color.description}
        </Text>
      </View>
    </AnimatedSwatch>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Text className="text-gray-600 text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">Step 1 of 3</Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-purple-600 mr-2" />
          <View className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Choose your style
        </Text>
        <Text className="text-gray-600 text-base mb-8">
          Pick a color that reflects your personality
        </Text>

        {/* Card Preview */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={require('../../../assets/cards/mizan-card.png')}
              style={{
                width: 280,
                height: 175,
                tintColor: selectedColor ? 
                  QAMAR_COLORS.find(c => c.id === selectedColor)?.value : 
                  BARAKAH_PURPLE
              }}
              resizeMode="contain"
            />
            
            {/* Lottie sheen animation placeholder */}
            {selectedColor && (
              <View className="absolute inset-0 items-center justify-center">
                <View className="w-8 h-8 bg-white/30 rounded-full animate-pulse" />
              </View>
            )}
          </View>
        </View>

        {/* Color Swatches */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-6">
            Available colors
          </Text>
          
          <View className="flex-row flex-wrap justify-center">
            {QAMAR_COLORS.map((color) => (
              <ColorSwatch key={color.id} color={color} />
            ))}
          </View>
        </View>

        {/* Metal Upsell (Disabled) */}
        <View className="bg-gray-50 rounded-2xl p-4 mb-8 opacity-50">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-700 font-semibold">
                Upgrade to Metal
              </Text>
              <Text className="text-gray-500 text-sm">
                Premium metal finish (Coming Soon)
              </Text>
            </View>
            <View className="w-12 h-6 bg-gray-300 rounded-full" />
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedColor}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={selectedColor ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#D1D5DB', '#D1D5DB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`h-14 rounded-full justify-center items-center ${
              !selectedColor ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Next: shipping
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QamarStudioScreen;
