import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expenseService";
import { format } from 'date-fns';
import { formatCurrency } from "@/lib/utils";

interface Expense {
  id: number;
  name: string;
  amount: number;
  paid: boolean;
  category?: {
    name: string;
  };
}

interface RecentExpensesProps {
  expenses?: Expense[];
  isLoading?: boolean;
}

export function RecentExpenses({ expenses, isLoading }: RecentExpensesProps = {}) {
  const today = new Date();
  const yearMonth = format(today, 'yyyy-MM');
  
  // Use the passed expenses prop if provided, otherwise fetch them
  const { data: fetchedExpenses = [] } = useQuery({
    queryKey: ['expenses', yearMonth],
    queryFn: () => expenseService.getExpenses(yearMonth),
    enabled: !expenses, // Only fetch if expenses prop is not provided
  });

  // Use provided expenses or the fetched ones
  const displayExpenses = expenses || fetchedExpenses;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse h-8 bg-secondary rounded"></div>
            <div className="animate-pulse h-8 bg-secondary rounded"></div>
            <div className="animate-pulse h-8 bg-secondary rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Expenses</CardTitle>
        <CardDescription>Your latest expenses</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="divide-y divide-border/40">
          {displayExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No expenses found</p>
          ) : (
            displayExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium leading-tight truncate">{expense.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {expense.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium leading-tight">{formatCurrency(expense.amount)}</p>
                  <p className={`text-xs ${expense.paid ? 'text-green-500' : 'text-red-500'}`}>
                    {expense.paid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

