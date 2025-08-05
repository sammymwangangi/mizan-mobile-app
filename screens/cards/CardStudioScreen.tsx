import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CardScreenNavigationProp } from '../../navigation/CardNavigationTypes';

// Simple normalize function to replace the import
const normalize = (size: number) => size;

interface ColorOption {
  id: string;
  name: string;
  colors: [string, string, ...string[]];
}

const colorOptions: ColorOption[] = [
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: ['#D155FF', '#B532F2', '#A016E8']
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: ['#5592EF', '#3461ED', '#2F4BDB']
  },
  {
    id: 'green',
    name: 'Forest Green',
    colors: ['#4CAF50', '#388E3C', '#2E7D32']
  }
];

const CardStudioScreen: React.FC = () => {
  const navigation = useNavigation<CardScreenNavigationProp>();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedMetal, setSelectedMetal] = useState<boolean>(false);

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    // Add card flip animation here later
  };

  const handleNext = () => {
    if (selectedColor) {
      navigation.navigate('CardName', {
        color: selectedColor,
        isMetal: selectedMetal
      });
    }
  };

  const ColorSwatch: React.FC<{ option: ColorOption }> = ({ option }) => {
    const isSelected = selectedColor === option.id;

    return (
      <TouchableOpacity
        onPress={() => handleColorSelect(option.id)}
        className={`mr-4 mb-4 ${isSelected ? 'scale-110' : ''}`}
        style={{ transform: [{ scale: isSelected ? 1.1 : 1 }] }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={option.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-16 h-16 rounded-full justify-center items-center"
        >
          {isSelected && (
            <View className="w-6 h-6 rounded-full bg-white items-center justify-center">
              <View className="w-4 h-4 rounded-full bg-purple-500" />
            </View>
          )}
        </LinearGradient>
        <Text className="text-center mt-2 text-sm text-gray-700">
          {option.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-2">Design your card</Text>
        <Text className="text-gray-600 mb-6">Step 1 of 3</Text>

        {/* Card Preview */}
        <View className="items-center mb-8">
          <Image
            source={require('../../assets/cards/mizan-card.png')}
            style={{
              width: normalize(300),
              height: normalize(190),
              tintColor: selectedColor ? undefined : '#CCCCCC'
            }}
            resizeMode="contain"
          />
        </View>

        {/* Color Selection */}
        <Text className="text-lg font-semibold mb-4">Choose your color</Text>
        <View className="flex-row flex-wrap">
          {colorOptions.map((option) => (
            <ColorSwatch key={option.id} option={option} />
          ))}
        </View>

        {/* Metal Option */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={() => setSelectedMetal(!selectedMetal)}
            className={`p-4 rounded-xl border ${
              selectedMetal ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold">Metal Card</Text>
                <Text className="text-gray-600">Premium feel, lasting impression</Text>
              </View>
              <Text className="text-purple-600 font-semibold">+$9.99</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={handleNext}
            disabled={!selectedColor}
            className="w-full"
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className={`h-14 rounded-full justify-center items-center ${
                !selectedColor ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                Next: name your card
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CardStudioScreen;
