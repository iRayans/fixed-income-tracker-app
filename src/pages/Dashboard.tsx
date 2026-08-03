
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SalarySummary } from '@/components/dashboard/SalarySummary';
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { ExpenseMonthSelector } from '@/components/expenses/ExpenseMonthSelector';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { summaryService } from '@/services/summaryService';
import { expenseService } from '@/services/expenseService';
import { savingsSummaryService } from '@/services/savingsService';
import { toast } from 'sonner';
import { useSelectedMonth } from '@/hooks/use-selected-month';

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedDate, yearMonth, goToPreviousMonth, goToNextMonth } = useSelectedMonth();
  const currentDate = yearMonth;
  
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['summary', currentDate],
    queryFn: () => summaryService.getSummary(currentDate),
    meta: {
      onError: () => {
        toast.error('Failed to load summary data');
      }
    }
  });

  const { data: expenses, isLoading: isExpensesLoading } = useQuery({
    queryKey: ['expenses', currentDate],
    queryFn: () => expenseService.getExpenses(currentDate),
    meta: {
      onError: () => {
        toast.error('Failed to load expenses');
      }
    }
  });

  const { data: savingsTotals } = useQuery({
    queryKey: ['savings-monthly', currentDate],
    queryFn: () => savingsSummaryService.getMonthlyTotals(currentDate),
    meta: {
      onError: () => {
        toast.error('Failed to load savings totals');
      }
    }
  });

  // Process expense data for the donut chart
  const expenseDistributionData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const cleanLabel = (name: string) =>
      name.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').trim() || 'Uncategorized';

    const categoryMap = new Map<string, number>();

    expenses.forEach(expense => {
      const rawName = expense.category?.name || 'Uncategorized';
      const categoryName = cleanLabel(rawName);
      // Savings are not expenses
      if (/saving/i.test(categoryName)) return;
      const amount = Number(expense.amount) || 0;
      if (amount <= 0) return;
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
    });

    const colors = [
      "#8b5cf6", // Purple
      "#3b82f6", // Blue
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#ef4444", // Red
      "#ec4899", // Pink
      "#6b7280", // Gray (Others)
    ];

    const sorted = Array.from(categoryMap.entries())
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1]);

    const top = sorted.slice(0, 6);
    const rest = sorted.slice(6);

    const result: { name: string; value: number; color: string; breakdown?: { name: string; value: number }[] }[] =
      top.map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }));

    if (rest.length > 0) {
      const othersTotal = rest.reduce((sum, [, value]) => sum + value, 0);
      const breakdown = rest.map(([name, value]) => ({ name, value }));
      const existingOthers = result.find(item => item.name === 'Others');
      if (existingOthers) {
        existingOthers.value += othersTotal;
        existingOthers.breakdown = [...(existingOthers.breakdown ?? []), ...breakdown];
      } else {
        result.push({ name: 'Others', value: othersTotal, color: colors[6], breakdown });
      }
    }

    return result;
  }, [expenses]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/years')}
              className="h-9 w-9"
            >
              <ChevronLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your salary and expenses</p>
            </div>
          </div>
        </header>

        <ExpenseMonthSelector
          selectedDate={selectedDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {isSummaryLoading ? (
              <div className="animate-pulse bg-muted h-[300px] rounded-lg" />
            ) : (
              <SalarySummary 
                salary={summaryData?.salary ?? 0}
                totalExpenses={summaryData?.totalExpenses ?? 0}
                totalDeposits={savingsTotals?.totalDeposits ?? 0}
                totalWithdrawals={savingsTotals?.totalWithdrawals ?? 0}
                date={format(selectedDate, 'MMMM yyyy')}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <ExpenseDistribution 
              data={expenseDistributionData}
              isLoading={isExpensesLoading}
            />
          </div>
        </div>

        <div className="mt-8">
          <RecentExpenses 
            expenses={expenses || []} 
            isLoading={isExpensesLoading} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
