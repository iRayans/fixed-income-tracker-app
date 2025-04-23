
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDate } from '@/lib/utils';

// Mock data
const mockCategories = [
  { id: "1", name: "Housing" },
  { id: "2", name: "Transportation" },
  { id: "3", name: "Utilities" },
  { id: "4", name: "Insurance" },
  { id: "5", name: "Groceries" },
  { id: "6", name: "Other" },
];

const mockExpenses = [
  { id: "1", name: "Apartment Rent", amount: 1500, categoryId: "1", category: "Housing", date: "2025-04-01", description: "Monthly rent payment", recurring: true },
  { id: "2", name: "Car Payment", amount: 400, categoryId: "2", category: "Transportation", date: "2025-04-05", description: "Car loan payment", recurring: true },
  { id: "3", name: "Electric Bill", amount: 120, categoryId: "3", category: "Utilities", date: "2025-04-10", description: "Monthly electricity", recurring: false },
  { id: "4", name: "Internet", amount: 80, categoryId: "3", category: "Utilities", date: "2025-04-15", description: "Broadband service", recurring: true },
  { id: "5", name: "Health Insurance", amount: 200, categoryId: "4", category: "Insurance", date: "2025-04-20", description: "Health coverage", recurring: true },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddExpense = (values: any) => {
    const newExpense = {
      id: `${expenses.length + 1}`,
      name: values.name,
      amount: values.amount,
      categoryId: values.categoryId,
      category: mockCategories.find(c => c.id === values.categoryId)?.name || "",
      date: values.date.toISOString().split('T')[0],
      description: values.description || "",
      recurring: false,
    };

    setExpenses([...expenses, newExpense]);
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Manage your monthly expenses</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                onSubmit={handleAddExpense} 
                categories={mockCategories} 
              />
            </DialogContent>
          </Dialog>
        </header>

        <div className="rounded-lg border border-border/40 backdrop-blur-sm">
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
                        <Calendar className="mr-1 h-3 w-3" />
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
        </div>
      </div>
    </AppLayout>
  );
};

export default Expenses;
