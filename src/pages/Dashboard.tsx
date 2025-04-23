
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { SalarySummary } from '@/components/dashboard/SalarySummary';
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { summaryService } from '@/services/summaryService';
import { toast } from 'sonner';

// Temporary mock data until we implement these endpoints
const mockChartData = [
  { name: "Rent", value: 1500, color: "#8b5cf6" },
  { name: "Utilities", value: 300, color: "#3b82f6" },
  { name: "Groceries", value: 500, color: "#f59e0b" },
  { name: "Other", value: 300, color: "#6b7280" },
];

const mockExpenses = [
  { id: "1", name: "Rent", amount: 1500, category: "Housing", date: "2025-04-01", recurring: true },
  { id: "2", name: "Utilities", amount: 120, category: "Utilities", date: "2025-04-10", recurring: false },
];

const Dashboard = () => {
  const currentDate = format(new Date(), 'yyyy-MM');
  
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['summary', currentDate],
    queryFn: () => summaryService.getSummary(currentDate),
    meta: {
      onError: () => {
        toast.error('Failed to load summary data');
      }
    }
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your salary and expenses</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {isLoading ? (
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
            <ExpenseDistribution data={mockChartData} />
          </div>
        </div>

        <div className="mt-8">
          <RecentExpenses expenses={mockExpenses} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
