
import { authService } from './authService';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  recurring: boolean;
}

export const expenseService = {
  async getExpenses(date: string): Promise<Expense[]> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/expenses/${date}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
};

