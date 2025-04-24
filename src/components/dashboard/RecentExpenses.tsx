
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expenseService";
import { format } from 'date-fns';

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
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground">No expenses found</p>
          ) : (
            displayExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{expense.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category?.name || 'Uncategorized'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium leading-none">${expense.amount}</p>
                  <p className="text-sm text-muted-foreground">
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
