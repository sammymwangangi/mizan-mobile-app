import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { METAL_SWATCHES, METAL_OPTIONS, CTA_GRADIENT, ANALYTICS_EVENTS, SHAMS_TOKENS } from '../../../constants/shams';
import ShamsCardPreview from '../../../components/cards/shams/ShamsCardPreview';
import ShamsHeader from '../../../components/cards/shams/ShamsHeader';

type ShamsStudioNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsStudio'>;

const ShamsStudioScreen: React.FC = () => {
  const navigation = useNavigation<ShamsStudioNavigationProp>();
  const defaultIndex = Math.max(0, METAL_OPTIONS.findIndex(m => m.id === 'bronze'));
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const selectedMetal = METAL_OPTIONS[selectedIndex]?.id;
  const scaleAnims = useRef(METAL_OPTIONS.map(() => new Animated.Value(1))).current;
  const carouselRef = useRef<FlatList>(null);

  const handleMetalSelect = (metalId: string, index: number) => {
    setSelectedIndex(index);

    // Scroll carousel to selected index
    carouselRef.current?.scrollToIndex?.({ index, animated: true, viewPosition: 0.5 });

    // Swatch tap animation: scale 1→1.15→1 in 100ms
    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 1.15, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleAnims[index], { toValue: 1, duration: 50, useNativeDriver: true }),
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
      accessibilityRole="button"
      accessibilityLabel={`Select ${metal.name}`}
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
    <View className="flex-1" style={{ backgroundColor: SHAMS_TOKENS.background }}>
      <ShamsHeader
        title="Shams Gold Club"
        subtitle="Made from 20g of aerospace‑grade steel. Heavy on blessings. Light in hand."
        step={1}
        onBack={() => navigation.goBack()}
      />

      {/* Content */}
      <View className="flex-1 px-5">

        {/* Metal Card Carousel */}
        <FlatList
          ref={carouselRef}
          data={METAL_OPTIONS}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={360}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          initialScrollIndex={selectedIndex}
          getItemLayout={(_, i) => ({ length: 360, offset: 360 * i, index: i })}
          onScrollToIndexFailed={(info) => setTimeout(() => carouselRef.current?.scrollToIndex?.({ index: info.index, animated: true }), 200)}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / 360);
            if (index >= 0 && index < METAL_OPTIONS.length && index !== selectedIndex) {
              setSelectedIndex(index);
              Haptics.selectionAsync();
            }
          }}
          renderItem={({ item, index }) => (
            <View style={{ width: 360, alignItems: 'center' }}>
              <ShamsCardPreview metalId={item.id} playSheen={selectedIndex === index} />
            </View>
          )}
        />
        <Text className="text-white/70 text-xs text-center mt-2">$ 9.99/mo • 500 Only</Text>
        <View style={{ height: 16 }} />

      </View>

      {/* CTA Button inside panel like Figma */}
      <View className="px-5 pb-8">
        <View className="rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <View className="px-5 pt-5 pb-4">
            <Text className="text-white text-lg font-semibold mb-5">Pick your finish</Text>
            <View className="flex-row justify-center">
              {METAL_OPTIONS.map((metal, index) => (
                <MetalSwatch key={metal.id} metal={metal} index={index} />
              ))}
            </View>
          </View>
          <View className="px-5 pb-5">
            <TouchableOpacity
              onPress={handleNext}
              disabled={selectedIndex < 0}
              activeOpacity={0.9}
              className="w-full"
            >
              <LinearGradient
                colors={selectedIndex >= 0 ? CTA_GRADIENT.colors : ['#666', '#666']}
                start={CTA_GRADIENT.start}
                end={CTA_GRADIENT.end}
                className={`h-14 rounded-full justify-center items-center ${selectedIndex < 0 ? 'opacity-50' : ''}`}
              >
                <Text className="text-white font-semibold text-lg">Claim My Metal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShamsStudioScreen;
