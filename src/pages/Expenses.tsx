import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseDialog } from '@/components/expenses/ExpenseDialog';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Expense, expenseService } from '@/services/expenseService';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const { toast } = useToast();
  const currentDate = new Date();
  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    fetchExpenses(currentYearMonth);
  }, []);

  const fetchExpenses = async (yearMonth: string) => {
    try {
      // Use the expenseService to fetch expenses
      const data = await expenseService.getExpenses(yearMonth);
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

  const handleAddExpense = async (values: any) => {
    try {
      if (editingExpense) {
        const updatedExpenses = expenses.map(expense => 
          expense.id === editingExpense.id 
            ? {
                ...expense,
                name: values.name,
                amount: values.amount,
                categoryId: parseInt(values.categoryId),
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
          name: values.name,
          amount: values.amount,
          categoryId: parseInt(values.categoryId),
          yearMonth: currentYearMonth,
          bank: "Default Bank",
          paid: false,
          description: values.description || "",
          date: values.date.toISOString(),
        };

        // Call the API to create the expense
        const createdExpense = await expenseService.createExpense(newExpense);
        setExpenses([...expenses, createdExpense]);
        
        toast({
          title: "Expense Added",
          description: "New expense has been added successfully.",
        });
      }
      setIsDialogOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
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

  const handleTogglePaid = async (id: number, paid: boolean) => {
    try {
      // Optimistically update UI
      setExpenses(expenses.map(expense => 
        expense.id === id ? { ...expense, paid } : expense
      ));
      
      // Call API to update the expense
      await expenseService.updateExpensePaidStatus(id, paid);
      
      toast({
        title: paid ? "Marked as Paid" : "Marked as Unpaid",
        description: `The expense has been marked as ${paid ? 'paid' : 'unpaid'}.`,
      });
    } catch (error) {
      // Revert the change if the API call fails
      setExpenses(expenses);
      console.error('Error updating expense paid status:', error);
      toast({
        title: "Error",
        description: "Failed to update expense status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingExpenseId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingExpenseId) {
      handleDelete(deletingExpenseId);
      setDeletingExpenseId(null);
    }
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
          onDelete={handleDeleteClick}
          onTogglePaid={handleTogglePaid}
        />
      </div>

      <AlertDialog open={!!deletingExpenseId} onOpenChange={(open) => !open && setDeletingExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Expenses;
