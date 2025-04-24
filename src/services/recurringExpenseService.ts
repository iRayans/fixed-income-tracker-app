
import { authService } from './authService';

export interface RecurringExpense {
  id?: number;
  name: string;
  description: string;
  amount: number;
  dueDayOfMonth: number;
  categoryId: number;
  isActive: boolean;
}

export interface CreateRecurringExpenseDto {
  name: string;
  description: string;
  amount: number;
  dueDayOfMonth: number;
  categoryId: number;
  isActive: boolean;
}

export const recurringExpenseService = {
  async createRecurringExpense(expense: CreateRecurringExpenseDto): Promise<RecurringExpense> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/recurringExpenses', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to create recurring expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating recurring expense:', error);
      throw error;
    }
  },
};

