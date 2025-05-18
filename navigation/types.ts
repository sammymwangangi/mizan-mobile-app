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
    PhoneNumber: undefined;
    OTP: { phoneNumber: string };
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
  };