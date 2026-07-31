import { authService } from './authService';

const API_BASE = 'http://localhost:8080/api/v1';

export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  status: GoalStatus;
}

export interface SavingsTransaction {
  id: number;
  goalId: number;
  amount: number;
  type: TransactionType;
  description?: string;
  date?: string;
  createdAt?: string;
}

export interface CreateGoalPayload {
  name: string;
  targetAmount: number;
  status: GoalStatus;
  targetDate?: string;
}

export interface CreateTransactionPayload {
  goalId: number;
  amount: number;
  type: TransactionType;
  description?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: authService.getAuthHeaders(),
    ...init,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authService.handleTokenExpiration();
    }
    const message = await response.text().catch(() => '');
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const savingsGoalService = {
  getGoals: () => request<SavingsGoal[]>('/savings-goals'),
  getGoal: (id: string | number) => request<SavingsGoal>(`/savings-goals/${id}`),
  createGoal: (payload: CreateGoalPayload) =>
    request<SavingsGoal>('/savings-goals', { method: 'POST', body: JSON.stringify(payload) }),
  deleteGoal: (id: string | number) => request<void>(`/savings-goals/${id}`, { method: 'DELETE' }),
};

export const savingsTransactionService = {
  getByGoal: (goalId: string | number) => request<SavingsTransaction[]>(`/savings-transactions/goal/${goalId}`),
  getBalance: async (goalId: string | number) => {
    const result = await request<number | { balance: number }>(`/savings-transactions/goal/${goalId}/balance`);
    return typeof result === 'number' ? result : Number(result?.balance ?? 0);
  },
  create: (payload: CreateTransactionPayload) =>
    request<SavingsTransaction>('/savings-transactions', { method: 'POST', body: JSON.stringify(payload) }),
  remove: (id: string | number) => request<void>(`/savings-transactions/${id}`, { method: 'DELETE' }),
};

export const statusLabel: Record<GoalStatus, string> = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};
