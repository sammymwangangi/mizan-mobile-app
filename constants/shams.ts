// Shams Metal Card Constants
// Based on developer handoff notes

export const METAL_SWATCHES = {
  titanium: {
    base: '#4A4747',
    light: '#E8E8E8',
    dark: '#101010'
  },
  bronze: {
    base: '#D39C90',
    light: '#FFF2EF',
    dark: '#D39B8E'
  },
  nebula: {
    base: '#F5F4F3',
    light: '#FFFFFF',
    dark: '#D7D6D5'
  },
  roseGold: {
    base: '#C09780',
    light: '#D7B2A0',
    dark: '#9E7661'
  },
  accent: '#D4AF37' // gold confetti
};

// Design tokens for Shams visual language
export const SHAMS_TOKENS = {
  background: '#1B1C39',
  // Shared gradient used for headings/headers
  headingGradient: {
    colors: ['#D39C90', '#FFFFFF', '#D39B8E'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
  },
  // Shared pattern (top-right)
  pattern: require('../assets/cards/shams/shams-pattern.png'),
} as const;

export const CTA_GRADIENT = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  colors: [
    METAL_SWATCHES.roseGold.base,
    METAL_SWATCHES.roseGold.base + '33'
  ] as const
};

export const CONFETTI_COLORS = [METAL_SWATCHES.accent, '#F8E7A0'];

export const METAL_OPTIONS = [
  {
    id: 'titanium',
    name: 'Titanium',
    colors: METAL_SWATCHES.titanium,
    description: 'Sleek and modern'
  },
  {
    id: 'bronze',
    name: 'Bronze',
    colors: METAL_SWATCHES.bronze,
    description: 'Warm and classic'
  },
  {
    id: 'nebula',
    name: 'Nebula',
    colors: METAL_SWATCHES.nebula,
    description: 'Pure and elegant'
  }
];

export const FUND_AMOUNTS = [
  { value: 10, label: '$10' },
  { value: 20, label: '$20' },
  { value: 50, label: '$50' }
];

export const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Via Card',
    icon: require('../assets/payments/card-icon.png')
  },
  {
    id: 'mobile',
    name: 'Via Mobile Money',
    icon: require('../assets/payments/mobile-money-icon.png')
  },
  {
    id: 'paypal',
    name: 'Via PayPal',
    icon: require('../assets/cards/mizan-card.png')
  }
];

// Analytics events
export const ANALYTICS_EVENTS = {
  EVENT_START_CLAIM: 'event_start_claim',
  CARD_STEP_VIEW: 'card_step_view',
  CARD_METAL_COLOUR: 'card_metal_colour',
  CARD_ORDER_SUBMIT: 'card_order_submit',
  CARD_ORDER_SUCCESS: 'card_order_success',
  FUND_SUCCESS: 'fund_success',
  REFERRAL_SHARE: 'referral_share',
  WALLET_ADD_SUCCESS: 'wallet_add_success'
};

// Wallet integration
export const addToAppleWallet = (id: string) => {
  const { Linking, Alert } = require('react-native');
  return Linking.openURL(`passkit://card/add/${id}`)
    .catch(() => Alert.alert('Could not open Apple Wallet'));
};

export const addToGoogleWallet = (id: string) => {
  const { Linking, Alert } = require('react-native');
  return Linking.openURL(`https://mizan.app/wallet/${id}`)
    .catch(() => Alert.alert('Google Wallet not installed'));
};
