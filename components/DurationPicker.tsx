import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import WheelPicker, { WheelPickerProps } from 'react-native-wheel-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, withTiming, runOnJS, Animated } from 'react-native-reanimated';

interface DurationPickerProps {
  initialYears?: number;
  initialMonths?: number;
  maxYears?: number;
  maxMonths?: number;
  onValueChange?: (years: number, months: number) => void;
}

// Item height for each picker item
const ITEM_HEIGHT = 50;
// Number of visible items (should be odd to have center item)
const VISIBLE_ITEMS = 5;
// Total height of the picker
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const DurationPicker: React.FC<DurationPickerProps> = ({
  initialYears = 3,
  initialMonths = 6,
  maxYears = 6,
  maxMonths = 11,
  onValueChange,
}) => {
  // Ensure the initial values are within bounds
  const validInitialYears = Math.min(Math.max(initialYears, 0), maxYears);
  const validInitialMonths = Math.min(Math.max(initialMonths, 0), maxMonths);

  // Current selected values
  const [selectedYears, setSelectedYears] = useState(validInitialYears);
  const [selectedMonths, setSelectedMonths] = useState(validInitialMonths);

  const updateSelectedYears = (scrollY: number) => {
    const index = Math.round(scrollY / ITEM_HEIGHT);
    setSelectedYears(index);
  };

  const updateSelectedMonths = (scrollY: number) => {
    const index = Math.round(scrollY / ITEM_HEIGHT);
    setSelectedMonths(index);
  };

  const yearsScrollViewRef = useRef<WheelPicker>(null);
  const monthsScrollViewRef = useRef<WheelPicker>(null);

  // Scroll position values
  const yearsScrollY = useSharedValue(0);
  const monthsScrollY = useSharedValue(0);

  // Scroll to initial positions on mount
  useEffect(() => {
    setSelectedYears(validInitialYears);
    setSelectedMonths(validInitialMonths);
  }, [validInitialYears, validInitialMonths]);

  // Update the values when they change
  useEffect(() => {
    onValueChange?.(selectedYears, selectedMonths);
  }, [selectedYears, selectedMonths, onValueChange]);

  // Generate arrays for years and months
  const years = Array.from({ length: maxYears + 1 }, (_, i) => i);
  const months = Array.from({ length: maxMonths + 1 }, (_, i) => i);

  const yearsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      yearsScrollY.value = event.contentOffset.y;
      runOnJS(updateSelectedYears)(yearsScrollY.value);
    },
  });

  const monthsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      monthsScrollY.value = event.contentOffset.y;
      runOnJS(updateSelectedMonths)(monthsScrollY.value);
    },
  });

  // Render year items with animated opacity
  const renderYearItems = () => {
    return years.map((year, index) => {
      const inputRange = [
        (index - 2) * ITEM_HEIGHT,
        (index - 1) * ITEM_HEIGHT,
        index * ITEM_HEIGHT,
        (index + 1) * ITEM_HEIGHT,
        (index + 2) * ITEM_HEIGHT,
      ];

      const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
          yearsScrollY.value,
          inputRange,
          [0.3, 0.5, 1, 0.5, 0.3],
          'clamp'
        );

        const scale = interpolate(
          yearsScrollY.value,
          inputRange,
          [0.8, 0.9, 1, 0.9, 0.8],
          'clamp'
        );

        return {
          opacity: withTiming(opacity, { duration: 100 }),
          transform: [{ scale: withTiming(scale, { duration: 100 }) }],
        };
      });

      return (
        <Animated.View key={`year-${year}`} style={[styles.itemContainer, animatedStyle]}>
          <Pressable 
            onPress={() => {
              setSelectedYears(year);
              onValueChange?.(year, selectedMonths);
            }}
            style={styles.itemPressable}
          >
            <Text style={styles.itemText}>{year}</Text>
          </Pressable>
        </Animated.View>
      );
    });
  };

  // Render month items with animated opacity
  const renderMonthItems = () => {
    return months.map((month, index) => {
      const inputRange = [
        (index - 2) * ITEM_HEIGHT,
        (index - 1) * ITEM_HEIGHT,
        index * ITEM_HEIGHT,
        (index + 1) * ITEM_HEIGHT,
        (index + 2) * ITEM_HEIGHT,
      ];

      const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
          monthsScrollY.value,
          inputRange,
          [0.3, 0.5, 1, 0.5, 0.3],
          'clamp'
        );

        const scale = interpolate(
          monthsScrollY.value,
          inputRange,
          [0.8, 0.9, 1, 0.9, 0.8],
          'clamp'
        );

        return {
          opacity: withTiming(opacity, { duration: 100 }),
          transform: [{ scale: withTiming(scale, { duration: 100 }) }],
        };
      });

      return (
        <Animated.View key={`month-${month}`} style={[styles.itemContainer, animatedStyle]}>
          <Pressable 
            onPress={() => {
              setSelectedMonths(month);
              onValueChange?.(selectedYears, month);
            }}
            style={styles.itemPressable}
          >
            <Text style={styles.itemText}>{month}</Text>
          </Pressable>
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {/* Years Picker */}
        <View style={styles.pickerColumn}>
          <Animated.ScrollView
            ref={yearsScrollViewRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={yearsScrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollViewContent}
          >
            {renderYearItems()}
          </Animated.ScrollView>
        </View>

        {/* Months Picker */}
        <View style={styles.pickerColumn}>
          <Animated.ScrollView
            ref={monthsScrollViewRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={monthsScrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollViewContent}
          >
            {renderMonthItems()}
          </Animated.ScrollView>
        </View>
      </View>

      {/* Highlight Overlay */}
      <LinearGradient
        colors={['#5592EF', '#8532E0', '#F053E0']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.highlightBorder}
      >
        <View style={styles.highlightInner}>
          <View style={styles.highlightContent}>
            <Text style={styles.highlightValue}>{selectedYears}</Text>
            <Text style={styles.highlightLabel}>years</Text>
          </View>
          <View style={styles.highlightContent}>
            <Text style={styles.highlightValue}>{selectedMonths}</Text>
            <Text style={styles.highlightLabel}>months</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Picker Overlays for fading effect */}
      <View style={[styles.overlay, styles.topOverlay]} />
      <View style={[styles.overlay, styles.bottomOverlay]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 370,
    width: '100%',
    position: 'relative',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 370,
    width: '100%',
  },
  picker: {
    flex: 1,
    height: '100%',
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
  },
  scrollViewContent: {
    paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  highlightBorder: {
    position: 'absolute',
    top: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: 25,
    padding: 2, // Border width
    zIndex: 2,
  },
  highlightInner: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 23,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  highlightContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightValue: {
    ...FONTS.h2,
    color: COLORS.text,
    marginRight: 5,
  },
  highlightLabel: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
    zIndex: 1,
  },
  topOverlay: {
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default DurationPicker;
