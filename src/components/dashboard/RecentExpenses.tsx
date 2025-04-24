import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expenseService";
import { format } from 'date-fns';
import React from "react";

export function RecentExpenses() {
  const today = new Date();
  const yearMonth = format(today, 'yyyy-MM');
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', yearMonth],
    queryFn: () => expenseService.getExpenses(yearMonth),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
