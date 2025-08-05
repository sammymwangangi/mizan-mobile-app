import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CardClaimScreen from '../screens/cards/CardClaimScreen';
import PlanSelectScreen from '../screens/cards/PlanSelectScreen';
import CardStudioScreen from '../screens/cards/CardStudioScreen';
import CardNameScreen from '../screens/cards/CardNameScreen';
import CardReviewScreen from '../screens/cards/CardReviewScreen';
import CardMintingScreen from '../screens/cards/CardMintingScreen';
import FundCardScreen from '../screens/cards/FundCardScreen';
import WalletAddScreen from '../screens/cards/WalletAddScreen';
import type { CardStackParamList } from './CardNavigationTypes';

const Stack = createStackNavigator<CardStackParamList>();

const CardNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen name="CardClaim" component={CardClaimScreen} />
      <Stack.Screen name="PlanSelect" component={PlanSelectScreen} />
      <Stack.Screen name="CardStudio" component={CardStudioScreen} />
      <Stack.Screen name="CardName" component={CardNameScreen} />
      <Stack.Screen name="CardReview" component={CardReviewScreen} />
      <Stack.Screen name="CardMinting" component={CardMintingScreen} />
      <Stack.Screen name="FundCard" component={FundCardScreen} />
      <Stack.Screen name="WalletAdd" component={WalletAddScreen} />
    </Stack.Navigator>
  );
};

export default CardNavigator;
