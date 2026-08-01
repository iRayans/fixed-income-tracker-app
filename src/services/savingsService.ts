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
  yearMonth?: string;
}

export interface SavingsMonthlyTotals {
  totalDeposits: number;
  totalWithdrawals: number;
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
  update: (id: string | number, payload: CreateTransactionPayload) =>
    request<SavingsTransaction>(`/savings-transactions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id: string | number) => request<void>(`/savings-transactions/${id}`, { method: 'DELETE' }),
};

function transactionMonth(tx: SavingsTransaction): string | undefined {
  if (tx.yearMonth) return tx.yearMonth.slice(0, 7);
  const raw = tx.date ?? tx.createdAt;
  return raw ? raw.slice(0, 7) : undefined;
}

export const savingsSummaryService = {
  /** Aggregates savings deposits/withdrawals for a given month (yyyy-MM) across all goals. */
  async getMonthlyTotals(yearMonth: string): Promise<SavingsMonthlyTotals> {
    const goals = await savingsGoalService.getGoals();
    const lists = await Promise.all(
      (Array.isArray(goals) ? goals : []).map((goal) =>
        savingsTransactionService.getByGoal(goal.id).catch(() => [] as SavingsTransaction[]),
      ),
    );

    return lists.flat().reduce<SavingsMonthlyTotals>(
      (acc, tx) => {
        if (transactionMonth(tx) !== yearMonth) return acc;
        const amount = Number(tx.amount) || 0;
        if (tx.type === 'DEPOSIT') acc.totalDeposits += amount;
        else acc.totalWithdrawals += amount;
        return acc;
      },
      { totalDeposits: 0, totalWithdrawals: 0 },
    );
  },
};

export const statusLabel: Record<GoalStatus, string> = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};
