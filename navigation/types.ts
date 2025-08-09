// Define the tab navigator param list
export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Reports: undefined;
  IslamicCorner: undefined;
  Support: undefined;
};

export type RootStackParamList = {
  // Core app flow screens
  Splash: undefined;
  Intro: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Auth: undefined;
  AuthOptions: { tempUserId?: string };
  OTP: { phoneNumber: string; userId: string };
  EmailInput: undefined;
  EmailVerification: { email: string };
  SuccessScreen: { authMethod: 'phone' | 'email' | 'google' | 'apple' };
  KYC: undefined;
  Home: { screen?: keyof TabParamList };
  // App screens
  Profile: undefined;
  CampaignDetails: { campaignId: string };
  DonationAmount: { campaignId: string };
  DonationConfirmation: {
    campaignId: string;
    amount: string;
    paymentMethod: string;
  };
  CardsDashboard: undefined;
  CardLinking: undefined;
  CardLinkingBack: undefined;
  CardVerification: undefined;

  // Card Creation Flow
  CardClaim: undefined;
  PlanSelect: undefined;
  CardStudio: { planId: string };
  CardName: { color: string; isMetal: boolean };
  CardReview: {
    color: string;
    isMetal: boolean;
    name: string;
  };

  // Shams Metal Card Flow
  ShamsIntro: undefined;
  ShamsStudio: undefined;
  ShamsAddress: { selectedMetal: string };
  ShamsReview: {
    selectedMetal: string;
    deliveryAddress: {
      fullName: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };

  // Qamar Card Flow
  QamarIntro: { planId: string };
  QamarStudio: { planId: string };
  QamarAddress: { planId: string; selectedColor: string };
  QamarReview: {
    planId: string;
    selectedColor: string;
    deliveryAddress: {
      address: string;
    };
  };
  QamarMinting: {
    planId: string;
    selectedColor: string;
    deliveryAddress: {
      address: string;
    };
    features: {
      smartSpend: boolean;
      fraudShield: boolean;
      robinAI: boolean;
    };
  };

  CardMinting: {
    selectedMetal?: string;
    deliveryAddress?: {
      fullName: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    settings?: {
      smartSpending: boolean;
      fraudProtection: boolean;
      aiPro: boolean;
    };
    cardDetails?: {
      color: string;
      isMetal: boolean;
      name: string;
      features: {
        smartSpend: boolean;
        fraudShield: boolean;
        robinAI: boolean;
      };
    };
  };
  FundCard: { cardId: string };
  WalletAdd: { cardId: string };
  SendMoney: undefined;
  SendMoneyConfirmation: {
    recipientName: string;
    amount: string;
  };
  SendMoneySuccess: {
    recipientName: string;
    amount: string;
    transactionId: string;
  };
  MPESA: undefined;
  MPESASend: undefined;
  MPESARecipient: undefined;
  MPESAAmount: { recipientId?: string; recipientName?: string; recipientPhone?: string };
  MPESAConfirmation: {
    recipientId?: string;
    recipientName?: string;
    recipientPhone?: string;
    amount: string;
  };
  MPESASuccess: {
    recipientName?: string;
    amount: string;
    transactionId: string;
  };
  Shop: undefined;
  Checkout: undefined;
  Payment: undefined;
  FontDemo: undefined; // Added for font system demo

  // Round-Ups Feature Screens
  RoundUps: undefined;
  RoundUpsSettings: undefined;
  RoundUpsHistory: undefined;
  InvestmentPortfolio: undefined;
  CharitySelection: undefined;
  RoundUpsOnboarding: undefined;
};
