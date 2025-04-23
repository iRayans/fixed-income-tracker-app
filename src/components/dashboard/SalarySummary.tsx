
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SalarySummaryProps {
  salary: number;
  totalExpenses: number;
  date: string;
}

export function SalarySummary({ salary, totalExpenses, date }: SalarySummaryProps) {
  const remaining = salary - totalExpenses;
  const percentSpent = (totalExpenses / salary) * 100;
  
  return (
    <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-muted-foreground">{date} Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Salary</span>
            <span className="font-semibold">${salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Expenses</span>
            <span className="font-semibold text-destructive">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Remaining</span>
            <span className={`font-semibold ${remaining >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              ${remaining.toLocaleString()}
            </span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Budget Used</span>
              <span className="text-sm font-medium">{Math.min(100, percentSpent).toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(100, percentSpent)} 
              className="h-2" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
