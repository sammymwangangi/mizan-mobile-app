import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

type CardClaimNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardClaim'>;

const CardClaimScreen: React.FC = () => {
  const navigation = useNavigation<CardClaimNavigationProp>();
  const scale = useRef(new Animated.Value(1)).current;

  // Card subtle animation (1 -> 1.03 scale)
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        })
      ]).start(() => animate());
    };

    animate();
  }, [scale]);

  const handleClaimCard = () => {
    // Analytics event could be added here
    navigation.navigate('PlanSelect');
  };

  return (
    <View className="flex-1 bg-white px-5 py-8">
      {/* Hero Section */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold mb-4 text-center">
          Claim your first Mizan Card
        </Text>
        
        <Text className="text-gray-600 mb-8 text-center">
          Join thousands of people enjoying ethical banking
        </Text>

        <Animated.View style={{ transform: [{ scale }] }}>
          <Image
            source={require('../../assets/cards/mizan-card.png')}
            style={{ width: normalize(300), height: normalize(190) }}
            resizeMode="contain"
          />
        </Animated.View>

        <View className="mt-8 space-y-4">
          {/* Benefits list */}
          <View className="flex-row items-center space-x-2">
            <View className="w-2 h-2 rounded-full bg-purple-500" />
            <Text className="text-gray-700">No hidden fees</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-2 h-2 rounded-full bg-purple-500" />
            <Text className="text-gray-700">100% Shariah compliant</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-2 h-2 rounded-full bg-purple-500" />
            <Text className="text-gray-700">Instant virtual card</Text>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={handleClaimCard}
        className="w-full"
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
          locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="h-14 rounded-full justify-center items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Claim my card
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default CardClaimScreen;
