
import { useCallback, useEffect, useState, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './navigation/types';
import { useAuth, AuthProvider } from './hooks/useAuth';
import { testSupabaseConnection, testSupabaseAuth } from './utils/testSupabase';
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

import OTPScreen from './screens/OTPScreen';
import KYCScreen from './screens/KYCScreen';

import ProfileScreen from './screens/ProfileScreen';
import CampaignDetailsScreen from './screens/CampaignDetailsScreen';
import DonationAmountScreen from './screens/DonationAmountScreen';
import DonationConfirmationScreen from './screens/DonationConfirmationScreen';
import CardsDashboardScreen from './screens/CardsDashboardScreen';
import CardLinkingScreen from './screens/CardLinkingScreen';
import CardLinkingBackScreen from './screens/CardLinkingBackScreen';
import CardVerificationScreen from './screens/CardVerificationScreen';

// Import Card Creation Flow screens
import CardClaimScreen from './screens/cards/CardClaimScreen';
import PlanSelectScreen from './screens/cards/PlanSelectScreen';
import CardStudioScreen from './screens/cards/CardStudioScreen';
import CardNameScreen from './screens/cards/CardNameScreen';
import CardReviewScreen from './screens/cards/CardReviewScreen';
import CardMintingScreen from './screens/cards/CardMintingScreen';
import FundCardScreen from './screens/cards/FundCardScreen';
import WalletAddScreen from './screens/cards/WalletAddScreen';

// Shams Flow screens
import ShamsIntroScreen from './screens/cards/shams/ShamsIntroScreen';
import ShamsStudioScreen from './screens/cards/shams/ShamsStudioScreen';
import ShamsAddressScreen from './screens/cards/shams/ShamsAddressScreen';
import ShamsReviewScreen from './screens/cards/shams/ShamsReviewScreen';

// Qamar Flow screens
import QamarIntroScreen from './screens/cards/qamar/QamarIntroScreen';
import QamarStudioScreen from './screens/cards/qamar/QamarStudioScreen';
import QamarAddressScreen from './screens/cards/qamar/QamarAddressScreen';
import QamarReviewScreen from './screens/cards/qamar/QamarReviewScreen';
import QamarMintingScreen from './screens/cards/qamar/QamarMintingScreen';

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
import WelcomeScreen from 'screens/WelcomeScreen';
import AuthOptionsScreen from 'screens/AuthOptionsScreen';
import EmailInputScreen from 'screens/EmailInputScreen';
import EmailVerificationScreen from 'screens/EmailVerificationScreen';
import SuccessScreen from 'screens/SuccessScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootStackProps {
  isCheckingAuth: boolean;
  isUserLoggedIn: boolean;
  isInSignupFlow: boolean;
  hasUser: boolean;
}

function RootStack({ isCheckingAuth, isUserLoggedIn, isInSignupFlow, hasUser }: RootStackProps) {
  if (isCheckingAuth) {
    return <SplashScreenComponent />;
  }

  // Determine initial route based on auth state
  let initialRoute = 'Intro';
  if (isUserLoggedIn) {
    initialRoute = 'Home';
  } else if (isInSignupFlow && hasUser) {
    // User is in signup flow but not fully authenticated yet
    initialRoute = 'AuthOptions';
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute as keyof RootStackParamList}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {isCheckingAuth ? (
        <Stack.Screen name="Splash" component={SplashScreenComponent} />
      ) : !isUserLoggedIn ? (
        // Auth flow
        <>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="EmailInput" component={EmailInputScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          <Stack.Screen name="KYC" component={KYCScreen} />
        </>
      ) : (
        // Main app flow
        <>
          <Stack.Screen name="Home" component={TabNavigator} />

          {/* Profile and Settings */}
          <Stack.Screen name="Profile" component={ProfileScreen} />

          {/* Islamic Corner Screens */}
          <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
          <Stack.Screen name="DonationAmount" component={DonationAmountScreen} />
          <Stack.Screen name="DonationConfirmation" component={DonationConfirmationScreen} />

          {/* Cards Screens */}
          <Stack.Screen name="CardsDashboard" component={CardsDashboardScreen} />
          <Stack.Screen name="CardLinking" component={CardLinkingScreen} />
          <Stack.Screen name="CardLinkingBack" component={CardLinkingBackScreen} />
          <Stack.Screen name="CardVerification" component={CardVerificationScreen} />

          {/* Card Creation Flow */}
          <Stack.Screen name="CardClaim" component={CardClaimScreen} />
          <Stack.Screen name="PlanSelect" component={PlanSelectScreen} />
          <Stack.Screen name="CardStudio" component={CardStudioScreen} />
          <Stack.Screen name="CardName" component={CardNameScreen} />
          <Stack.Screen name="CardReview" component={CardReviewScreen} />
          <Stack.Screen name="CardMinting" component={CardMintingScreen} />
          <Stack.Screen name="FundCard" component={FundCardScreen} />
          <Stack.Screen name="WalletAdd" component={WalletAddScreen} />

          {/* Shams Metal Card Flow */}
          <Stack.Screen name="ShamsIntro" component={ShamsIntroScreen} />
          <Stack.Screen name="ShamsStudio" component={ShamsStudioScreen} />
          <Stack.Screen name="ShamsAddress" component={ShamsAddressScreen} />
          <Stack.Screen name="ShamsReview" component={ShamsReviewScreen} />

          {/* Qamar Card Flow */}
          <Stack.Screen name="QamarIntro" component={QamarIntroScreen} />
          <Stack.Screen name="QamarStudio" component={QamarStudioScreen} />
          <Stack.Screen name="QamarAddress" component={QamarAddressScreen} />
          <Stack.Screen name="QamarReview" component={QamarReviewScreen} />
          <Stack.Screen name="QamarMinting" component={QamarMintingScreen} />

          {/* Send Money Screens */}
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

          {/* Round-Ups Screens */}
          <Stack.Screen name="RoundUps" component={RoundUpsScreen} />
          <Stack.Screen name="RoundUpsSettings" component={RoundUpsSettingsScreen} />
          <Stack.Screen name="InvestmentPortfolio" component={InvestmentPortfolioScreen} />
          <Stack.Screen name="RoundUpsHistory" component={RoundUpsHistoryScreen} />

          {/* Demo Screens */}
          <Stack.Screen name="FontDemo" component={FontDemoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const [appIsReady, setAppIsReady] = useState(false);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const { isAuthenticated, isInSignupFlow, user } = useAuth();

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

        // Test Supabase connection
        await testSupabaseConnection();
        await testSupabaseAuth();

        console.log('App initialization complete');
      } catch (e) {
        console.warn("Error in prepare function:", e);
      } finally {
        setAppIsReady(true);
        console.log("App is ready.");
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    console.log(`onLayoutRootView called. appIsReady: ${appIsReady}`);
    if (appIsReady) {
      await SplashScreen.hideAsync();
      console.log("Splash screen hidden.");
    }
  }, [appIsReady]);

  // This effect handles navigation after auth check is complete and navigation is ready
  useEffect(() => {
    if (appIsReady && navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      console.log("Auth check complete. Current route:", currentRoute?.name, "User authenticated:", isAuthenticated);
      if (isAuthenticated) {
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
  }, [isAuthenticated, appIsReady]);


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
            <RootStack
              isCheckingAuth={false}
              isUserLoggedIn={isAuthenticated}
              isInSignupFlow={isInSignupFlow}
              hasUser={!!user}
            />
          </NavigationContainer>
        </RoundUpsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});
