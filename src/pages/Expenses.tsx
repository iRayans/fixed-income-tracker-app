import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
  { 
    id: "1", 
    name: "Apartment Rent", 
    amount: 1500, 
    categoryId: "1", 
    category: { id: 1, name: "Housing", description: "" },
    yearMonth: "2025-04",
    bank: "STCBank",
    paid: false,
    description: "Monthly rent payment", 
    recurringId: null 
  },
  { 
    id: "2", 
    name: "Car Payment", 
    amount: 400, 
    categoryId: "2", 
    category: { id: 2, name: "Transportation", description: "" },
    yearMonth: "2025-04",
    bank: "Al Rajhi",
    paid: true,
    description: "Car loan payment", 
    recurringId: null 
  },
  { 
    id: "3", 
    name: "Electric Bill", 
    amount: 120, 
    categoryId: "3", 
    category: { id: 3, name: "Utilities", description: "" },
    yearMonth: "2025-04",
    bank: "Samba",
    paid: false,
    description: "Monthly electricity", 
    recurringId: null 
  },
  { 
    id: "4", 
    name: "Internet", 
    amount: 80, 
    categoryId: "3", 
    category: { id: 3, name: "Utilities", description: "" },
    yearMonth: "2025-04",
    bank: "ANB",
    paid: true,
    description: "Broadband service", 
    recurringId: null 
  },
  { 
    id: "5", 
    name: "Health Insurance", 
    amount: 200, 
    categoryId: "4", 
    category: { id: 4, name: "Insurance", description: "" },
    yearMonth: "2025-04",
    bank: "SNB",
    paid: true,
    description: "Health coverage", 
    recurringId: null 
  },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const { toast } = useToast();

  const handleAddExpense = (values: any) => {
    if (editingExpense) {
      const updatedExpenses = expenses.map(expense => 
        expense.id === editingExpense.id 
          ? {
              ...expense,
              name: values.name,
              amount: values.amount,
              categoryId: values.categoryId,
              category: mockCategories.find(c => c.id === values.categoryId)?.name || "",
              date: values.date.toISOString().split('T')[0],
              description: values.description || "",
            }
          : expense
      );
      setExpenses(updatedExpenses);
      toast({
        title: "Expense Updated",
        description: "The expense has been updated successfully.",
      });
    } else {
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
      toast({
        title: "Expense Added",
        description: "New expense has been added successfully.",
      });
    }
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Expense Deleted",
      description: "The expense has been deleted successfully.",
    });
  };

  const handleOpenDialog = () => {
    setEditingExpense(null);
    setIsDialogOpen(true);
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
              <Button onClick={handleOpenDialog}>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                onSubmit={handleAddExpense} 
                categories={mockCategories}
                initialValues={editingExpense ? {
                  ...editingExpense,
                  date: new Date(editingExpense.yearMonth + "-01")
                } : undefined}
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
                <TableHead>Bank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.name}
                    {expense.recurringId && (
                      <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Recurring
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{expense.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell>{expense.bank}</TableCell>
                  <TableCell>
                    <div className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      expense.paid
                        ? "bg-green-500/15 text-green-500 border border-green-500/20"
                        : "bg-red-500/15 text-red-500 border border-red-500/20"
                    )}>
                      {expense.paid ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Paid
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Unpaid
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${typeof expense.amount === 'number' ? expense.amount.toLocaleString() : '0'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
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
