import { 
  RoundUpSettings, 
  RoundUpSummary, 
  InvestmentPortfolio, 
  BankAccount, 
  Transaction 
} from '../../types/roundups';

class RoundUpsApiService {
  // Get user's round-up settings
  async getRoundUpSettings(): Promise<RoundUpSettings> {
    // API call would go here in production
    const response = await fetch('/api/roundups/settings');
    return response.json();
  }

  // Get round-up summary statistics
  async getRoundUpSummary(): Promise<RoundUpSummary> {
    const response = await fetch('/api/roundups/summary');
    return response.json();
  }

  // Get investment portfolio details
  async getInvestmentPortfolio(): Promise<InvestmentPortfolio> {
    const response = await fetch('/api/roundups/portfolio');
    return response.json();
  }

  // Get connected bank accounts
  async getBankAccounts(): Promise<BankAccount[]> {
    const response = await fetch('/api/roundups/accounts');
    return response.json();
  }

  // Get recent transactions
  async getTransactions(page: number, limit: number): Promise<{transactions: Transaction[]}> {
    const response = await fetch(`/api/roundups/transactions?page=${page}&limit=${limit}`);
    return response.json();
  }

  // Update round-up settings
  async updateRoundUpSettings(settings: Partial<RoundUpSettings>): Promise<RoundUpSettings> {
    const response = await fetch('/api/roundups/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    return response.json();
  }
}

// Create and export a singleton instance
export const roundUpsApiService = new RoundUpsApiService();