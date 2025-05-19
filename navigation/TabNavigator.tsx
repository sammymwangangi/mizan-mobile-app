import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, useAnimatedProps } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import IslamicCornerScreen from '../screens/IslamicCornerScreen';

// Import tab navigation types
import { TabParamList } from './types';

// Placeholder screen for Support tab
const SupportScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Support Screen</Text></View>;

const Tab = createBottomTabNavigator<TabParamList>();

// Define AnimatedPath
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Custom tab bar component with wavy shape
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 81;
  const screenWidth = Dimensions.get('window').width; // Get the screen width dynamically
  const tabWidth = screenWidth / 5; // Width of each tab
  const notchWidth = 80; // Width of the notch area
  const notchHeight = 40; // Height of the curve above the tab bar
  const gradientCircleSize = 70; // Size of the gradient circle

  // Animated value for the notch position
  const notchPosition = useSharedValue(state.index * tabWidth + tabWidth / 2 - notchWidth / 2);

  // Animate the notch position when the active tab changes
  React.useEffect(() => {
    notchPosition.value = withTiming(state.index * tabWidth + tabWidth / 2 - notchWidth / 2, { duration: 300 });
  }, [state.index, notchPosition, tabWidth]);

  // Animated style for the gradient circle position
  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: notchPosition.value + notchWidth / 2 - gradientCircleSize / 2 }],
    };
  });

  // SVG path for the curved tab bar background
  const getTabBarPath = (notchX: number) => {
    'worklet';
    const startX = notchX;
    const endX = notchX + notchWidth;
    const controlPointOffset = notchWidth / 4; // Controls the smoothness of the curve

    return `
      M 0 0
      L ${startX - controlPointOffset} 0
      Q ${startX} 0 ${startX} ${notchHeight}
      Q ${startX + controlPointOffset} ${notchHeight * 2} ${startX + notchWidth / 2} ${notchHeight * 2}
      Q ${endX - controlPointOffset} ${notchHeight * 2} ${endX} ${notchHeight}
      Q ${endX} 0 ${endX + controlPointOffset} 0
      L ${screenWidth} 0
      L ${screenWidth} ${tabBarHeight + insets.bottom}
      L 0 ${tabBarHeight + insets.bottom}
      Z
    `;
  };

  // Animated props for the SVG Path
  const animatedPathProps = useAnimatedProps(() => {
    return {
      d: getTabBarPath(notchPosition.value),
    };
  });

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      {/* SVG background with animated curve */}
      <Svg width={screenWidth} height={tabBarHeight + notchHeight + insets.bottom} style={styles.svgContainer}>
        <AnimatedPath
          animatedProps={animatedPathProps}
          fill="#ECF1F6"
        />
      </Svg>

      {/* Active Tab Indicator - Gradient Circle */}
      <Animated.View style={[styles.activeTabContainer, animatedGradientStyle]}>
        {state.routes.map((route, index: number) => {
          const isFocused = state.index === index;
          if (isFocused) {
            // Define icon source based on route name
            let iconSource;
            switch (route.name) {
              case 'Home':
                iconSource = require('../assets/home/tabs/home.png');
                break;
              case 'Transactions':
                iconSource = require('../assets/home/tabs/transactions.png');
                break;
              case 'Reports':
                iconSource = require('../assets/home/tabs/reports.png');
                break;
              case 'IslamicCorner':
                iconSource = require('../assets/home/tabs/islamic-corner.png');
                break;
              case 'Support':
                iconSource = require('../assets/home/tabs/support.png');
                break;
              default:
                iconSource = require('../assets/home/tabs/home.png');
            }

            return (
              <View key={`active-${index}`} style={styles.activeIconWrapper}>
                <LinearGradient
                  colors={['#69DBFF', '#8336E6']}
                  start={{ x: 0.1, y: 0.1 }}
                  end={{ x: 0.93, y: 0.93 }}
                  style={styles.activeIconContainer}
                >
                  <Image
                    source={iconSource}
                    style={[styles.tabIcon, styles.activeIcon]}
                    resizeMode="contain"
                  />
                </LinearGradient>
              </View>
            );
          }
          return null;
        })}
      </Animated.View>

      {/* Tab buttons and labels */}
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Define icon source based on route name
          let iconSource;
          switch (route.name) {
            case 'Home':
              iconSource = require('../assets/home/tabs/home.png');
              break;
            case 'Transactions':
              iconSource = require('../assets/home/tabs/transactions.png');
              break;
            case 'Reports':
              iconSource = require('../assets/home/tabs/reports.png');
              break;
            case 'IslamicCorner':
              iconSource = require('../assets/home/tabs/islamic-corner.png');
              break;
            case 'Support':
              iconSource = require('../assets/home/tabs/support.png');
              break;
            default:
              iconSource = require('../assets/home/tabs/home.png');
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={styles.tabItem}>
                {!isFocused && (
                  <Image
                    source={iconSource}
                    style={[styles.tabIcon, styles.inactiveIcon]}
                    resizeMode="contain"
                  />
                )}
                {isFocused && (
                  <Text style={[styles.tabLabel, isFocused ? styles.activeLabel : {}]}>
                    {route.name}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Reports" component={SubscriptionScreen} />
      <Tab.Screen name="IslamicCorner" component={IslamicCornerScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: 'transparent',
  },
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 81,
    position: 'relative',
    zIndex: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  activeTabContainer: {
    position: 'absolute',
    top: -55,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  activeIconWrapper: {
    alignItems: 'center',
  },
  activeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  activeIcon: {
    tintColor: 'white', // Set active icon to white
  },
  inactiveIcon: {
    tintColor: '#A4A5C3',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 5,
    color: '#A4A5C3',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#A4A5C3', // Keep the label color consistent, or adjust if needed
  },
});

export default TabNavigator;