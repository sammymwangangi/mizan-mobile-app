import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

interface DurationPickerProps {
  initialYears?: number;
  initialMonths?: number;
  maxYears?: number;
  maxMonths?: number;
  onValueChange?: (years: number, months: number) => void;
}

// Item height for each picker item
const ITEM_HEIGHT = 60;
// Number of visible items (should be odd to have center item)
const VISIBLE_ITEMS = 5;
// Total height of the picker
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
// Container height
const CONTAINER_HEIGHT = 371;

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

  // Use refs to track values without causing re-renders during scrolling
  const selectedYearsRef = useRef(validInitialYears);
  const selectedMonthsRef = useRef(validInitialMonths);

  // Use state to trigger re-renders for display
  const [displayYears, setDisplayYears] = useState(validInitialYears);
  const [displayMonths, setDisplayMonths] = useState(validInitialMonths);

  // Generate arrays for years and months
  const yearsArray = Array.from({ length: maxYears + 1 }, (_, i) => i);
  const monthsArray = Array.from({ length: maxMonths + 1 }, (_, i) => i);

  // Refs for scroll views
  const yearsScrollViewRef = useRef<Animated.ScrollView>(null);
  const monthsScrollViewRef = useRef<Animated.ScrollView>(null);

  // Scroll position values
  const yearsScrollY = useSharedValue(0);
  const monthsScrollY = useSharedValue(0);

  // Update selected values based on scroll position
  const updateSelectedYears = (scrollY: number) => {
    const index = Math.round(scrollY / ITEM_HEIGHT);
    if (index >= 0 && index <= maxYears && index !== selectedYearsRef.current) {
      selectedYearsRef.current = index;
      setDisplayYears(index); // Update state to trigger re-render
      onValueChange?.(index, selectedMonthsRef.current);
    }
  };

  const updateSelectedMonths = (scrollY: number) => {
    const index = Math.round(scrollY / ITEM_HEIGHT);
    if (index >= 0 && index <= maxMonths && index !== selectedMonthsRef.current) {
      selectedMonthsRef.current = index;
      setDisplayMonths(index); // Update state to trigger re-render
      onValueChange?.(selectedYearsRef.current, index);
    }
  };

  // Scroll handlers with both scroll and momentum end events
  const yearsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      yearsScrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      runOnJS(updateSelectedYears)(event.contentOffset.y);
    },
    onEndDrag: (event) => {
      // Snap to the nearest item when dragging ends
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      const targetY = index * ITEM_HEIGHT;

      if (yearsScrollViewRef.current) {
        runOnJS(updateSelectedYears)(targetY);
      }
    },
  });

  const monthsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      monthsScrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      runOnJS(updateSelectedMonths)(event.contentOffset.y);
    },
    onEndDrag: (event) => {
      // Snap to the nearest item when dragging ends
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      const targetY = index * ITEM_HEIGHT;

      if (monthsScrollViewRef.current) {
        runOnJS(updateSelectedMonths)(targetY);
      }
    },
  });

  // Scroll to initial positions on mount - only run once
  useEffect(() => {
    // Store the values in local variables to avoid dependency warnings
    const initialYearsPos = validInitialYears * ITEM_HEIGHT;
    const initialMonthsPos = validInitialMonths * ITEM_HEIGHT;

    const timer = setTimeout(() => {
      yearsScrollViewRef.current?.scrollTo({
        y: initialYearsPos,
        animated: false
      });
      monthsScrollViewRef.current?.scrollTo({
        y: initialMonthsPos,
        animated: false
      });
    }, 100);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Year item component with animated style
  const YearItem = React.memo(({ year }: { year: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (year - 2) * ITEM_HEIGHT,
        (year - 1) * ITEM_HEIGHT,
        year * ITEM_HEIGHT,
        (year + 1) * ITEM_HEIGHT,
        (year + 2) * ITEM_HEIGHT,
      ];

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

    // Handle year selection
    const handleYearPress = () => {
      if (year !== selectedYearsRef.current) {
        selectedYearsRef.current = year;
        setDisplayYears(year); // Update state to trigger re-render
        yearsScrollViewRef.current?.scrollTo({ y: year * ITEM_HEIGHT, animated: true });
        onValueChange?.(year, selectedMonthsRef.current);
      }
    };

    return (
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.itemPressable}
          onPress={handleYearPress}
        >
          <Text style={styles.itemText}>{year}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  // Month item component with animated style
  const MonthItem = React.memo(({ month }: { month: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (month - 2) * ITEM_HEIGHT,
        (month - 1) * ITEM_HEIGHT,
        month * ITEM_HEIGHT,
        (month + 1) * ITEM_HEIGHT,
        (month + 2) * ITEM_HEIGHT,
      ];

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

    // Handle month selection
    const handleMonthPress = () => {
      if (month !== selectedMonthsRef.current) {
        selectedMonthsRef.current = month;
        setDisplayMonths(month); // Update state to trigger re-render
        monthsScrollViewRef.current?.scrollTo({ y: month * ITEM_HEIGHT, animated: true });
        onValueChange?.(selectedYearsRef.current, month);
      }
    };

    return (
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.itemPressable}
          onPress={handleMonthPress}
        >
          <Text style={styles.itemText}>{month}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  });

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
            bounces={true}
            alwaysBounceVertical={true}
            pagingEnabled={false}
          >
            {yearsArray.map((year) => (
              <YearItem key={`year-${year}`} year={year} />
            ))}
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
            bounces={true}
            alwaysBounceVertical={true}
            pagingEnabled={false}
          >
            {monthsArray.map((month) => (
              <MonthItem key={`month-${month}`} month={month} />
            ))}
          </Animated.ScrollView>
        </View>
      </View>

      {/* Highlight Overlay */}
      <LinearGradient
        colors={['#5592EF', '#8532E0', '#F053E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.highlightBorder}
      >
        <View style={styles.highlightInner}>
          <View style={styles.highlightContent}>
            <Text style={styles.highlightValue}>{displayYears}</Text>
            <Text style={styles.highlightLabel}>years</Text>
          </View>
          <View style={styles.highlightContent}>
            <Text style={styles.highlightValue}>{displayMonths}</Text>
            <Text style={styles.highlightLabel}>months</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: CONTAINER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
    overflow: 'visible', // Allow scrolling outside the column
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
    fontSize: 24,
  },
  highlightBorder: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    borderRadius: 25,
    padding: 1.5, // Border width
    zIndex: 2,
    transform: [{ translateY: -ITEM_HEIGHT / 2 }],
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
    fontSize: 24,
  },
  highlightLabel: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
});

export default DurationPicker;
