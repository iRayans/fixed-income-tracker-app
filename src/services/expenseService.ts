import { authService } from "./authService";

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
  categoryId: number;
  category?: Category;
  recurringId: number | null;
  paid: boolean;
}

export interface CreateExpenseDto {
  name: string;
  description: string;
  amount: number;
  yearMonth: string;
  bank: string;
  categoryId: number;
  paid: boolean;
}

export interface UpdateExpenseDto {
  name?: string;
  description?: string;
  amount?: number;
  yearMonth?: string;
  bank?: string;
  categoryId?: number;
  paid?: boolean;
}

export const expenseService = {
  async getExpenses(date: string): Promise<Expense[]> {
    const startedAt = performance.now();
    try {
      const response = await fetch(
        `http://192.168.0.4:8080/api/v1/expenses/${date}`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch expenses (${response.status})`);
      }

      const data = await response.json();
      const list: Expense[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      console.info(
        `[expenses] ${date} -> ${list.length} items in ${Math.round(performance.now() - startedAt)}ms`,
        Array.isArray(data) ? "array" : typeof data
      );

      return list.map((expense) => ({
        ...expense,
        amount: Number(expense.amount) || 0,
        categoryId: expense.categoryId ?? expense.category?.id ?? 0,
        paid: Boolean(expense.paid),
      }));
    } catch (error) {
      console.error(
        `[expenses] ${date} failed after ${Math.round(performance.now() - startedAt)}ms`,
        error
      );
      throw error;
    }
  },


  async updateExpensePaidStatus(id: number, paid: boolean): Promise<Expense> {
    try {
      const response = await fetch(
        `http://192.168.0.4:8080/api/v1/expenses/${id}`,
        {
          method: "PUT",
          headers: authService.getAuthHeaders(),
          body: JSON.stringify({ paid }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  async updateExpense(id: number, expense: UpdateExpenseDto): Promise<Expense> {
    try {
      const response = await fetch(
        `http://192.168.0.4:8080/api/v1/expenses/${id}`,
        {
          method: "PUT",
          headers: authService.getAuthHeaders(),
          body: JSON.stringify(expense),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  async deleteExpense(id: number): Promise<void> {
    try {
      const response = await fetch(
        `http://192.168.0.4:8080/api/v1/expenses/${id}`,
        {
          method: "DELETE",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  async createExpense(expense: CreateExpenseDto): Promise<Expense> {
    try {
      const response = await fetch("http://192.168.0.4:8080/api/v1/expenses", {
        method: "POST",
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error("Failed to create expense");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  },

  async getAvailableYears(): Promise<number[]> {
    try {
      const response = await fetch(
        "http://192.168.0.4:8080/api/v1/expenses/years",
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available years");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching available years:", error);
      throw error;
    }
  },

  async generateRecurringExpenses(yearMonth: string): Promise<void> {
    try {
      const response = await fetch(
        'http://192.168.0.4:8080/api/v1/expenses/generate',
        {
          method: "POST",
          body: JSON.stringify({ yearMonth }),
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate recurring expenses");
      }
    } catch (error) {
      console.error("Error generating recurring expenses:", error);
      throw error;
    }
  },
};
