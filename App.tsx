
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store';
import { auth } from './firebaseConfig'; // Assuming firebaseConfig is in the root
import { onAuthStateChanged, User } from 'firebase/auth';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './navigation/types';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import TabNavigator from './navigation/TabNavigator';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black
} from '@expo-google-fonts/poppins';

// Import screens
import SplashScreenComponent from './screens/SplashScreen';
import IntroScreen from './screens/IntroScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import PhoneNumberScreen from './screens/PhoneNumberScreen';
import OTPScreen from './screens/OTPScreen';
import KYCScreen from './screens/KYCScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CampaignDetailsScreen from './screens/CampaignDetailsScreen';
import DonationAmountScreen from './screens/DonationAmountScreen';
import DonationConfirmationScreen from './screens/DonationConfirmationScreen';
import CardsDashboardScreen from './screens/CardsDashboardScreen';
import CardLinkingScreen from './screens/CardLinkingScreen';
import CardLinkingBackScreen from './screens/CardLinkingBackScreen';
import CardVerificationScreen from './screens/CardVerificationScreen';

// Import SendMoney screens
import SendMoneyScreen from './screens/SendMoneyScreen';
import SendMoneyConfirmationScreen from './screens/SendMoneyConfirmationScreen';
import SendMoneySuccessScreen from './screens/SendMoneySuccessScreen';

// Import M-PESA screens
import MPESAScreen from './screens/MPESAScreen';
import MPESARecipientScreen from './screens/MPESARecipientScreen';
import MPESAAmountScreen from './screens/MPESAAmountScreen';
import MPESAConfirmationScreen from './screens/MPESAConfirmationScreen';
import MPESASuccessScreen from './screens/MPESASuccessScreen';

// Import Shop screens
import ShopScreen from './screens/ShopScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentScreen from './screens/PaymentScreen';

// Import Font Demo screen
import FontDemoScreen from './screens/FontDemoScreen';

// Import Round-Ups screens
import RoundUpsScreen from './screens/RoundUpsScreen';
import RoundUpsSettingsScreen from './screens/RoundUpsSettingsScreen';
import InvestmentPortfolioScreen from './screens/InvestmentPortfolioScreen';
import RoundUpsHistoryScreen from './screens/RoundUpsHistoryScreen';
import { RoundUpsProvider } from './contexts/RoundUpsContext';

// Import test component
import './global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootStackProps {
  isCheckingAuth: boolean;
  isUserLoggedIn: boolean;
}

function RootStack({ isCheckingAuth, isUserLoggedIn }: RootStackProps) {
  if (isCheckingAuth) {
    return <SplashScreenComponent />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isUserLoggedIn ? 'Home' : 'Intro'}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* Common screens always available */}
      <Stack.Screen name="Splash" component={SplashScreenComponent} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
      <Stack.Screen name="DonationAmount" component={DonationAmountScreen} />
      <Stack.Screen name="DonationConfirmation" component={DonationConfirmationScreen} />
      <Stack.Screen name="CardsDashboard" component={CardsDashboardScreen} />
      <Stack.Screen name="CardLinking" component={CardLinkingScreen} />
      <Stack.Screen name="CardLinkingBack" component={CardLinkingBackScreen} />
      <Stack.Screen name="CardVerification" component={CardVerificationScreen} />

      {/* SendMoney Screens */}
      <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
      <Stack.Screen name="SendMoneyConfirmation" component={SendMoneyConfirmationScreen} />
      <Stack.Screen name="SendMoneySuccess" component={SendMoneySuccessScreen} />

      {/* M-PESA Screens */}
      <Stack.Screen name="MPESA" component={MPESAScreen} />
      <Stack.Screen name="MPESARecipient" component={MPESARecipientScreen} />
      <Stack.Screen name="MPESAAmount" component={MPESAAmountScreen} />
      <Stack.Screen name="MPESAConfirmation" component={MPESAConfirmationScreen} />
      <Stack.Screen name="MPESASuccess" component={MPESASuccessScreen} />

      {/* Shop Screens */}
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />

      {/* Font Demo Screen */}
      <Stack.Screen name="FontDemo" component={FontDemoScreen} />

      {/* Round-Ups Screens */}
      <Stack.Screen name="RoundUps" component={RoundUpsScreen} />
      <Stack.Screen name="RoundUpsSettings" component={RoundUpsSettingsScreen} />
      <Stack.Screen name="InvestmentPortfolio" component={InvestmentPortfolioScreen} />
      <Stack.Screen name="RoundUpsHistory" component={RoundUpsHistoryScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // Keep splash visible

        // Load fonts
        await Font.loadAsync({
          'Poppins': Poppins_400Regular,
          'Poppins_500Medium': Poppins_500Medium,
          'Poppins_600SemiBold': Poppins_600SemiBold,
          'Poppins_700Bold': Poppins_700Bold,
          'Poppins_900Black': Poppins_900Black,
        });

        // Check auth state
        const unsubscribeAuth = onAuthStateChanged(auth, async (user: User | null) => {
          try {
            if (user) {
              const token = await SecureStore.getItemAsync('userToken');
              if (token) {
                setIsUserLoggedIn(true);
                console.log('User is logged in, token found.');
              } else {
                // Inconsistent state: Firebase has user, but no token in SecureStore
                console.log('User in Firebase, but no token. Signing out.');
                await auth.signOut();
                await SecureStore.deleteItemAsync('userToken'); // Clean up
                await SecureStore.deleteItemAsync('userUID'); // Clean up
                setIsUserLoggedIn(false);
              }
            } else {
              console.log('No user in Firebase. Ensuring local state is cleared.');
              await SecureStore.deleteItemAsync('userToken'); // Clean up
              await SecureStore.deleteItemAsync('userUID'); // Clean up
              setIsUserLoggedIn(false);
            }
          } catch (e) {
            console.error("Error during auth state check:", e);
            setIsUserLoggedIn(false); // Default to not logged in on error
          } finally {
            setIsCheckingAuth(false);
          }
        });
        // This is often desired for real-time auth state changes.
        // If only initial check is needed, it should be unsubscribed.
        return () => {
          console.log("Unsubscribing auth listener");
          unsubscribeAuth();
        };
      } catch (e) {
        console.warn("Error in prepare function:", e);
        setIsCheckingAuth(false); // Ensure checking is false even if fonts fail
        setIsUserLoggedIn(false);
      } finally {
        setAppIsReady(true);
        console.log("App is ready.");
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    console.log(`onLayoutRootView called. appIsReady: ${appIsReady}, isCheckingAuth: ${isCheckingAuth}`);
    if (appIsReady && !isCheckingAuth) {
      await SplashScreen.hideAsync();
      console.log("Splash screen hidden.");
    }
  }, [appIsReady, isCheckingAuth]);

  // This effect handles navigation after auth check is complete and navigation is ready
  useEffect(() => {
    if (!isCheckingAuth && navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      console.log("Auth check complete. Current route:", currentRoute?.name, "User logged in:", isUserLoggedIn);
      if (isUserLoggedIn) {
        // Only navigate if not already on a screen within the 'Home' (TabNavigator) flow
        if (currentRoute?.name !== 'Home' && currentRoute?.name !== 'Profile' /* add other main screens */) {
           console.log("Navigating to Home");
          navigationRef.current.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
      } else {
        // Only navigate if not already on an auth flow screen
        if (currentRoute?.name !== 'Intro' && currentRoute?.name !== 'Auth' /* add other auth screens */) {
          console.log("Navigating to Intro");
          navigationRef.current.reset({ index: 0, routes: [{ name: 'Intro' }] });
        }
      }
    }
  }, [isUserLoggedIn, isCheckingAuth, appIsReady]);


  if (!appIsReady) { // Potentially show a native splash screen or null
    return null;
  }

  // When isCheckingAuth is true, RootStack will render SplashScreenComponent
  // When false, it will choose initialRouteName based on isUserLoggedIn.
  // However, the useEffect above will then try to navigate.
  // A more robust way is to not set initialRouteName dynamically if using navigationRef.reset
  // For now, the RootStack's dynamic initialRouteName will determine the first screen,
  // and the useEffect will adjust if needed (e.g. if direct linking lands on a wrong stack).

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider style={styles.container}>
        <RoundUpsProvider>
          <Toaster />
          <NavigationContainer ref={navigationRef}>
            <RootStack isCheckingAuth={isCheckingAuth} isUserLoggedIn={isUserLoggedIn} />
          </NavigationContainer>
        </RoundUpsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});
