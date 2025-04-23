
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/lib/utils';
import { Expense } from '@/services/expenseService';

interface RecentExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function RecentExpenses({ expenses, isLoading }: RecentExpensesProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-muted-foreground">
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.name}
                    {expense.recurring && (
                      <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Recurring
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
