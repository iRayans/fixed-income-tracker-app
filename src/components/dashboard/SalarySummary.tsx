
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { EuroIcon } from "lucide-react";

interface SalarySummaryProps {
  salary: number;
  totalExpenses: number;
  date: string;
}

export function SalarySummary({ salary, totalExpenses, date }: SalarySummaryProps) {
  const remaining = salary - totalExpenses;
  const percentSpent = (totalExpenses / salary) * 100;
  
  return (
    <Card className="bg-gradient-to-br from-background via-background to-background/90 border border-border/50 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <EuroIcon className="h-5 w-5 text-primary" />
          {date} Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-sm font-medium">Salary</span>
              <span className="font-semibold text-primary">{formatCurrency(salary)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <span className="text-sm font-medium">Total Expenses</span>
              <span className="font-semibold text-destructive">{formatCurrency(totalExpenses)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border">
              <span className="text-sm font-medium">Remaining</span>
              <span className={`font-semibold ${remaining >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Budget Used</span>
              <span className="text-sm font-semibold">{Math.min(100, percentSpent).toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(100, percentSpent)} 
              className="h-2 bg-secondary"
              indicatorClassName={percentSpent > 90 ? 'bg-destructive' : percentSpent > 70 ? 'bg-orange-500' : 'bg-primary'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
