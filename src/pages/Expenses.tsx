import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Expense } from '@/services/expenseService';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();
  const currentDate = new Date();
  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    fetchExpenses(currentYearMonth);
  }, []);

  const fetchExpenses = async (yearMonth: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/expenses/${yearMonth}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = (values: any) => {
    if (editingExpense) {
      const updatedExpenses = expenses.map(expense => 
        expense.id === editingExpense.id 
          ? {
              ...expense,
              name: values.name,
              amount: values.amount,
              categoryId: values.categoryId,
              category: values.category,
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
      const newExpense: Expense = {
        id: Math.floor(Math.random() * 1000),
        name: values.name,
        amount: values.amount,
        categoryId: values.categoryId,
        category: values.category,
        yearMonth: currentYearMonth,
        bank: values.bank || "Default Bank",
        paid: false,
        description: values.description || "",
        recurringId: null,
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

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Expense Deleted",
      description: "The expense has been deleted successfully.",
    });
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
              <Button onClick={() => {
                setEditingExpense(null);
                setIsDialogOpen(true);
              }}>
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                onSubmit={handleAddExpense} 
                categories={[]}
                initialValues={editingExpense}
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
                  <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
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
