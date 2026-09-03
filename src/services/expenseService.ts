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
    try {
      const response = await fetch(
        `http://192.168.0.4:8080/api/v1/expenses/${date}`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
          // Lambda cold starts can be slow; allow plenty of time before aborting.
          signal: AbortSignal.timeout(60000),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch expenses for ${date} (HTTP ${response.status})`
        );
      }

      // Read as text first so a malformed body (NaN, Infinity, truncated JSON,
      // an HTML error page with a 200 status…) produces a precise error instead
      // of a generic "Unexpected token" that hides which month/what broke.
      const raw = await response.text();
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch (parseError) {
        console.error(`[expenses] GET ${date} returned a non-JSON body:`, raw.slice(0, 500));
        throw new Error(
          `Invalid JSON in response for ${date}: ${(parseError as Error).message}`
        );
      }

      if (import.meta.env.DEV) {
        console.debug(
          `[expenses] GET ${date} -> ${Array.isArray(data) ? `${data.length} item(s)` : typeof data}`,
          data
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          `Unexpected response shape for ${date}: expected an array, got ${
            data === null ? 'null' : typeof data
          }`
        );
      }
      return data as Expense[];
    } catch (error) {
      console.error("Error fetching expenses:", error);
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
