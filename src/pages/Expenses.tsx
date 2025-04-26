import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseHeader } from '@/components/expenses/ExpenseHeader';
import { ExpenseDeleteDialog } from '@/components/expenses/ExpenseDeleteDialog';
import { useToast } from '@/hooks/use-toast';
import { Expense, expenseService } from '@/services/expenseService';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const yearFromUrl = searchParams.get('year') || new Date().getFullYear().toString();
  const [selectedDate, setSelectedDate] = useState(() => {
    const currentDate = new Date();
    const year = parseInt(yearFromUrl);
    // Use current month but with the selected year
    return new Date(year, currentDate.getMonth(), 1);
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const { toast } = useToast();

  const selectedYearMonth = format(selectedDate, 'yyyy-MM');

  useEffect(() => {
    fetchExpenses(selectedYearMonth);
  }, [selectedYearMonth]);

  // Effect to update selectedDate when year parameter changes
  useEffect(() => {
    const year = parseInt(yearFromUrl);
    setSelectedDate(prevDate => {
      // Preserve the month but update the year
      return new Date(year, prevDate.getMonth(), 1);
    });
  }, [yearFromUrl]);

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
    const newDate = subMonths(selectedDate, 1);
    // Only allow months within the selected year
    if (newDate.getFullYear().toString() === yearFromUrl) {
      setSelectedDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = addMonths(selectedDate, 1);
    // Only allow months within the selected year
    if (newDate.getFullYear().toString() === yearFromUrl) {
      setSelectedDate(newDate);
    }
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
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(`/years`)}
              className="h-9 w-9"
            >
              <ChevronLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
              <p className="text-muted-foreground">Manage your monthly expenses for {yearFromUrl}</p>
            </div>
          </div>
        </header>
        
        <ExpenseHeader
          selectedDate={selectedDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingExpense(null);
          }}
          onAddExpense={handleAddExpense}
          editingExpense={editingExpense}
        />

        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onTogglePaid={handleTogglePaid}
        />

        <ExpenseDeleteDialog
          isOpen={!!deletingExpenseId}
          onOpenChange={(open) => !open && setDeletingExpenseId(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  );
};

export default Expenses;
