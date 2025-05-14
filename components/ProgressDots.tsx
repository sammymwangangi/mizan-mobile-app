import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressDotsProps {
  count: number;
  activeIndex: number;
  style?: ViewStyle;
  dotStyle?: ViewStyle;
  activeDotStyle?: ViewStyle;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({
  count,
  activeIndex,
  style,
  dotStyle,
  activeDotStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, index) => (
        index === activeIndex ? (
          <LinearGradient
            key={index}
            colors={['#D155FF', '#A276FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.dot,
              styles.activeDot,
              dotStyle,
              activeDotStyle,
            ]}
          />
        ) : (
          <View
            key={index}
            style={[
              styles.dot,
              dotStyle,
            ]}
          />
        )
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.padding,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ProgressDots;
