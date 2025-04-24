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

  async getRecurringExpenses(): Promise<RecurringExpense[]> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/recurringExpenses', {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recurring expenses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      throw error;
    }
  },

  async toggleRecurringExpenseStatus(id: number, isActive: boolean): Promise<RecurringExpense> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/recurringExpenses/${id}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update recurring expense status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating recurring expense status:', error);
      throw error;
    }
  },

  async deleteRecurringExpense(id: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/recurringExpenses/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete recurring expense');
      }
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
      throw error;
    }
  },

  async updateRecurringExpense(id: number, expense: Partial<RecurringExpense>): Promise<RecurringExpense> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/recurringExpenses/${id}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to update recurring expense');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating recurring expense:', error);
      throw error;
    }
  },
};
