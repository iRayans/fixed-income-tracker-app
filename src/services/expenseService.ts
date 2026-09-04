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
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);
    try {
      console.info(`[expenses] ${date} requesting...`);
      const response = await fetch(
        `http://192.168.0.4:8080/api/v1/expenses/${date}`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
          signal: controller.signal,
        }
      );

      console.info(`[expenses] ${date} headers received: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch expenses (${response.status})`);
      }

      // Read as text first: if the server never terminates the body, this is
      // where it hangs — and the abort timeout turns it into a real error
      // instead of an infinite loading state.
      const raw = await response.text();
      console.info(
        `[expenses] ${date} body received: ${raw.length} chars in ${Math.round(performance.now() - startedAt)}ms`
      );

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          `Server returned an incomplete/invalid JSON response (${raw.length} chars). This usually means the backend failed while serializing this month's expenses.`
        );
      }

      const list: Expense[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      console.info(
        `[expenses] ${date} -> ${list.length} items in ${Math.round(performance.now() - startedAt)}ms`,
        Array.isArray(data) ? "array" : typeof data
      );


      return list
        .filter((expense) => expense && expense.id != null)
        .map((expense) => ({
          ...expense,
          id: Number(expense.id),
          name: expense.name ?? '',
          description: expense.description ?? '',
          bank: expense.bank ?? '',
          amount: Number(expense.amount) || 0,
          categoryId: expense.categoryId ?? expense.category?.id ?? 0,
          recurringId: expense.recurringId ?? null,
          paid: Boolean(expense.paid),
        }));
    } catch (error) {
      console.error(
        `[expenses] ${date} failed after ${Math.round(performance.now() - startedAt)}ms`,
        error
      );
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(
          `The server accepted the request but never finished sending the response for ${date} (timed out after 20s). The backend is likely failing mid-serialization for this month.`
        );
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }



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
