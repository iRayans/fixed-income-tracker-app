
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

interface ExpenseDistributionProps {
  data: ExpenseCategory[];
}

export function ExpenseDistribution({ data }: ExpenseDistributionProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-muted-foreground">
          Expense Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              />
              <Legend formatter={(value) => <span className="text-sm text-foreground">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
