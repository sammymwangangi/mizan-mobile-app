// Define the tab navigator param list
export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Reports: undefined;
  IslamicCorner: undefined;
  Support: undefined;
};

export type RootStackParamList = {
    Splash: undefined;
    Intro: undefined;
    Onboarding: undefined;
    Auth: undefined;
    SignUp: undefined;
    PhoneNumber: { email?: string; password?: string; tempUserId?: string };
    OTP: { phoneNumber: string; userId: string };
    KYC: undefined;
    Home: { screen?: keyof TabParamList };
    Profile: undefined;
    Congratulations: undefined;
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