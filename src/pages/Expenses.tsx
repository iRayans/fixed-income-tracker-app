
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseDialog } from '@/components/expenses/ExpenseDialog';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { useToast } from '@/hooks/use-toast';
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
          <ExpenseDialog
            isOpen={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingExpense(null);
            }}
            onSubmit={handleAddExpense}
            editingExpense={editingExpense}
          />
        </header>

        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AppLayout>
  );
};

export default Expenses;
