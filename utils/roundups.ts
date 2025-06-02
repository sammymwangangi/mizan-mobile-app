import { Transaction, RoundUpSettings, RoundUpCalculationResponse } from '../types/roundups';

/**
 * Calculate round-up amount for a transaction
 * @param amount - Original transaction amount
 * @param settings - User's round-up settings
 * @returns Round-up calculation result
 */
export function calculateRoundUp(
  amount: number,
  settings: RoundUpSettings
): RoundUpCalculationResponse {
  let roundUpAmount = 0;

  if (!settings.isEnabled || amount <= 0) {
    return {
      originalAmount: amount,
      roundUpAmount: 0,
      newTotal: amount,
      destination: settings.defaultDestination,
    };
  }

  if (settings.roundUpMethod === 'nearest_dollar') {
    // Round up to nearest dollar
    const ceilingAmount = Math.ceil(amount);
    roundUpAmount = ceilingAmount - amount;
  } else if (settings.roundUpMethod === 'custom_amount' && settings.customRoundUpAmount) {
    // Use custom fixed round-up amount
    roundUpAmount = settings.customRoundUpAmount;
  }

  // Apply minimum and maximum limits
  if (roundUpAmount < settings.minimumRoundUp) {
    roundUpAmount = 0; // Don't round up if below minimum
  }

  if (roundUpAmount > settings.maximumRoundUp) {
    roundUpAmount = settings.maximumRoundUp;
  }

  return {
    originalAmount: amount,
    roundUpAmount: Number(roundUpAmount.toFixed(2)),
    newTotal: Number((amount + roundUpAmount).toFixed(2)),
    destination: settings.defaultDestination,
  };
}

/**
 * Check if a transaction category should be excluded from round-ups
 * @param category - Transaction category
 * @param excludedCategories - List of excluded categories
 * @returns Whether the category is excluded
 */
export function isCategoryExcluded(category: string, excludedCategories: string[]): boolean {
  return excludedCategories.includes(category.toLowerCase());
}

/**
 * Calculate total round-ups for a period
 * @param transactions - Array of transactions
 * @param startDate - Start date for calculation
 * @param endDate - End date for calculation
 * @returns Total round-up amount
 */
export function calculateTotalRoundUps(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && 
             transactionDate <= endDate && 
             transaction.isRoundUpEnabled;
    })
    .reduce((total, transaction) => total + transaction.roundUpAmount, 0);
}

/**
 * Get round-up statistics for different periods
 * @param transactions - Array of transactions
 * @returns Statistics object with different time periods
 */
export function getRoundUpStatistics(transactions: Transaction[]) {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= currentMonth && t.isRoundUpEnabled;
  });

  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= lastMonth && date <= lastMonthEnd && t.isRoundUpEnabled;
  });

  const yearToDateTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= yearStart && t.isRoundUpEnabled;
  });

  return {
    currentMonth: {
      roundUps: currentMonthTransactions.reduce((sum, t) => sum + t.roundUpAmount, 0),
      invested: currentMonthTransactions
        .filter(t => t.roundUpDestination === 'investment')
        .reduce((sum, t) => sum + t.roundUpAmount, 0),
      donated: currentMonthTransactions
        .filter(t => t.roundUpDestination === 'charity')
        .reduce((sum, t) => sum + t.roundUpAmount, 0),
      transactionCount: currentMonthTransactions.length,
    },
    lastMonth: {
      roundUps: lastMonthTransactions.reduce((sum, t) => sum + t.roundUpAmount, 0),
      invested: lastMonthTransactions
        .filter(t => t.roundUpDestination === 'investment')
        .reduce((sum, t) => sum + t.roundUpAmount, 0),
      donated: lastMonthTransactions
        .filter(t => t.roundUpDestination === 'charity')
        .reduce((sum, t) => sum + t.roundUpAmount, 0),
      transactionCount: lastMonthTransactions.length,
    },
    yearToDate: {
      roundUps: yearToDateTransactions.reduce((sum, t) => sum + t.roundUpAmount, 0),
      invested: yearToDateTransactions
        .filter(t => t.roundUpDestination === 'investment')
        .reduce((sum, t) => sum + t.roundUpAmount, 0),
      donated: yearToDateTransactions
        .filter(t => t.roundUpDestination === 'charity')
        .reduce((sum, t) => sum + t.roundUpAmount, 0),
      transactionCount: yearToDateTransactions.length,
    },
  };
}

/**
 * Format round-up amount for display
 * @param amount - Round-up amount
 * @returns Formatted string
 */
export function formatRoundUpAmount(amount: number): string {
  if (amount === 0) return '$0.00';
  return `+$${amount.toFixed(2)}`;
}

/**
 * Calculate portfolio allocation based on risk level
 * @param riskLevel - User's risk tolerance
 * @returns Asset allocation percentages
 */
export function getDefaultPortfolioAllocation(riskLevel: 'conservative' | 'moderate' | 'aggressive') {
  switch (riskLevel) {
    case 'conservative':
      return {
        stocks: 30,
        bonds: 60,
        etfs: 10,
        crypto: 0,
      };
    case 'moderate':
      return {
        stocks: 50,
        bonds: 35,
        etfs: 15,
        crypto: 0,
      };
    case 'aggressive':
      return {
        stocks: 70,
        bonds: 15,
        etfs: 10,
        crypto: 5,
      };
    default:
      return {
        stocks: 50,
        bonds: 35,
        etfs: 15,
        crypto: 0,
      };
  }
}

/**
 * Validate round-up settings
 * @param settings - Round-up settings to validate
 * @returns Validation result with errors if any
 */
export function validateRoundUpSettings(settings: Partial<RoundUpSettings>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (settings.minimumRoundUp !== undefined && settings.minimumRoundUp < 0) {
    errors.push('Minimum round-up amount cannot be negative');
  }

  if (settings.maximumRoundUp !== undefined && settings.maximumRoundUp <= 0) {
    errors.push('Maximum round-up amount must be greater than 0');
  }

  if (
    settings.minimumRoundUp !== undefined &&
    settings.maximumRoundUp !== undefined &&
    settings.minimumRoundUp > settings.maximumRoundUp
  ) {
    errors.push('Minimum round-up amount cannot be greater than maximum');
  }

  if (
    settings.roundUpMethod === 'custom_amount' &&
    (!settings.customRoundUpAmount || settings.customRoundUpAmount <= 0)
  ) {
    errors.push('Custom round-up amount must be specified and greater than 0');
  }

  if (settings.monthlyLimit !== undefined && settings.monthlyLimit <= 0) {
    errors.push('Monthly limit must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate mock transaction data for testing
 * @param count - Number of transactions to generate
 * @returns Array of mock transactions
 */
export function generateMockTransactions(count: number): Transaction[] {
  const merchants = ['Starbucks', 'Amazon', 'Uber', 'Target', 'McDonald\'s', 'Shell', 'Walmart', 'Netflix'];
  const categories = ['food', 'shopping', 'transportation', 'entertainment', 'gas', 'subscriptions'];
  
  return Array.from({ length: count }, (_, index) => {
    const amount = Math.random() * 100 + 5; // $5 to $105
    const roundUpAmount = Math.ceil(amount) - amount;
    
    return {
      id: `tx_${index + 1}`,
      amount: Number(amount.toFixed(2)),
      roundUpAmount: Number(roundUpAmount.toFixed(2)),
      merchantName: merchants[Math.floor(Math.random() * merchants.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      description: `Purchase at ${merchants[Math.floor(Math.random() * merchants.length)]}`,
      accountId: 'acc_1',
      isRoundUpEnabled: Math.random() > 0.2, // 80% have round-ups enabled
      roundUpDestination: Math.random() > 0.5 ? 'investment' : 'charity',
    };
  });
}
