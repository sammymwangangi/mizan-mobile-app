import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps {
  colors: string[];
  style?: any;
  children: React.ReactNode;
}

const GradientText: React.FC<GradientTextProps> = ({ colors, style, children }) => {
  return (
    <View style={{ marginVertical: 2 }}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.text, style]}>{children}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default GradientText;
