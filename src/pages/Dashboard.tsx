
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

  // Process expense data for the pie chart
  const expenseDistributionData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    
    // Create a map to group expenses by category
    const categoryMap = new Map();
    
    expenses.forEach(expense => {
      const categoryName = expense.category?.name || 'Uncategorized';
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + expense.amount);
    });
    
    // Generate colors for each category
    const colors = [
      "#8b5cf6", // Purple
      "#3b82f6", // Blue
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#ef4444", // Red
      "#ec4899", // Pink
      "#6366f1", // Indigo
      "#14b8a6", // Teal
      "#f97316", // Orange
      "#6b7280", // Gray
    ];
    
    // Convert map to array format needed for the chart
    let index = 0;
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: colors[index++ % colors.length]
    }));
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
