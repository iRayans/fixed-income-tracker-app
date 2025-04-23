
import { authService } from './authService';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
  yearMonth: string;
  bank: string;
  category: Category;
  recurringId: number | null;
  paid: boolean;
  date?: string; // Keep the old field for backward compatibility
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

  async updateExpensePaidStatus(id: number, paid: boolean): Promise<Expense> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/expenses/${id}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ paid }),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }
};
