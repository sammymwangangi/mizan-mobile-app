import { angleToPoints } from '../utils/angleToPoints';

export const NOOR_BENEFITS = [
  'Free - no monthly fee',
  'Ready in seconds',
  'Real-time AI spend tracking',
  'Send & receive halal USDT',
  'Add a name, emoji or goal',
];
export const BARAKAH_PURPLE = '#7B5CFF';
export const NOOR_FUND_PRESETS = [1, 5, 10];

export type NoorGradientStop = { offset: string; color: string, opacity?: number };
export type NoorGradient = { angle: number; stops: NoorGradientStop[] };
export type NoorColor = { id: string; value?: string; gradient?: NoorGradient };

export const NOOR_COLORS: NoorColor[] = [
  {
    id: 'purple',
    gradient: {
      angle: 135,
      stops: [
        { offset: '0%', color: '#80B2FF', opacity: 0.7 },
        { offset: '52%', color: '#7C27D9', opacity: 0.5 },
        { offset: '100%', color: '#FF68F0', opacity: 0.8 },
      ],
    },
  },
  { id: 'rose', value: '#D155FF' },
  { id: 'violet', value: '#6D6E8A' },
  { id: 'navy', value: '#7200B3' },
];

export const NOOR_SHAMS_UPGRADE = {
  gold: {
    id: 'gold',
    name: 'Gold',
    gradient: {
      angle: 45,
      stops: [
        { color: '#FFD700', position: 0 },
        { color: '#DAA520', position: 1 },
      ],
    },
  },
  gunmetal: {
    id: 'gunmetal',
    name: 'Gunmetal',
    gradient: {
      angle: 45,
      stops: [
        { color: '#2F4F4F', position: 0 },
        { color: '#4A4A4A', position: 1 },
      ],
    },
  },
  nimbus: {
    id: 'nimbus',
    name: 'Nimbus',
    value: '#E5E5E5',
  },
};

export const BARAKAH_BLUE = '#0088FF';

// Feature Toggles
export const NOOR_FEATURES = [
  {
    id: 'smartSpend',
    name: 'Smart Spend Insights',
    description: "We'll categorise your transactions so you see where your money really goes.",
    defaultValue: false,
  },
  {
    id: 'fraudShield',
    name: 'Fraud & Security Shield',
    description: 'Real-time alerts if we spot suspicious activity.',
    defaultValue: false,
  },
  {
    id: 'robinAI',
    name: 'Robin Habibi AI (Beta)',
    description: 'Personalised tips to keep you on your spend track (unlocks after 30 days).',
    defaultValue: false,
    exampleItalic: true,
  },
];

export const VALIDATION = {
  ADDRESS_MIN_LENGTH: 10,
  POSTAL_CODE_LENGTH: 5,
  PHONE_MIN_LENGTH: 10,
  MIN_ADDRESS_LENGTH: 6,
};

// Analytics Events
export const NOOR_ANALYTICS = {
  EVENT_START_CLAIM: 'event_start_claim',
  EVENT_COLOUR_CHOSEN: 'event_colour_chosen',
  CARD_STEP_VIEW: 'card_step_view',
  CARD_ORDER_SUBMIT: 'card_order_submit',
  CARD_ORDER_SUCCESS: 'card_order_success',
  ACTIVATION_FUND_SUCCESS: 'activation_fund_success',
  SHARE_REFERRAL_CLICKED: 'share_referral_clicked',
  CARD_TNC_OPEN: 'card_tnc_open',
  CARD_TNC_AGREE: 'card_tnc_agree',
  CARD_TNC_DECLINE: 'card_tnc_decline',
  CARD_TNC_EMAIL: 'card_tnc_email',
};
