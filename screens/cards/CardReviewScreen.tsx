import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { RouteProp } from '@react-navigation/native';
import type { CardStackParamList, CardScreenNavigationProp } from '../../navigation/CardNavigationTypes';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

type CardReviewRouteProp = RouteProp<CardStackParamList, 'CardReview'>;

interface FeatureToggleProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({
  title,
  description,
  value,
  onValueChange,
}) => (
  <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
    <View className="flex-1 mr-4">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-gray-600 text-sm">{description}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E7EB', true: '#A016E8' }}
      thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
    />
  </View>
);

const CardReviewScreen: React.FC = () => {
  const navigation = useNavigation<CardScreenNavigationProp>();
  const route = useRoute<CardReviewRouteProp>();
  const { color, isMetal, name } = route.params;

  const [features, setFeatures] = useState({
    smartSpend: true,
    fraudShield: true,
    robinAI: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleMint = () => {
    if (termsAccepted) {
      navigation.navigate('CardMinting', {
        cardDetails: {
          color,
          isMetal,
          name,
          features,
        },
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-5">
          <Text className="text-2xl font-bold mb-2">Review your card</Text>
          <Text className="text-gray-600 mb-6">Step 3 of 3</Text>

          {/* Card Preview */}
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/cards/mizan-card.png')}
              style={{
                width: normalize(300),
                height: normalize(190),
              }}
              resizeMode="contain"
            />
            <Text className="text-center text-gray-600 mt-2">{name}</Text>
          </View>

          {/* Features Section */}
          <View className="mb-8">
            <Text className="text-lg font-semibold mb-4">Card Features</Text>
            
            <FeatureToggle
              title="Smart Spend Insights"
              description="Get detailed analysis of your spending patterns"
              value={features.smartSpend}
              onValueChange={(value) => 
                setFeatures(prev => ({ ...prev, smartSpend: value }))
              }
            />
            
            <FeatureToggle
              title="Fraud Shield"
              description="Real-time fraud detection and prevention"
              value={features.fraudShield}
              onValueChange={(value) => 
                setFeatures(prev => ({ ...prev, fraudShield: value }))
              }
            />
            
            <FeatureToggle
              title="Robin AI Assistant"
              description="AI-powered spending recommendations"
              value={features.robinAI}
              onValueChange={(value) => 
                setFeatures(prev => ({ ...prev, robinAI: value }))
              }
            />
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            className="flex-row items-center mb-8"
            activeOpacity={0.7}
          >
            <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              termsAccepted ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
            }`}>
              {termsAccepted && (
                <Text className="text-white text-sm">✓</Text>
              )}
            </View>
            <Text className="flex-1 text-gray-700">
              I accept the Terms & Conditions and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Mint Button */}
      <View className="p-5 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleMint}
          disabled={!termsAccepted}
          className="w-full"
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
            locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className={`h-14 rounded-full justify-center items-center ${
              !termsAccepted ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Mint my card
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardReviewScreen;
