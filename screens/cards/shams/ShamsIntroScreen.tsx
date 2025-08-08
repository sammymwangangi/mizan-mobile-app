import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { METAL_SWATCHES, CTA_GRADIENT, ANALYTICS_EVENTS } from '../../../constants/shams';

type ShamsIntroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsIntro'>;

const ShamsIntroScreen: React.FC = () => {
  const navigation = useNavigation<ShamsIntroNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hero subtle scale yoyo animation every 5 seconds
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startAnimation, 5000);
      });
    };

    startAnimation();
  }, [scaleAnim]);

  const handleUnlockShams = () => {
    Haptics.selectionAsync();
    // Track analytics
    // PostHog.capture(ANALYTICS_EVENTS.CARD_STEP_VIEW, { step: 'intro' });
    navigation.navigate('ShamsStudio');
  };

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
        <Text className="text-white/60 text-sm">Intro</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        <Text className="text-white text-2xl font-bold mb-2">
          Begin your Shams journey
        </Text>
        <Text className="text-white/70 text-base mb-8">
          Spend ethically. Grow constantly.
        </Text>

        {/* Hero Card with Animation */}
        <View className="items-center mb-8">
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Image
              source={require('../../../assets/cards/mizan-card.png')}
              style={{
                width: 300,
                height: 190,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Features List */}
        <View className="mb-8">
          <View className="bg-white/5 rounded-2xl p-6 mb-4">
            <Text className="text-white text-lg font-semibold mb-4">
              All Qannas Privileges plus:
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Text className="text-[#D4AF37] text-lg mr-3">•</Text>
                <Text className="text-white/80 flex-1">
                  Save & invest with Robin Habibi AI
                </Text>
              </View>
              
              <View className="flex-row items-start">
                <Text className="text-[#D4AF37] text-lg mr-3">•</Text>
                <Text className="text-white/80 flex-1">
                  Early access to new features
                </Text>
              </View>
              
              <View className="flex-row items-start">
                <Text className="text-[#D4AF37] text-lg mr-3">•</Text>
                <Text className="text-white/80 flex-1">
                  Access to VIP events & Shams Only&apos;s
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white/5 rounded-2xl p-6">
            <Text className="text-white text-lg font-semibold mb-2">
              Spend better - 0% pay later
            </Text>
            <Text className="text-white/70 text-sm mb-3">
              Lightweight pay later support system
            </Text>
            
            <Text className="text-white text-lg font-semibold mb-2">
              Live mindfully & VIP perks
            </Text>
            <Text className="text-white/70 text-sm">
              Early access to new features
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleUnlockShams}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={CTA_GRADIENT.colors}
            start={CTA_GRADIENT.start}
            end={CTA_GRADIENT.end}
            className="h-14 rounded-full justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Unlock Shams
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShamsIntroScreen;
