import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { CTA_GRADIENT, ANALYTICS_EVENTS } from '../../../constants/shams';

type ShamsAddressNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ShamsAddress'>;
type ShamsAddressRouteProp = RouteProp<RootStackParamList, 'ShamsAddress'>;

interface AddressForm {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const ShamsAddressScreen: React.FC = () => {
  const navigation = useNavigation<ShamsAddressNavigationProp>();
  const route = useRoute<ShamsAddressRouteProp>();
  const { selectedMetal } = route.params;

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
    const required = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country'];
    const valid = required.every(field => formData[field as keyof AddressForm].trim() !== '');
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
      Alert.alert('Incomplete Form', 'Please fill in all required fields');
      return;
    }
    
    Haptics.selectionAsync();
    navigation.navigate('ShamsReview', { 
      selectedMetal, 
      deliveryAddress: address 
    });
  };

  // Mock Google Places integration
  const handleAddressSearch = () => {
    // In real implementation, integrate with Google Places API
    Alert.alert('Address Search', 'Google Places integration would be implemented here');
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
        <Text className="text-white/60 text-sm">Delivery</Text>
        <View className="w-10" />
      </View>

      {/* Progress Indicator */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2" />
          <View className="w-2 h-2 rounded-full bg-[#D4AF37] mr-2" />
          <View className="w-2 h-2 rounded-full bg-white/30" />
        </View>
        
        {/* Progress Bar */}
        <View className="w-full h-1 bg-white/20 rounded-full mt-4">
          <View className="w-2/3 h-full bg-[#D4AF37] rounded-full" />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5">
        <Text className="text-white text-2xl font-bold mb-2">
          Your Card, Your Way
        </Text>
        <Text className="text-white/70 text-base mb-8">
          Tell us where you live so we can deliver your card
        </Text>

        {/* Address Search */}
        <TouchableOpacity
          onPress={handleAddressSearch}
          className="bg-white/10 rounded-xl p-4 mb-6 flex-row items-center"
        >
          <Text className="text-white/70 flex-1">Search for your address...</Text>
          <Text className="text-white/50">🔍</Text>
        </TouchableOpacity>

        {/* Manual Address Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-white/70 text-sm mb-2">Full Name *</Text>
            <TextInput
              value={address.fullName}
              onChangeText={(text) => updateAddress('fullName', text)}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              className="bg-white/10 rounded-xl p-4 text-white"
            />
          </View>

          <View>
            <Text className="text-white/70 text-sm mb-2">Address Line 1 *</Text>
            <TextInput
              value={address.addressLine1}
              onChangeText={(text) => updateAddress('addressLine1', text)}
              placeholder="Street address"
              placeholderTextColor="#666"
              className="bg-white/10 rounded-xl p-4 text-white"
            />
          </View>

          <View>
            <Text className="text-white/70 text-sm mb-2">Address Line 2</Text>
            <TextInput
              value={address.addressLine2}
              onChangeText={(text) => updateAddress('addressLine2', text)}
              placeholder="Apartment, suite, etc. (optional)"
              placeholderTextColor="#666"
              className="bg-white/10 rounded-xl p-4 text-white"
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white/70 text-sm mb-2">City *</Text>
              <TextInput
                value={address.city}
                onChangeText={(text) => updateAddress('city', text)}
                placeholder="City"
                placeholderTextColor="#666"
                className="bg-white/10 rounded-xl p-4 text-white"
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-white/70 text-sm mb-2">State *</Text>
              <TextInput
                value={address.state}
                onChangeText={(text) => updateAddress('state', text)}
                placeholder="State"
                placeholderTextColor="#666"
                className="bg-white/10 rounded-xl p-4 text-white"
              />
            </View>
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white/70 text-sm mb-2">Postal Code *</Text>
              <TextInput
                value={address.postalCode}
                onChangeText={(text) => updateAddress('postalCode', text)}
                placeholder="Postal code"
                placeholderTextColor="#666"
                className="bg-white/10 rounded-xl p-4 text-white"
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-white/70 text-sm mb-2">Country *</Text>
              <TextInput
                value={address.country}
                onChangeText={(text) => updateAddress('country', text)}
                placeholder="Country"
                placeholderTextColor="#666"
                className="bg-white/10 rounded-xl p-4 text-white"
              />
            </View>
          </View>
        </View>
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
            colors={isValid ? CTA_GRADIENT.colors : ['#666', '#666']}
            start={CTA_GRADIENT.start}
            end={CTA_GRADIENT.end}
            className={`h-14 rounded-full justify-center items-center ${
              !isValid ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Hand-Deliver it
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShamsAddressScreen;
