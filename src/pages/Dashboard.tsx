
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SalarySummary } from '@/components/dashboard/SalarySummary';
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';

// Mock data
const mockSalary = 5000;
const mockExpenses = 3200;
const mockDate = "April 2025";

const mockChartData = [
  { name: "Rent", value: 1500, color: "#8b5cf6" },
  { name: "Car Loan", value: 400, color: "#ec4899" },
  { name: "Insurance", value: 200, color: "#10b981" },
  { name: "Utilities", value: 300, color: "#3b82f6" },
  { name: "Groceries", value: 500, color: "#f59e0b" },
  { name: "Other", value: 300, color: "#6b7280" },
];

const mockRecentExpenses = [
  { id: "1", name: "Apartment Rent", amount: 1500, category: "Housing", date: "2025-04-01", recurring: true },
  { id: "2", name: "Car Payment", amount: 400, category: "Transportation", date: "2025-04-05", recurring: true },
  { id: "3", name: "Electric Bill", amount: 120, category: "Utilities", date: "2025-04-10", recurring: false },
  { id: "4", name: "Internet", amount: 80, category: "Utilities", date: "2025-04-15", recurring: true },
  { id: "5", name: "Health Insurance", amount: 200, category: "Insurance", date: "2025-04-20", recurring: true },
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your salary and expenses</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SalarySummary 
              salary={mockSalary} 
              totalExpenses={mockExpenses} 
              date={mockDate} 
            />
          </div>

          <div className="md:col-span-2">
            <ExpenseDistribution data={mockChartData} />
          </div>
        </div>

        <div className="mt-8">
          <RecentExpenses expenses={mockRecentExpenses} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
