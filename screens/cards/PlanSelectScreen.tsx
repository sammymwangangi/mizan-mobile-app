import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type PlanSelectNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlanSelect'>;

interface PlanTileProps {
  title: string;
  planName: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
  onSelect: () => void;
}

const PlanTile: React.FC<PlanTileProps> = ({
  title,
  planName,
  price,
  features,
  isRecommended,
  onSelect,
}) => (
  <TouchableOpacity
    onPress={onSelect}
    className={`bg-white rounded-xl p-5 mb-4 ${isRecommended ? 'border-2 border-purple-500' : 'border border-gray-200'}`}
    style={{ elevation: isRecommended ? 4 : 1 }}
    activeOpacity={0.9}
  >
    {isRecommended && (
      <View className="absolute -top-3 right-4 bg-purple-500 px-3 py-1 rounded-full">
        <Text className="text-white text-xs">Recommended</Text>
      </View>
    )}
    
    <Text className="text-lg font-semibold mb-1">{title}</Text>
    <Text className="text-purple-600 text-2xl font-bold mb-2">{price}</Text>
    <Text className="text-gray-600 mb-4">{planName}</Text>
    
    {features.map((feature, index) => (
      <View key={index} className="flex-row items-center mb-2">
        <View className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
        <Text className="text-gray-700">{feature}</Text>
      </View>
    ))}
  </TouchableOpacity>
);

const PlanSelectScreen: React.FC = () => {
  const navigation = useNavigation<PlanSelectNavigationProp>();

  const plans = [
    {
      id: 'noor',
      title: 'Start with a free plan',
      planName: 'Noor Plan',
      price: 'US $0.00/monthly',
      features: [
        'No monthly fees',
        'Virtual card',
        'Basic spend insights',
        'Standard support'
      ]
    },
    {
      id: 'qamar',
      title: 'Recommended Plan',
      planName: 'Qamar Plan',
      price: 'US $3/monthly',
      features: [
        'All Noor features',
        'Metal card option',
        'Advanced analytics',
        'Priority support'
      ]
    },
    {
      id: 'shams',
      title: 'Premium Experience',
      planName: 'Shams Plan',
      price: 'US $9/monthly',
      features: [
        'All Qamar features',
        'Multiple virtual cards',
        'Exclusive rewards',
        'Concierge service'
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    switch (planId) {
      case 'qamar':
        navigation.navigate('QamarIntro', { planId });
        break;
      case 'shams':
        navigation.navigate('ShamsIntro');
        break;
      case 'noor':
      default:
        navigation.navigate('CardStudio', { planId });
        break;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-5">
        <Text className="text-2xl font-bold mb-2">Choose your plan</Text>
        <Text className="text-gray-600 mb-6">
          Select the plan that best fits your needs
        </Text>

        {plans.map((plan) => (
          <PlanTile
            key={plan.id}
            title={plan.title}
            planName={plan.planName}
            price={plan.price}
            features={plan.features}
            isRecommended={plan.id === 'qamar'}
            onSelect={() => handlePlanSelect(plan.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PlanSelectScreen;
