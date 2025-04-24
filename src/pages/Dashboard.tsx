
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { SalarySummary } from '@/components/dashboard/SalarySummary';
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { summaryService } from '@/services/summaryService';
import { expenseService } from '@/services/expenseService';
import { toast } from 'sonner';

const Dashboard = () => {
  const currentDate = format(new Date(), 'yyyy-MM');
  
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
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your salary and expenses</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {isSummaryLoading ? (
              <div className="animate-pulse bg-muted h-[300px] rounded-lg" />
            ) : (
              <SalarySummary 
                salary={summaryData?.salary ?? 0}
                totalExpenses={summaryData?.totalExpenses ?? 0}
                date={format(new Date(), 'MMMM yyyy')}
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
