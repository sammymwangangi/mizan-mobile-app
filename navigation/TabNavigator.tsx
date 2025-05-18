import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
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

// Custom tab bar component with wavy shape
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 81;

  return (
    <View style={[styles.tabBarContainer, { height: tabBarHeight + insets.bottom }]}>
      {/* Main background with notch */}
      <View style={styles.tabBarBackground} />

      {/* White circle for the active tab notch */}
      <View
        style={[styles.tabNotch, {
          left: state.index * (390 / 5) + (390 / 10) - 40,
        }]}
      />

      {/* Shadow for the notch */}
      <View
        style={[styles.notchShadow, {
          left: state.index * (390 / 5) + (390 / 10) - 30,
        }]}
      />


      {/* Active Tab Indicator - positioned absolutely */}
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
            <View
              key={`active-${index}`}
              style={[styles.activeTabContainer, {
                left: index * (390 / 5) + (390 / 10) - 35,
              }]}
            >
              <LinearGradient
                colors={['#8336E6', '#69DBFF']}
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
              <Text style={styles.tabLabel}>
                {route.name}
              </Text>
            </View>
          );
        }
        return null;
      })}

      {/* Tab buttons */}
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
              {!isFocused && (
                <View>
                  <Image
                    source={iconSource}
                    style={[styles.tabIcon, styles.inactiveIcon]}
                    resizeMode="contain"
                  />
                </View>
              )}
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 81,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#8C5FED',
  },
  curveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 81,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  tabNotch: {
    position: 'absolute',
    top: -35,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F8',
    zIndex: 0,
  },
  notchShadow: {
    position: 'absolute',
    top: -26,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: -1,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    height: 81,
    position: 'relative',
    zIndex: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 390 / 5,
  },
  activeTabContainer: {
    position: 'absolute',
    top: -35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  activeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#8336E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  activeIcon: {
    tintColor: '#FFFFFF',
  },
  inactiveIcon: {
    tintColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 50,
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
});

export default TabNavigator;
