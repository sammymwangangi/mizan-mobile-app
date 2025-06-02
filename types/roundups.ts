// Round-Ups Feature Type Definitions

export interface Transaction {
  id: string;
  amount: number;
  roundUpAmount: number;
  merchantName: string;
  category: string;
  date: Date;
  description: string;
  accountId: string;
  isRoundUpEnabled: boolean;
  roundUpDestination: 'investment' | 'charity';
}

export interface RoundUpSettings {
  id: string;
  userId: string;
  isEnabled: boolean;
  roundUpMethod: 'nearest_dollar' | 'custom_amount';
  customRoundUpAmount?: number; // For fixed round-up amounts
  defaultDestination: 'investment' | 'charity';
  investmentAllocation: InvestmentAllocation;
  charityAllocation: CharityAllocation;
  minimumRoundUp: number; // Minimum amount to trigger round-up
  maximumRoundUp: number; // Maximum round-up per transaction
  monthlyLimit?: number; // Optional monthly round-up limit
  excludedCategories: string[]; // Categories to exclude from round-ups
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentAllocation {
  portfolioId: string;
  portfolioName: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  assetAllocation: {
    stocks: number; // Percentage
    bonds: number; // Percentage
    etfs: number; // Percentage
    crypto?: number; // Optional crypto allocation
  };
  autoRebalance: boolean;
}

export interface CharityAllocation {
  charityId: string;
  charityName: string;
  category: string; // e.g., 'education', 'healthcare', 'environment'
  percentage: number; // If splitting between multiple charities
  isVerified: boolean;
  taxDeductible: boolean;
}

export interface RoundUpSummary {
  userId: string;
  totalRoundUps: number;
  totalInvested: number;
  totalDonated: number;
  currentMonth: {
    roundUps: number;
    invested: number;
    donated: number;
    transactionCount: number;
  };
  lastMonth: {
    roundUps: number;
    invested: number;
    donated: number;
    transactionCount: number;
  };
  yearToDate: {
    roundUps: number;
    invested: number;
    donated: number;
    transactionCount: number;
  };
  portfolioValue?: number; // Current investment portfolio value
  portfolioGrowth?: number; // Portfolio growth percentage
}

export interface InvestmentPortfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  totalContributions: number;
  totalGrowth: number;
  growthPercentage: number;
  holdings: PortfolioHolding[];
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  createdAt: Date;
  lastUpdated: Date;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercentage: number;
  assetType: 'stock' | 'etf' | 'bond' | 'crypto';
}

export interface CharityDonation {
  id: string;
  userId: string;
  charityId: string;
  charityName: string;
  amount: number;
  date: Date;
  transactionId: string;
  isFromRoundUps: boolean;
  taxReceiptUrl?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface RoundUpHistory {
  id: string;
  userId: string;
  transactionId: string;
  originalAmount: number;
  roundUpAmount: number;
  destination: 'investment' | 'charity';
  destinationId: string; // Portfolio ID or Charity ID
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  merchantName: string;
  category: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountName: string;
  accountNumber: string; // Masked
  routingNumber?: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  isConnected: boolean;
  isRoundUpEnabled: boolean;
  balance?: number;
  lastSyncDate?: Date;
  plaidAccountId?: string; // For Plaid integration
}

// API Response Types
export interface RoundUpCalculationResponse {
  originalAmount: number;
  roundUpAmount: number;
  newTotal: number;
  destination: 'investment' | 'charity';
}

export interface InvestmentOrderResponse {
  orderId: string;
  status: 'pending' | 'filled' | 'cancelled';
  amount: number;
  shares?: number;
  symbol?: string;
  executedAt?: Date;
}

// UI State Types
export interface RoundUpsUIState {
  isLoading: boolean;
  error: string | null;
  settings: RoundUpSettings | null;
  summary: RoundUpSummary | null;
  recentTransactions: Transaction[];
  portfolio: InvestmentPortfolio | null;
  connectedAccounts: BankAccount[];
}

// Action Types for State Management
export type RoundUpsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SETTINGS'; payload: RoundUpSettings }
  | { type: 'SET_SUMMARY'; payload: RoundUpSummary }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_PORTFOLIO'; payload: InvestmentPortfolio }
  | { type: 'SET_CONNECTED_ACCOUNTS'; payload: BankAccount[] }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<Transaction> } };
