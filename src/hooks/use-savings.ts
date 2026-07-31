import { useCallback, useEffect, useState } from 'react';
import { savingsService, SavingsGoal } from '@/services/savingsService';

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  const refresh = useCallback(() => setGoals(savingsService.getGoals()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(savingsService.EVENT, refresh);
    return () => window.removeEventListener(savingsService.EVENT, refresh);
  }, [refresh]);

  return { goals, refresh };
}

export function useSavingsGoal(id?: string) {
  const { goals } = useSavingsGoals();
  return goals.find((g) => g.id === id) ?? null;
}
