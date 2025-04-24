
import { authService } from './authService';

export interface Salary {
  id?: number;
  amount: number;
  description: string;
  isActive: boolean;
}

export const salaryService = {
  async getSalaries(): Promise<Salary[]> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/salaries', {
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch salaries');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching salaries:', error);
      throw error;
    }
  },

  async getSalary(): Promise<Salary> {
    try {
      const salaries = await this.getSalaries();
      // Return the first active salary or a default one if none exists
      const activeSalary = salaries.find(salary => salary.isActive) || salaries[0];
      
      if (!activeSalary) {
        return {
          amount: 0,
          description: '',
          isActive: true
        };
      }
      
      return activeSalary;
    } catch (error) {
      console.error('Error fetching active salary:', error);
      throw error;
    }
  },

  async createSalary(salary: Omit<Salary, 'id'>): Promise<Salary> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/salaries', {
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
    } catch (error) {
      console.error('Error creating salary:', error);
      throw error;
    }
  },

  async updateSalary(id: number, salary: Omit<Partial<Salary>, 'id'>): Promise<Salary> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/salaries/${id}`, {
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
    } catch (error) {
      console.error('Error updating salary:', error);
      throw error;
    }
  },

  async deleteSalary(id: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/salaries/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete salary');
      }
    } catch (error) {
      console.error('Error deleting salary:', error);
      throw error;
    }
  },
};
