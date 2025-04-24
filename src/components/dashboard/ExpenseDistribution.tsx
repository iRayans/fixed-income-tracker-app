
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense } from '@/services/expenseService';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

interface ExpenseDistributionProps {
  data: ExpenseCategory[];
  isLoading?: boolean;
}

const COLORS = [
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

export function ExpenseDistribution({ data, isLoading }: ExpenseDistributionProps) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-muted-foreground">
            Expense Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse bg-muted h-64 w-64 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-muted-foreground">
          Expense Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend formatter={(value) => <span className="text-sm text-foreground">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
