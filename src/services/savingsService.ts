export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface SavingsTransaction {
  id: string;
  goalId: string;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  description?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  status: GoalStatus;
  transactions: SavingsTransaction[];
}

const STORAGE_KEY = 'savings-goals';
const EVENT = 'savings-goals-updated';

const seed: SavingsGoal[] = [
  {
    id: 'seed-emergency',
    name: 'Emergency Fund',
    targetAmount: 30000,
    currentAmount: 6000,
    targetDate: '2026-12-01',
    status: 'IN_PROGRESS',
    transactions: [
      {
        id: 'seed-t1',
        goalId: 'seed-emergency',
        date: '2026-01-15',
        type: 'DEPOSIT',
        amount: 6000,
        description: 'Initial deposit',
      },
    ],
  },
  {
    id: 'seed-travel',
    name: 'Travel',
    targetAmount: 12000,
    currentAmount: 4500,
    targetDate: '2026-08-01',
    status: 'IN_PROGRESS',
    transactions: [
      {
        id: 'seed-t2',
        goalId: 'seed-travel',
        date: '2026-02-02',
        type: 'DEPOSIT',
        amount: 5000,
        description: 'Bonus',
      },
      {
        id: 'seed-t3',
        goalId: 'seed-travel',
        date: '2026-03-10',
        type: 'WITHDRAWAL',
        amount: 500,
        description: 'Visa fees',
      },
    ],
  },
];

function read(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as SavingsGoal[];
  } catch {
    return seed;
  }
}

function write(goals: SavingsGoal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  window.dispatchEvent(new Event(EVENT));
}

export const savingsService = {
  EVENT,
  getGoals: read,
  getGoal(id: string) {
    return read().find((g) => g.id === id) ?? null;
  },
  createGoal(input: { name: string; targetAmount: number; targetDate?: string; status: GoalStatus }) {
    const goal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name: input.name.trim(),
      targetAmount: input.targetAmount,
      targetDate: input.targetDate || undefined,
      status: input.status,
      currentAmount: 0,
      transactions: [],
    };
    write([...read(), goal]);
    return goal;
  },
  updateGoal(id: string, input: { name: string; targetAmount: number; targetDate?: string; status: GoalStatus }) {
    write(
      read().map((g) =>
        g.id === id
          ? { ...g, name: input.name.trim(), targetAmount: input.targetAmount, targetDate: input.targetDate || undefined, status: input.status }
          : g
      )
    );
  },
  addTransaction(goalId: string, type: 'DEPOSIT' | 'WITHDRAWAL', amount: number, description?: string) {
    write(
      read().map((g) => {
        if (g.id !== goalId) return g;
        const delta = type === 'DEPOSIT' ? amount : -amount;
        const tx: SavingsTransaction = {
          id: `tx-${Date.now()}`,
          goalId,
          date: new Date().toISOString(),
          type,
          amount,
          description: description?.trim() || undefined,
        };
        return { ...g, currentAmount: g.currentAmount + delta, transactions: [tx, ...g.transactions] };
      })
    );
  },
};

export const statusLabel: Record<GoalStatus, string> = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};
