import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { QAMAR_BENEFITS, BARAKAH_PURPLE, QAMAR_ANALYTICS } from '../../../constants/qamar';
import { AnimatedCardHero } from '../../../components/shared/AnimatedComponents';

type QamarIntroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarIntro'>;
type QamarIntroRouteProp = RouteProp<RootStackParamList, 'QamarIntro'>;

const QamarIntroScreen: React.FC = () => {
  const navigation = useNavigation<QamarIntroNavigationProp>();
  const route = useRoute<QamarIntroRouteProp>();
  const { planId } = route.params;

  const handleCreateCard = () => {
    Haptics.selectionAsync();
    // Track analytics
    // PostHog.capture(QAMAR_ANALYTICS.CARD_STEP_VIEW, { step: 'intro', plan: 'qamar' });
    navigation.navigate('QamarStudio', { planId });
  };

  const BenefitItem: React.FC<{ benefit: typeof QAMAR_BENEFITS[0] }> = ({ benefit }) => (
    <View className="flex-row items-start mb-4">
      <View className="w-6 h-6 rounded-full bg-purple-100 items-center justify-center mr-4 mt-0.5">
        <View className="w-2 h-2 rounded-full bg-purple-600" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base mb-1">
          {benefit.title}
        </Text>
        <Text className="text-gray-600 text-sm">
          {benefit.description}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Text className="text-gray-600 text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">Qamar Preview</Text>
        <View className="w-10" />
      </View>

      <View className="px-5">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Meet Qamar
          </Text>
          <Text className="text-gray-600 text-center mb-8 text-base">
            Your premium halal card with enhanced features
          </Text>

          {/* 3D Card Hero with Animation */}
          <AnimatedCardHero style={{ marginBottom: 32 }}>
            <Image
              source={require('../../../assets/cards/mizan-card.png')}
              style={{
                width: 320,
                height: 200,
              }}
              resizeMode="contain"
            />
          </AnimatedCardHero>
        </View>

        {/* Benefits List (6-bullet list) */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-6">
            What you get with Qamar
          </Text>
          
          {QAMAR_BENEFITS.map((benefit) => (
            <BenefitItem key={benefit.id} benefit={benefit} />
          ))}
        </View>

        {/* Additional Features */}
        <View className="bg-purple-50 rounded-2xl p-6 mb-8">
          <Text className="text-lg font-semibold text-purple-900 mb-3">
            Premium Features
          </Text>
          <View className="space-y-2">
            <Text className="text-purple-800 text-sm">
              • Advanced spending analytics with AI insights
            </Text>
            <Text className="text-purple-800 text-sm">
              • Priority customer support via dedicated line
            </Text>
            <Text className="text-purple-800 text-sm">
              • Exclusive access to investment opportunities
            </Text>
            <Text className="text-purple-800 text-sm">
              • Enhanced security with biometric authentication
            </Text>
          </View>
        </View>

        {/* Pricing Info */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-900">
              Monthly Fee
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              $9.99
            </Text>
          </View>
          <Text className="text-gray-600 text-sm">
            First 30 days free • Cancel anytime
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleCreateCard}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={[BARAKAH_PURPLE, '#9F7AFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-14 rounded-full justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Create my Qamar card
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default QamarIntroScreen;
