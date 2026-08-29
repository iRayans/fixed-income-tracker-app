import { authService } from './authService';

const API_BASE = 'http://192.168.0.4:8080/api/v1';

export type AdjustmentType = 'BONUS' | 'DEDUCTION' | 'OVERTIME' | 'HOUSE_RENT_ALLOWANCE'| 'OTHER';

export interface SalaryAdjustment {
  id?: number;
  amount: number;
  date: string;
  yearMonth?: string;
  description?: string;
  type: AdjustmentType;
}

export type SalaryAdjustmentInput = Omit<SalaryAdjustment, 'id' | 'yearMonth'>;

export const salaryAdjustmentService = {
  async getAdjustments(): Promise<SalaryAdjustment[]> {
    const response = await fetch(`${API_BASE}/salary-adjustments`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch salary adjustments');
    return response.json();
  },

  async getAdjustmentsForMonth(yearMonth: string): Promise<SalaryAdjustment[]> {
    const response = await fetch(`${API_BASE}/salary-adjustments/month/${yearMonth}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch salary adjustments for month');
    return response.json();
  },

  async createAdjustment(adjustment: SalaryAdjustmentInput): Promise<SalaryAdjustment> {
    const response = await fetch(`${API_BASE}/salary-adjustments`, {
      method: 'POST',
      headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(adjustment),
    });
    if (!response.ok) throw new Error('Failed to create salary adjustment');
    return response.json();
  },

  async updateAdjustment(id: number, adjustment: Partial<SalaryAdjustmentInput>): Promise<SalaryAdjustment> {
    const response = await fetch(`${API_BASE}/salary-adjustments/${id}`, {
      method: 'PUT',
      headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(adjustment),
    });
    if (!response.ok) throw new Error('Failed to update salary adjustment');
    return response.json();
  },

  async deleteAdjustment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/salary-adjustments/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete salary adjustment');
  },
};