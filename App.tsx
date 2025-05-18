
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
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

// Import test component
import './global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
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
    </Stack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Poppins': Poppins_400Regular,
          'Poppins_500Medium': Poppins_500Medium,
          'Poppins_600SemiBold': Poppins_600SemiBold,
          'Poppins_700Bold': Poppins_700Bold,
          'Poppins_900Black': Poppins_900Black,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider style={styles.container}>
        <Toaster />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
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
