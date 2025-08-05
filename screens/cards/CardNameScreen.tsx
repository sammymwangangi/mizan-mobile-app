import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { RouteProp } from '@react-navigation/native';
import type { CardStackParamList, CardScreenNavigationProp } from '../../navigation/CardNavigationTypes';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

type CardNameRouteProp = RouteProp<CardStackParamList, 'CardName'>;

const CardNameScreen: React.FC = () => {
  const navigation = useNavigation<CardScreenNavigationProp>();
  const route = useRoute<CardNameRouteProp>();
  const { color, isMetal } = route.params;
  
  const [cardName, setCardName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = () => {
    if (cardName.trim()) {
      navigation.navigate('CardReview', {
        color,
        isMetal,
        name: cardName.trim()
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 p-5">
        <Text className="text-2xl font-bold mb-2">Name your card</Text>
        <Text className="text-gray-600 mb-6">Step 2 of 3</Text>

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
        </View>

        {/* Name Input */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-2">Card name</Text>
          <TextInput
            value={cardName}
            onChangeText={setCardName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g. Bills, Sadaqa"
            maxLength={20}
            className={`border-2 rounded-xl p-4 text-lg ${
              isFocused ? 'border-purple-500' : 'border-gray-200'
            }`}
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />
          <Text className="text-gray-500 text-right mt-2">
            {cardName.length}/20
          </Text>
        </View>

        {/* Next Button */}
        <View className="mt-auto">
          <TouchableOpacity
            onPress={handleNext}
            disabled={!cardName.trim()}
            className="w-full"
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#921BE6', '#A08CFF']}
              locations={[0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className={`h-14 rounded-full justify-center items-center ${
                !cardName.trim() ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                Review & mint
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CardNameScreen;
