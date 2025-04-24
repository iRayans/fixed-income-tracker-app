import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

// Mock data
const mockMonthlyData = [
  { name: 'Jan', expenses: 3100 },
  { name: 'Feb', expenses: 3000 },
  { name: 'Mar', expenses: 3200 },
  { name: 'Apr', expenses: 3400 },
  { name: 'May', expenses: 3300 },
  { name: 'Jun', expenses: 3500 },
  { name: 'Jul', expenses: 3200 },
  { name: 'Aug', expenses: 3100 },
  { name: 'Sep', expenses: 3300 },
  { name: 'Oct', expenses: 3400 },
  { name: 'Nov', expenses: 3500 },
  { name: 'Dec', expenses: 3600 },
];

const mockCategoryData = [
  { name: 'Housing', amount: 18000 },
  { name: 'Transportation', amount: 4800 },
  { name: 'Utilities', amount: 2400 },
  { name: 'Insurance', amount: 2400 },
  { name: 'Groceries', amount: 6000 },
  { name: 'Other', amount: 3600 },
];

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">View expense reports and trends</p>
          </div>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Trends</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">
              {reportType === 'monthly' ? 'Monthly Expense Trends' : 'Expenses by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {reportType === 'monthly' ? (
                  <BarChart
                    data={mockMonthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))' 
                      }}
                      formatter={(value: any) => [formatCurrency(Number(value))]}
                    />
                    <Legend />
                    <Bar dataKey="expenses" name="Total Expenses" fill="hsl(var(--primary))" />
                  </BarChart>
                ) : (
                  <BarChart
                    data={mockCategoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))' 
                      }}
                      formatter={(value: any) => [formatCurrency(Number(value))]}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Annual Amount" fill="hsl(var(--primary))" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
