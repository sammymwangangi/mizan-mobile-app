import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import type { CardScreenNavigationProp } from '../../navigation/CardNavigationTypes';

const CardMintingScreen: React.FC = () => {
  const navigation = useNavigation<CardScreenNavigationProp>();
  // const route = useRoute<CardMintingRouteProp>();
  // const { cardDetails } = route.params; // TODO: Use cardDetails for display
  
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const rotationValue = useRef(new Animated.Value(0)).current;

  // Start rotating animation
  useEffect(() => {
    const rotate = () => {
      rotationValue.setValue(0);
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => rotate());
    };

    rotate();
  }, [rotationValue]);

  // Simulate minting progress
  useEffect(() => {
    const simulateProgress = () => {
      if (progress < 100) {
        const increment = Math.random() * 15 + 5; // Random increment between 5-20
        const newProgress = Math.min(progress + increment, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
          setTimeout(simulateProgress, 1000);
        } else {
          // Minting complete
          setTimeout(() => {
            navigation.navigate('FundCard', {
              cardId: 'new-card-id' // Replace with actual card ID
            });
          }, 1000);
        }
      }
    };

    simulateProgress();
  }, [progress, navigation]);

  const spin = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleCancel = () => {
    // Show cancel confirmation bottom sheet
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setProgress(Math.max(0, progress - 20)); // Go back 20% and retry
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-5">
      {/* Close button */}
      <TouchableOpacity
        onPress={handleCancel}
        className="absolute top-12 right-5 z-10"
      >
        <X size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Progress Circle */}
      <View className="items-center">
        <View className="w-32 h-32 items-center justify-center">
          <Animated.View
            style={[
              {
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: '#E5E7EB',
                borderTopColor: '#A016E8',
                transform: [{ rotate: spin }]
              }
            ]}
          />
          <Text className="absolute text-2xl font-bold">
            {Math.round(progress)}%
          </Text>
        </View>
        
        <Text className="text-xl font-semibold mt-6 text-center">
          Processing card
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          Sabr in shaa Allah,{'\n'}almost done.
        </Text>
      </View>

      {/* Retry button (shows when needed) */}
      {progress < 100 && retryCount < 3 && (
        <TouchableOpacity
          onPress={handleRetry}
          className="mt-8 px-6 py-3 rounded-full bg-gray-100"
        >
          <Text className="text-gray-700">Retry</Text>
        </TouchableOpacity>
      )}

      {/* TODO: Add cancel confirmation modal when @gorhom/bottom-sheet is installed */}
    </View>
  );
};

export default CardMintingScreen;
