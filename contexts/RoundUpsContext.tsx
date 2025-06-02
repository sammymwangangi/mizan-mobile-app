import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RoundUpsUIState,
  RoundUpsAction,
  RoundUpSettings,
  RoundUpSummary,
  Transaction,
  InvestmentPortfolio,
  BankAccount,
} from '../types/roundups';
import { generateMockTransactions, getRoundUpStatistics, getDefaultPortfolioAllocation } from '../utils/roundups';

// Initial state
const initialState: RoundUpsUIState = {
  isLoading: false,
  error: null,
  settings: null,
  summary: null,
  recentTransactions: [],
  portfolio: null,
  connectedAccounts: [],
};

// Reducer
function roundUpsReducer(state: RoundUpsUIState, action: RoundUpsAction): RoundUpsUIState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, recentTransactions: action.payload };
    case 'SET_PORTFOLIO':
      return { ...state, portfolio: action.payload };
    case 'SET_CONNECTED_ACCOUNTS':
      return { ...state, connectedAccounts: action.payload };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        recentTransactions: state.recentTransactions.map(transaction =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.updates }
            : transaction
        ),
      };
    default:
      return state;
  }
}

// Context
interface RoundUpsContextType {
  state: RoundUpsUIState;
  dispatch: React.Dispatch<RoundUpsAction>;
  // Actions
  initializeRoundUps: () => Promise<void>;
  updateSettings: (settings: Partial<RoundUpSettings>) => Promise<void>;
  toggleRoundUps: (enabled: boolean) => Promise<void>;
  refreshData: () => Promise<void>;
  connectBankAccount: (accountData: Partial<BankAccount>) => Promise<void>;
  processRoundUp: (transactionId: string) => Promise<void>;
}

const RoundUpsContext = createContext<RoundUpsContextType | undefined>(undefined);

// Provider component
interface RoundUpsProviderProps {
  children: ReactNode;
}

export const RoundUpsProvider: React.FC<RoundUpsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(roundUpsReducer, initialState);

  // Initialize round-ups data
  const initializeRoundUps = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load settings from AsyncStorage
      const savedSettings = await AsyncStorage.getItem('roundup_settings');
      let settings: RoundUpSettings;

      if (savedSettings) {
        settings = JSON.parse(savedSettings);
      } else {
        // Create default settings
        settings = {
          id: 'settings_1',
          userId: 'user_1',
          isEnabled: false,
          roundUpMethod: 'nearest_dollar',
          defaultDestination: 'investment',
          investmentAllocation: {
            portfolioId: 'portfolio_1',
            portfolioName: 'Balanced Growth',
            riskLevel: 'moderate',
            assetAllocation: getDefaultPortfolioAllocation('moderate'),
            autoRebalance: true,
          },
          charityAllocation: {
            charityId: 'charity_1',
            charityName: 'Local Food Bank',
            category: 'hunger',
            percentage: 100,
            isVerified: true,
            taxDeductible: true,
          },
          minimumRoundUp: 0.01,
          maximumRoundUp: 5.00,
          excludedCategories: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await AsyncStorage.setItem('roundup_settings', JSON.stringify(settings));
      }

      dispatch({ type: 'SET_SETTINGS', payload: settings });

      // Generate mock transactions for demo
      const mockTransactions = generateMockTransactions(20);
      dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });

      // Calculate summary statistics
      const stats = getRoundUpStatistics(mockTransactions);
      const summary: RoundUpSummary = {
        userId: 'user_1',
        totalRoundUps: stats.yearToDate.roundUps,
        totalInvested: stats.yearToDate.invested,
        totalDonated: stats.yearToDate.donated,
        currentMonth: stats.currentMonth,
        lastMonth: stats.lastMonth,
        yearToDate: stats.yearToDate,
        portfolioValue: 1250.75,
        portfolioGrowth: 8.5,
      };

      dispatch({ type: 'SET_SUMMARY', payload: summary });

      // Mock portfolio data
      const portfolio: InvestmentPortfolio = {
        id: 'portfolio_1',
        userId: 'user_1',
        name: 'Round-Ups Portfolio',
        totalValue: 1250.75,
        totalContributions: 1150.00,
        totalGrowth: 100.75,
        growthPercentage: 8.76,
        holdings: [
          {
            symbol: 'VTI',
            name: 'Vanguard Total Stock Market ETF',
            shares: 15.5,
            currentPrice: 45.20,
            totalValue: 700.60,
            costBasis: 650.00,
            gainLoss: 50.60,
            gainLossPercentage: 7.78,
            assetType: 'etf',
          },
          {
            symbol: 'BND',
            name: 'Vanguard Total Bond Market ETF',
            shares: 8.2,
            currentPrice: 35.15,
            totalValue: 288.23,
            costBasis: 280.00,
            gainLoss: 8.23,
            gainLossPercentage: 2.94,
            assetType: 'etf',
          },
        ],
        riskLevel: 'moderate',
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      dispatch({ type: 'SET_PORTFOLIO', payload: portfolio });

      // Mock connected accounts
      const connectedAccounts: BankAccount[] = [
        {
          id: 'acc_1',
          userId: 'user_1',
          accountName: 'Main Checking',
          accountNumber: '****1234',
          bankName: 'Chase Bank',
          accountType: 'checking',
          isConnected: true,
          isRoundUpEnabled: true,
          balance: 2433.45,
          lastSyncDate: new Date(),
        },
      ];

      dispatch({ type: 'SET_CONNECTED_ACCOUNTS', payload: connectedAccounts });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize round-ups data' });
      console.error('Round-ups initialization error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update settings
  const updateSettings = async (newSettings: Partial<RoundUpSettings>) => {
    try {
      if (!state.settings) return;

      const updatedSettings = {
        ...state.settings,
        ...newSettings,
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem('roundup_settings', JSON.stringify(updatedSettings));
      dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
      console.error('Settings update error:', error);
    }
  };

  // Toggle round-ups on/off
  const toggleRoundUps = async (enabled: boolean) => {
    await updateSettings({ isEnabled: enabled });
  };

  // Refresh all data
  const refreshData = async () => {
    await initializeRoundUps();
  };

  // Connect bank account (mock implementation)
  const connectBankAccount = async (accountData: Partial<BankAccount>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // In a real app, this would integrate with Plaid or similar service
      const newAccount: BankAccount = {
        id: `acc_${Date.now()}`,
        userId: 'user_1',
        accountName: accountData.accountName || 'New Account',
        accountNumber: accountData.accountNumber || '****0000',
        bankName: accountData.bankName || 'Unknown Bank',
        accountType: accountData.accountType || 'checking',
        isConnected: true,
        isRoundUpEnabled: true,
        ...accountData,
      };

      const updatedAccounts = [...state.connectedAccounts, newAccount];
      dispatch({ type: 'SET_CONNECTED_ACCOUNTS', payload: updatedAccounts });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to connect bank account' });
      console.error('Bank account connection error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Process a round-up for a transaction
  const processRoundUp = async (transactionId: string) => {
    try {
      // In a real app, this would call the investment/charity API
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: transactionId,
          updates: { isRoundUpEnabled: true },
        },
      });

      // Refresh summary after processing
      await refreshData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process round-up' });
      console.error('Round-up processing error:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeRoundUps();
  }, []);

  const contextValue: RoundUpsContextType = {
    state,
    dispatch,
    initializeRoundUps,
    updateSettings,
    toggleRoundUps,
    refreshData,
    connectBankAccount,
    processRoundUp,
  };

  return (
    <RoundUpsContext.Provider value={contextValue}>
      {children}
    </RoundUpsContext.Provider>
  );
};

// Hook to use the context
export const useRoundUps = (): RoundUpsContextType => {
  const context = useContext(RoundUpsContext);
  if (!context) {
    throw new Error('useRoundUps must be used within a RoundUpsProvider');
  }
  return context;
};
