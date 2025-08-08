import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Switch, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { QAMAR_FEATURES, BARAKAH_PURPLE, QAMAR_ANALYTICS } from '../../../constants/qamar';

type QamarReviewNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarReview'>;
type QamarReviewRouteProp = RouteProp<RootStackParamList, 'QamarReview'>;

interface FeatureToggles {
  smartSpend: boolean;
  fraudShield: boolean;
  robinAI: boolean;
}

const QamarReviewScreen: React.FC = () => {
  const navigation = useNavigation<QamarReviewNavigationProp>();
  const route = useRoute<QamarReviewRouteProp>();
  const { planId, selectedColor, deliveryAddress } = route.params;

  const [features, setFeatures] = useState<FeatureToggles>({
    smartSpend: true,
    fraudShield: true,
    robinAI: false
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleFeatureToggle = (featureId: keyof FeatureToggles) => {
    setFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
    Haptics.selectionAsync();
  };

  const handleTermsToggle = () => {
    setTermsAccepted(!termsAccepted);
    Haptics.selectionAsync();
  };

  const handleOrderCard = () => {
    if (!termsAccepted) {
      // Disabled-tap flashes red outline around T&C switch
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
    // PostHog.capture(QAMAR_ANALYTICS.CARD_ORDER_SUBMIT, { 
    //   plan: 'qamar', 
    //   toggles: features 
    // });
    
    navigation.navigate('QamarMinting', { 
      planId, 
      selectedColor, 
      deliveryAddress, 
      features 
    });
  };

  const FeatureToggle: React.FC<{ 
    feature: typeof QAMAR_FEATURES[0], 
    value: boolean, 
    onToggle: () => void 
  }> = ({ feature, value, onToggle }) => (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 mr-4">
        <Text className="text-gray-900 font-semibold text-base">
          {feature.name}
        </Text>
        <Text className="text-gray-600 text-sm">
          {feature.description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: BARAKAH_PURPLE }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
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
        <Text className="text-gray-500 text-sm">Step 3 of 3</Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-purple-600 mr-2" />
          <View className="w-2 h-2 rounded-full bg-purple-600 mr-2" />
          <View className="w-2 h-2 rounded-full bg-purple-600" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Final preview
        </Text>
        <Text className="text-gray-600 text-base mb-8">
          Review your card and customize features
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
          <Text className="text-gray-600 text-sm mt-2">
            {selectedColor} • Qamar Card
          </Text>
        </View>

        {/* Feature Toggles */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Customize your experience
          </Text>
          
          <View className="bg-gray-50 rounded-2xl px-4">
            {QAMAR_FEATURES.map((feature, index) => (
              <View key={feature.id}>
                <FeatureToggle
                  feature={feature}
                  value={features[feature.id as keyof FeatureToggles]}
                  onToggle={() => handleFeatureToggle(feature.id as keyof FeatureToggles)}
                />
                {index < QAMAR_FEATURES.length - 1 && (
                  <View className="h-px bg-gray-200" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Terms & Conditions */}
        <Animated.View
          style={{
            transform: [{ translateX: shakeAnim }],
          }}
          className={`border-2 rounded-2xl p-4 mb-8 ${
            !termsAccepted && shakeAnim._value !== 0 ? 'border-red-500' : 'border-transparent'
          }`}
        >
          <TouchableOpacity
            onPress={handleTermsToggle}
            className="flex-row items-start"
          >
            <View className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 items-center justify-center ${
              termsAccepted ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
            }`}>
              {termsAccepted && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <Text className="text-gray-700 text-sm flex-1">
              I agree to the{' '}
              <Text className="text-purple-600 underline">Terms & Conditions</Text>
              {' '}and{' '}
              <Text className="text-purple-600 underline">Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Order Summary */}
        <View className="bg-purple-50 rounded-2xl p-4 mb-8">
          <Text className="text-purple-900 font-semibold mb-2">
            Order Summary
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-purple-800">
              Qamar Card (Monthly)
            </Text>
            <Text className="text-purple-900 font-semibold">
              $9.99/month
            </Text>
          </View>
          <Text className="text-purple-700 text-xs mt-1">
            First 30 days free
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleOrderCard}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={termsAccepted ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#D1D5DB', '#D1D5DB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`h-14 rounded-full justify-center items-center ${
              !termsAccepted ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Order Card
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QamarReviewScreen;
