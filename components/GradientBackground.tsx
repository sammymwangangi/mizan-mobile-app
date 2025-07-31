import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface GradientBackgroundProps {
  children?: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors = [COLORS.gradientStart, COLORS.gradientEnd],
  style,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
}) => {
  return (
    <LinearGradient
      colors={colors as any}
      style={[styles.gradient, style]}
      start={start}
      end={end}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
