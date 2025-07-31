import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps {
  colors: string[];
  style?: any;
  children: React.ReactNode;
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const GradientText: React.FC<GradientTextProps> = ({
  colors,
  style,
  children,
  locations,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 }
}) => {
  // For 225 degrees angle (bottom-left to top-right), we use these coordinates
  // This approximates the 225 degree angle in the linear-gradient
  const angleStart = start || { x: 0, y: 1 };
  const angleEnd = end || { x: 1, y: 0 };

  // Use a simpler approach with positioned elements
  return (
    <View style={[styles.container, { marginVertical: 2 }]}>
      <LinearGradient
        colors={colors as any}
        locations={locations as any}
        start={angleStart}
        end={angleEnd}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />
      <Text style={[styles.text, style, styles.textForeground]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  gradient: {
    borderRadius: 5,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textForeground: {
    backgroundColor: 'transparent',
    // This makes the text transparent, showing the gradient underneath
    opacity: 0.7,
  },
});

export default GradientText;
