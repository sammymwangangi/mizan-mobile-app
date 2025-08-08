import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { BARAKAH_PURPLE, VALIDATION, QAMAR_ANALYTICS } from '../../../constants/qamar';

type QamarAddressNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QamarAddress'>;
type QamarAddressRouteProp = RouteProp<RootStackParamList, 'QamarAddress'>;

interface AddressForm {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const QamarAddressScreen: React.FC = () => {
  const navigation = useNavigation<QamarAddressNavigationProp>();
  const route = useRoute<QamarAddressRouteProp>();
  const { planId, selectedColor } = route.params;

  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Kenya'
  });

  const [isValid, setIsValid] = useState(false);

  const validateForm = (formData: AddressForm) => {
    const hasRequiredFields = VALIDATION.REQUIRED_FIELDS.every(
      field => formData[field as keyof AddressForm].trim() !== ''
    );
    const hasMinLength = formData.addressLine1.length >= VALIDATION.MIN_ADDRESS_LENGTH;
    const valid = hasRequiredFields && hasMinLength;
    setIsValid(valid);
    return valid;
  };

  const updateAddress = (field: keyof AddressForm, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    validateForm(newAddress);
  };

  const handleNext = () => {
    if (!isValid) {
      Alert.alert('Incomplete Address', 'Please fill in all required fields');
      return;
    }
    
    Haptics.selectionAsync();
    // Track analytics
    // PostHog.capture(QAMAR_ANALYTICS.CARD_STEP_VIEW, { step: 'address', plan: 'qamar' });
    
    navigation.navigate('QamarReview', { 
      planId, 
      selectedColor, 
      deliveryAddress: address 
    });
  };

  const handleGooglePlaces = () => {
    // Google Places autocomplete (KE + GCC)
    Alert.alert('Address Search', 'Google Places integration would be implemented here for Kenya and GCC countries');
  };

  const handleSubmitEditing = () => {
    if (isValid) {
      handleNext();
    }
  };

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
        <Text className="text-gray-500 text-sm">Step 2 of 3</Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-purple-600 mr-2" />
          <View className="w-2 h-2 rounded-full bg-purple-600 mr-2" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Shipping address
        </Text>
        <Text className="text-gray-600 text-base mb-8">
          Where should we send your Qamar card?
        </Text>

        {/* Google Places Search */}
        <TouchableOpacity
          onPress={handleGooglePlaces}
          className="bg-gray-50 rounded-xl p-4 mb-6 flex-row items-center"
        >
          <Text className="text-gray-500 flex-1">
            Search for your address...
          </Text>
          <Text className="text-gray-400">🔍</Text>
        </TouchableOpacity>

        {/* Manual Address Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 text-sm mb-2 font-medium">
              Full Name *
            </Text>
            <TextInput
              value={address.fullName}
              onChangeText={(text) => updateAddress('fullName', text)}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 rounded-xl p-4 text-gray-900"
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-gray-700 text-sm mb-2 font-medium">
              Address Line 1 *
            </Text>
            <TextInput
              value={address.addressLine1}
              onChangeText={(text) => updateAddress('addressLine1', text)}
              placeholder="Street address, building name"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 rounded-xl p-4 text-gray-900"
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-gray-700 text-sm mb-2 font-medium">
              Address Line 2
            </Text>
            <TextInput
              value={address.addressLine2}
              onChangeText={(text) => updateAddress('addressLine2', text)}
              placeholder="Apartment, suite, floor (optional)"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 rounded-xl p-4 text-gray-900"
              autoCapitalize="words"
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-gray-700 text-sm mb-2 font-medium">
                City *
              </Text>
              <TextInput
                value={address.city}
                onChangeText={(text) => updateAddress('city', text)}
                placeholder="City"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 rounded-xl p-4 text-gray-900"
                autoCapitalize="words"
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-700 text-sm mb-2 font-medium">
                State/Region *
              </Text>
              <TextInput
                value={address.state}
                onChangeText={(text) => updateAddress('state', text)}
                placeholder="State"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 rounded-xl p-4 text-gray-900"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-gray-700 text-sm mb-2 font-medium">
                Postal Code *
              </Text>
              <TextInput
                value={address.postalCode}
                onChangeText={(text) => updateAddress('postalCode', text)}
                placeholder="Postal code"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 rounded-xl p-4 text-gray-900"
                keyboardType="default"
                returnKeyType="done"
                onSubmitEditing={handleSubmitEditing}
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-700 text-sm mb-2 font-medium">
                Country *
              </Text>
              <TextInput
                value={address.country}
                onChangeText={(text) => updateAddress('country', text)}
                placeholder="Country"
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 rounded-xl p-4 text-gray-900"
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* CTA Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.9}
          className="w-full"
        >
          <LinearGradient
            colors={isValid ? [BARAKAH_PURPLE, '#9F7AFF'] : ['#D1D5DB', '#D1D5DB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`h-14 rounded-full justify-center items-center ${
              !isValid ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Review & mint
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QamarAddressScreen;
