import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, Dimensions, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import IslamicCornerScreen from '../screens/IslamicCornerScreen';
import SupportScreen from '../screens/SupportScreen';
import { FONTS } from 'constants/theme';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_COUNT = 5;
const TAB_HEIGHT = 80;
const NOTCH_WIDTH = 70;
const NOTCH_HEIGHT = 40;
const CIRCLE_SIZE = 62;

const AnimatedPath = Animated.createAnimatedComponent(Path);

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabWidth = SCREEN_WIDTH / TAB_COUNT;

  // position for notch & circle
  const offset = useSharedValue(state.index * tabWidth + tabWidth / 2 - NOTCH_WIDTH / 2);

  useEffect(() => {
    offset.value = withTiming(state.index * tabWidth + tabWidth / 2 - NOTCH_WIDTH / 2, { duration: 250 });
  }, [state.index, tabWidth, offset]);

  // animated path d
  const animatedProps = useAnimatedProps(() => ({
    d: getPath(offset.value)
  }));

  // animated circle container
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value + (NOTCH_WIDTH - CIRCLE_SIZE) / 2 }]
  }));

  // Define active icon based on current route
  const activeIcon = getIcon(state.routes[state.index].name, true);

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <Svg
        width={SCREEN_WIDTH}
        height={TAB_HEIGHT + NOTCH_HEIGHT + insets.bottom}
        style={styles.svg}
      >
        <AnimatedPath animatedProps={animatedProps} fill="#ECF1F6" />
      </Svg>

      <Animated.View style={[styles.circleContainer, circleStyle]}>
        <LinearGradient
          colors={[
            '#D155FF',
            '#B532F2',
            '#A016E8',
            '#9406E2',
            '#8F00E0',
            '#A08CFF'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circle}
        >
          <Image source={activeIcon} style={styles.activeIcon} />
        </LinearGradient>
      </Animated.View>

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };
          const icon = getIcon(route.name, isFocused);

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              {isFocused ? null : (
                <Image source={icon} style={styles.icon} />
              )}
              {isFocused && (
                  <Text style={[styles.tabLabel, isFocused ? styles.activeLabel : {}]}>
                    {route.name}
                  </Text>
                )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// draw path string
function getPath(xOffset: any) {
  'worklet';
  const left = xOffset;
  const right = xOffset + NOTCH_WIDTH;
  const curveHeight = NOTCH_HEIGHT;
  return `M0,0 L${left - 20},0 C${left - 5},0 ${left},${curveHeight} ${left + NOTCH_WIDTH / 2},${curveHeight} C${right},${curveHeight} ${right + 5},0 ${right + 20},0 L${SCREEN_WIDTH},0 L${SCREEN_WIDTH},${TAB_HEIGHT + curveHeight} L0,${TAB_HEIGHT + curveHeight} Z`;
}

// icon selector
function getIcon(name: string, focused: boolean): number | any {
  switch (name) {
    case 'Home': return require('../assets/home/tabs/home-icon.png');
    case 'Transactions': return require('../assets/home/tabs/transactions.png');
    case 'Reports': return require('../assets/home/tabs/reports.png');
    case 'IslamicCorner': return require('../assets/home/tabs/islamic-corner.png');
    case 'Support': default: return require('../assets/home/tabs/support.png');
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: 'transparent',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  row: {
    flexDirection: 'row',
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  circleContainer: {
    position: 'absolute',
    top: -CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    elevation: 5,
    zIndex: 10,
  },
  circle: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECF1F6' },
  activeIcon: { width: 24, height: 24, tintColor: '#fff' },
  tabButton: { flex: 1, height: TAB_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 24, height: 24, tintColor: '#A4A5C3' },
  tabLabel: {
    ...FONTS.medium(10),
    marginTop: 20,
    color: '#A4A5C3',
  },
  activeLabel: {
    color: '#A4A5C3', // Keep the label color consistent, or adjust if needed
  },
});

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Reports" component={SubscriptionScreen} />
      <Tab.Screen name="IslamicCorner" component={IslamicCornerScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />

    </Tab.Navigator>
  );
}
