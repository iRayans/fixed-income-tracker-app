
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { SalarySummary } from '@/components/dashboard/SalarySummary';
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { summaryService } from '@/services/summaryService';
import { toast } from 'sonner';

const Dashboard = () => {
  const currentDate = format(new Date(), 'yyyy-MM');
  
  const { data: summaryData, isLoading, error } = useQuery({
    queryKey: ['summary', currentDate],
    queryFn: () => summaryService.getSummary(currentDate),
    onError: (err) => {
      toast.error('Failed to load summary data');
      console.error('Error loading summary:', err);
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
