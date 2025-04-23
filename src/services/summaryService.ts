
import { authService } from './authService';

interface SummaryData {
  salary: number;
  totalExpenses: number;
  remaining: number;
  date: string;
}

export const summaryService = {
  async getSummary(date: string): Promise<SummaryData> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/summary/${date}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching summary:', error);
      throw error;
    }
  },
};
