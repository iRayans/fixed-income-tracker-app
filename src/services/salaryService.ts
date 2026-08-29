
import { authService } from './authService';

const API_BASE = 'http://192.168.0.4:8080/api/v1';

export interface Salary {
  id?: number;
  amount: number;
  description: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export type SalaryInput = Omit<Salary, 'id'>;

export const salaryService = {
  async getSalaries(): Promise<Salary[]> {
    const response = await fetch(`${API_BASE}/salaries`, {
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch salaries');
    }

    return response.json();
  },

  /**
   * Returns the salary record effective on the given date (YYYY-MM-DD).
   * Returns null when no salary is effective for that date.
   */
  async getEffectiveSalary(date: string): Promise<Salary | null> {
    const response = await fetch(`${API_BASE}/salaries/effective?date=${date}`, {
      headers: authService.getAuthHeaders(),
    });

    if (response.status === 404 || response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch effective salary');
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as Salary) : null;
  },

  async createSalary(salary: SalaryInput): Promise<Salary> {
    const response = await fetch(`${API_BASE}/salaries`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salary),
    });

    if (!response.ok) {
      throw new Error('Failed to create salary');
    }

    return response.json();
  },

  async updateSalary(id: number, salary: Partial<SalaryInput>): Promise<Salary> {
    const response = await fetch(`${API_BASE}/salaries/${id}`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salary),
    });

    if (!response.ok) {
      throw new Error('Failed to update salary');
    }

    return response.json();
  },

  async deleteSalary(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/salaries/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete salary');
    }
  },
};
