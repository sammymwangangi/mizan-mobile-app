import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type CardStackParamList = {
  CardClaim: undefined;
  PlanSelect: undefined;
  CardStudio: { planId: string };
  CardName: { color: string; isMetal: boolean };
  CardReview: {
    color: string;
    isMetal: boolean;
    name: string;
  };
  CardMinting: {
    cardDetails: {
      color: string;
      isMetal: boolean;
      name: string;
      features: {
        smartSpend: boolean;
        fraudShield: boolean;
        robinAI: boolean;
      };
    }
  };
  FundCard: { cardId: string };
  WalletAdd: { cardId: string };
};

export type CardScreenNavigationProp = NativeStackNavigationProp<CardStackParamList>;

export type CardClaimNavigationProp = NativeStackNavigationProp<CardStackParamList, 'CardClaim'>;
export type PlanSelectNavigationProp = NativeStackNavigationProp<CardStackParamList, 'PlanSelect'>;
export type CardStudioNavigationProp = NativeStackNavigationProp<CardStackParamList, 'CardStudio'>;
export type CardNameNavigationProp = NativeStackNavigationProp<CardStackParamList, 'CardName'>;
export type CardReviewNavigationProp = NativeStackNavigationProp<CardStackParamList, 'CardReview'>;
export type CardMintingNavigationProp = NativeStackNavigationProp<CardStackParamList, 'CardMinting'>;
export type FundCardNavigationProp = NativeStackNavigationProp<CardStackParamList, 'FundCard'>;
export type WalletAddNavigationProp = NativeStackNavigationProp<CardStackParamList, 'WalletAdd'>;

export type CardMintingScreenRouteProp = RouteProp<CardStackParamList, 'CardMinting'>;
export type FundCardScreenRouteProp = RouteProp<CardStackParamList, 'FundCard'>;
export type WalletAddScreenRouteProp = RouteProp<CardStackParamList, 'WalletAdd'>;
