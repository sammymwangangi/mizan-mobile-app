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
  };