
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { RecurringExpenseForm } from '@/components/expenses/RecurringExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";

// Mock data
const mockCategories = [
  { id: "1", name: "Housing" },
  { id: "2", name: "Transportation" },
  { id: "3", name: "Utilities" },
  { id: "4", name: "Insurance" },
  { id: "5", name: "Groceries" },
  { id: "6", name: "Other" },
];

const mockRecurringExpenses = [
  { id: "1", name: "Apartment Rent", amount: 1500, categoryId: "1", category: "Housing", dueDay: 1, description: "Monthly rent payment" },
  { id: "2", name: "Car Payment", amount: 400, categoryId: "2", category: "Transportation", dueDay: 5, description: "Car loan payment" },
  { id: "3", name: "Internet", amount: 80, categoryId: "3", category: "Utilities", dueDay: 15, description: "Broadband service" },
  { id: "4", name: "Health Insurance", amount: 200, categoryId: "4", category: "Insurance", dueDay: 20, description: "Health coverage" },
];

const RecurringExpenses = () => {
  const [recurringExpenses, setRecurringExpenses] = useState(mockRecurringExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddRecurringExpense = (values: any) => {
    const newRecurringExpense = {
      id: `${recurringExpenses.length + 1}`,
      name: values.name,
      amount: values.amount,
      categoryId: values.categoryId,
      category: mockCategories.find(c => c.id === values.categoryId)?.name || "",
      dueDay: values.dueDay,
      description: values.description || "",
    };

    setRecurringExpenses([...recurringExpenses, newRecurringExpense]);
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recurring Expenses</h1>
            <p className="text-muted-foreground">Manage your recurring monthly expenses</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Recurring Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Recurring Expense</DialogTitle>
              </DialogHeader>
              <RecurringExpenseForm 
                onSubmit={handleAddRecurringExpense} 
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
                <TableHead>Due Day</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    {expense.name}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.dueDay}<sup>th</sup> of each month</TableCell>
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

export default RecurringExpenses;
