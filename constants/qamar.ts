// Qamar Card Constants
// Based on developer handoff notes

export const MIN_TOPUP = 1; // USD
export const CURRENCY = 'USD';
export const BARAKAH_PURPLE = '#7B5CFF';

// Qamar Color Palette (same as Noor)
export const QAMAR_COLORS = [
  {
    id: 'purple',
    name: 'Purple',
    value: '#7B5CFF',
    description: 'Classic Barakah'
  },
  {
    id: 'blue',
    name: 'Blue',
    value: '#3B82F6',
    description: 'Ocean Calm'
  },
  {
    id: 'green',
    name: 'Green',
    value: '#10B981',
    description: 'Nature Fresh'
  },
  {
    id: 'pink',
    name: 'Pink',
    value: '#EC4899',
    description: 'Sunset Glow'
  },
  {
    id: 'orange',
    name: 'Orange',
    value: '#F59E0B',
    description: 'Desert Sun'
  },
  {
    id: 'teal',
    name: 'Teal',
    value: '#14B8A6',
    description: 'Peaceful Waters'
  }
];

// Fund Amount Presets
export const FUND_PRESETS = [
  { value: 1, label: '$1' },
  { value: 5, label: '$5' },
  { value: 10, label: '$10' }
];

// Payment Methods
export const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Card',
    icon: require('../assets/payments/card-icon.png'),
    default: true
  },
  {
    id: 'mobile',
    name: 'Mobile Money',
    icon: require('../assets/payments/mobile-money-icon.png'),
    default: false
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: require('../assets/cards/mizan-card.png'),
    default: false
  }
];

// Qamar Benefits (6-bullet list)
export const QAMAR_BENEFITS = [
  {
    id: 'trial',
    title: '30-day trial',
    description: 'Try all features risk-free'
  },
  {
    id: 'invite',
    title: '$10 invite bonus',
    description: 'Earn when friends join'
  },
  {
    id: 'cashback',
    title: '2% cashback',
    description: 'On all halal purchases'
  },
  {
    id: 'insights',
    title: 'Smart insights',
    description: 'AI-powered spending analysis'
  },
  {
    id: 'protection',
    title: 'Fraud protection',
    description: 'Advanced security features'
  },
  {
    id: 'support',
    title: 'Priority support',
    description: '24/7 dedicated assistance'
  }
];

// Feature Toggles
export const QAMAR_FEATURES = [
  {
    id: 'smartSpend',
    name: 'Smart Spend',
    description: 'AI-powered spending insights',
    defaultValue: true
  },
  {
    id: 'fraudShield',
    name: 'Fraud Shield',
    description: 'Advanced fraud protection',
    defaultValue: true
  },
  {
    id: 'robinAI',
    name: 'Robin AI',
    description: 'Personal finance assistant',
    defaultValue: false
  }
];

// Referral Channels
export const REFERRAL_CHANNELS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: require('../assets/cards/mizan-card.png'),
    shareUrl: 'whatsapp://send?text='
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: require('../assets/cards/mizan-card.png'),
    shareUrl: 'instagram://share?text='
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: require('../assets/cards/mizan-card.png'),
    shareUrl: 'twitter://post?message='
  },
  {
    id: 'messenger',
    name: 'Messenger',
    icon: require('../assets/cards/mizan-card.png'),
    shareUrl: 'fb-messenger://share?text='
  }
];

// Analytics Events
export const QAMAR_ANALYTICS = {
  EVENT_START_CLAIM: 'event_start_claim',
  EVENT_COLOUR_CHOSEN: 'event_colour_chosen',
  CARD_STEP_VIEW: 'card_step_view',
  CARD_ORDER_SUBMIT: 'card_order_submit',
  CARD_ORDER_SUCCESS: 'card_order_success',
  ACTIVATION_FUND_SUCCESS: 'activation_fund_success',
  SHARE_REFERRAL_CLICKED: 'share_referral_clicked'
};

// Confetti Configuration
export const CONFETTI_CONFIG = {
  count: 40,
  origin: { x: 0, y: -20 }, // Will be adjusted based on screen width
  fadeOut: true,
  colors: [BARAKAH_PURPLE, '#9F7AFF', '#B794FF']
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  SWATCH_TAP: 100,
  CARD_SCALE: 5000,
  CONFETTI_DELAY: 1000,
  SUCCESS_SCALE: 200
};

// Validation Rules
export const VALIDATION = {
  MIN_ADDRESS_LENGTH: 10,
  REQUIRED_FIELDS: ['fullName', 'addressLine1', 'city', 'postalCode', 'country']
};

// Default Referral Message
export const REFERRAL_MESSAGE = "Join me on Mizan Money - the halal way to manage your finances! We both get $10 when you sign up. Download now: https://mizan.app/download";

// Wallet Integration
export const addToAppleWallet = (cardId: string) => {
  const { Linking, Alert } = require('react-native');
  return Linking.openURL(`passkit://card/add/${cardId}`)
    .catch(() => Alert.alert('Could not open Apple Wallet'));
};

export const addToGoogleWallet = (cardId: string) => {
  const { Linking, Alert } = require('react-native');
  return Linking.openURL(`https://mizan.app/wallet/${cardId}`)
    .catch(() => Alert.alert('Google Wallet not installed'));
};
