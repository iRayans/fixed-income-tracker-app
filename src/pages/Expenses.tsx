import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseDialog } from '@/components/expenses/ExpenseDialog';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Expense, expenseService } from '@/services/expenseService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const { toast } = useToast();

  const selectedYearMonth = format(selectedDate, 'yyyy-MM');

  useEffect(() => {
    fetchExpenses(selectedYearMonth);
  }, [selectedYearMonth]);

  const fetchExpenses = async (yearMonth: string) => {
    try {
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

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleAddExpense = async (values: any) => {
    try {
      if (editingExpense?.id) {
        // Call API to update the expense
        const updatedExpense = await expenseService.updateExpense(editingExpense.id, {
          name: values.name,
          amount: values.amount,
          categoryId: parseInt(values.categoryId),
          description: values.description || "",
        });
        
        // Update the expenses state with the returned data from the API
        setExpenses(expenses.map(expense => 
          expense.id === editingExpense.id ? updatedExpense : expense
        ));
        
        toast({
          title: "Expense Updated",
          description: "The expense has been updated successfully.",
        });
      } else {
        const newExpense = {
          name: values.name,
          amount: values.amount,
          categoryId: parseInt(values.categoryId),
          yearMonth: selectedYearMonth,
          bank: "Default Bank",
          paid: false,
          description: values.description || "",
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

  const handleDelete = async (id: number) => {
    try {
      // Call API to delete the expense
      await expenseService.deleteExpense(id);
      
      // Update the UI by removing the deleted expense
      setExpenses(expenses.filter(expense => expense.id !== id));
      
      toast({
        title: "Expense Deleted",
        description: "The expense has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      });
    }
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
        <header className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
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
          </div>
          
          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-lg">
            <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
