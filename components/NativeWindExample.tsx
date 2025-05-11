import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NativeWindExampleProps {
  title: string;
  onPress: () => void;
}

const NativeWindExample: React.FC<NativeWindExampleProps> = ({ title, onPress }) => {
  return (
    <View className="p-4 bg-white rounded-lg shadow-md m-4">
      <Text className="text-lg font-bold text-primary mb-2">{title}</Text>
      <Text className="text-gray-600 mb-4">
        This is an example component using NativeWind for styling
      </Text>
      <TouchableOpacity 
        className="bg-primary py-3 px-4 rounded-md active:opacity-80" 
        onPress={onPress}
      >
        <Text className="text-white font-semibold text-center">Press Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NativeWindExample;
