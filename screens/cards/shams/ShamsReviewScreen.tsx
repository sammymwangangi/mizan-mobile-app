import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Switch, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { CTA_GRADIENT, ANALYTICS_EVENTS } from '../../../constants/shams';

type ShamsReviewNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsReview'>;
type ShamsReviewRouteProp = RouteProp<RootStackParamList, 'ShamsReview'>;

interface ToggleSettings {
  smartSpending: boolean;
  fraudProtection: boolean;
  aiPro: boolean;
}

const ShamsReviewScreen: React.FC = () => {
  const navigation = useNavigation<ShamsReviewNavigationProp>();
  const route = useRoute<ShamsReviewRouteProp>();
  const { selectedMetal, deliveryAddress } = route.params;

  const [settings, setSettings] = useState<ToggleSettings>({
    smartSpending: true,
    fraudProtection: true,
    aiPro: false
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleToggle = (setting: keyof ToggleSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    Haptics.selectionAsync();
  };

  const handleTermsToggle = () => {
    setAcceptedTerms(!acceptedTerms);
    Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    if (!acceptedTerms) {
      // Shake animation + light haptic for disabled tap
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    Haptics.selectionAsync();
    // Track analytics
    // PostHog.capture(ANALYTICS_EVENTS.CARD_ORDER_SUBMIT, { metal: selectedMetal });
    
    // Navigate to minting process
    navigation.navigate('CardMinting', { 
      selectedMetal, 
      deliveryAddress, 
      settings 
    });
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
        <Text className="text-white/60 text-sm">Review & Order</Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2" />
          <View className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2" />
          <View className="w-2 h-2 rounded-full bg-[#D4AF37]" />
        </View>
        
        {/* Progress Bar */}
        <View className="w-full h-1 bg-white/20 rounded-full mt-4">
          <View className="w-full h-full bg-[#D4AF37] rounded-full" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        <Text className="text-white text-2xl font-bold mb-2">
          Review & Order
        </Text>
        <Text className="text-white/70 text-base mb-8">
          Let's personalise your card
        </Text>

        {/* Card Preview */}
        <View className="items-center mb-8">
          <Image
            source={require('../../../assets/cards/mizan-card.png')}
            style={{
              width: 280,
              height: 175,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Settings Toggles */}
        <View className="space-y-4 mb-8">
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <Text className="text-white font-semibold">AI Powered Spend Insights</Text>
              <Text className="text-white/60 text-sm">Get smart spending recommendations</Text>
            </View>
            <Switch
              value={settings.smartSpending}
              onValueChange={() => handleToggle('smartSpending')}
              trackColor={{ false: '#666', true: '#D4AF37' }}
              thumbColor={settings.smartSpending ? '#fff' : '#ccc'}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <Text className="text-white font-semibold">Fraud & Security Shield</Text>
              <Text className="text-white/60 text-sm">Advanced fraud protection</Text>
            </View>
            <Switch
              value={settings.fraudProtection}
              onValueChange={() => handleToggle('fraudProtection')}
              trackColor={{ false: '#666', true: '#D4AF37' }}
              thumbColor={settings.fraudProtection ? '#fff' : '#ccc'}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <Text className="text-white font-semibold">Robin Habibi AI+ (Beta)</Text>
              <Text className="text-white/60 text-sm">Advanced AI financial assistant</Text>
            </View>
            <Switch
              value={settings.aiPro}
              onValueChange={() => handleToggle('aiPro')}
              trackColor={{ false: '#666', true: '#D4AF37' }}
              thumbColor={settings.aiPro ? '#fff' : '#ccc'}
            />
          </View>
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity
          onPress={handleTermsToggle}
          className="flex-row items-start mb-8"
        >
          <View className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 items-center justify-center ${
            acceptedTerms ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/30'
          }`}>
            {acceptedTerms && (
              <Text className="text-black text-xs font-bold">✓</Text>
            )}
          </View>
          <Text className="text-white/70 text-sm flex-1">
            I agree to Mizan's{' '}
            <Text className="text-[#D4AF37] underline">Terms & Conditions</Text>
            {' '}and{' '}
            <Text className="text-[#D4AF37] underline">Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <Animated.View
          style={{
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.9}
            className="w-full"
          >
            <LinearGradient
              colors={acceptedTerms ? CTA_GRADIENT.colors : ['#666', '#666']}
              start={CTA_GRADIENT.start}
              end={CTA_GRADIENT.end}
              className={`h-14 rounded-full justify-center items-center ${
                !acceptedTerms ? 'opacity-50 border-2 border-red-500/50' : ''
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                Enter the Gold Club
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default ShamsReviewScreen;
