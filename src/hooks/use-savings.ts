import { useCallback, useEffect, useState } from 'react';
import {
  SavingsGoal,
  SavingsTransaction,
  savingsGoalService,
  savingsTransactionService,
} from '@/services/savingsService';

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await savingsGoalService.getGoals();
      setGoals(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load savings goals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { goals, isLoading, error, refresh };
}

export function useSavingsGoalDetails(id?: string) {
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const details = await savingsGoalService.getGoalDetails(id);
      const txs = Array.isArray(details?.transactions) ? details.transactions : [];
      setGoal(details ? { ...details } : null);
      setTransactions(txs);
      const current = Number(details?.currentAmount);
      setBalance(
        Number.isFinite(current)
          ? current
          : txs.reduce(
              (sum, tx) => sum + (tx.type === 'DEPOSIT' ? Number(tx.amount) || 0 : -(Number(tx.amount) || 0)),
              0,
            ),
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load savings goal');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { goal, transactions, balance, isLoading, error, refresh };
}
