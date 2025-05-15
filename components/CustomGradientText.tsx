import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore - Ignore the missing type declaration file
import MaskedView from '@react-native-masked-view/masked-view';

interface CustomGradientTextProps {
  text: string;
  colors: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: any;
  textStyle?: any;
}

const CustomGradientText: React.FC<CustomGradientTextProps> = ({
  text,
  colors,
  locations,
  start = { x: 0, y: 1 },
  end = { x: 1, y: 0 },
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.text, textStyle]}>
              {text}
            </Text>
          </View>
        }
      >
        <LinearGradient
          // @ts-ignore - Type error with colors array
          colors={colors || ['#80B2FF', '#7C27D9', '#FF68F0']}
          // @ts-ignore - Type error with locations array
          locations={locations}
          start={start}
          end={end}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskedView: {
    height: 60, 
    minWidth: 300,
  },
  text: {
    fontSize: 32,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: 'black', // This won't be visible but helps with the mask
  },
  gradient: {
    flex: 1,
  },
});

export default CustomGradientText;
