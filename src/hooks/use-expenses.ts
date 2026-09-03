import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Expense, expenseService } from '@/services/expenseService';

export const useExpenses = (selectedDate: Date) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const selectedYearMonth = format(selectedDate, 'yyyy-MM');

  // Guards against out-of-order responses: only the most recent request may
  // write to state, so a slow fetch for a previous month can never overwrite
  // the data of the month currently on screen.
  const latestRequest = useRef<string | null>(null);

  useEffect(() => {
    fetchExpenses(selectedYearMonth);
  }, [selectedYearMonth]);

  const fetchExpenses = async (yearMonth: string) => {
    latestRequest.current = yearMonth;
    setIsLoading(true);
    try {
      const data = await expenseService.getExpenses(yearMonth);
      if (latestRequest.current !== yearMonth) return;
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      if (latestRequest.current !== yearMonth) return;
      setExpenses([]);
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (latestRequest.current === yearMonth) setIsLoading(false);
    }
  };

  const handleAddOrUpdateExpense = async (values: any, editingExpense: Expense | null) => {
    try {
      if (editingExpense?.id) {
        const updatedExpense = await expenseService.updateExpense(editingExpense.id, {
          name: values.name,
          amount: values.amount,
          categoryId: parseInt(values.categoryId),
          description: values.description || "",
        });
        
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

        const createdExpense = await expenseService.createExpense(newExpense);
        setExpenses([...expenses, createdExpense]);
        
        toast({
          title: "Expense Added",
          description: "New expense has been added successfully.",
        });
      }
      return true;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await expenseService.deleteExpense(id);
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
      setExpenses(expenses.map(expense => 
        expense.id === id ? { ...expense, paid } : expense
      ));
      
      await expenseService.updateExpensePaidStatus(id, paid);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      toast({
        title: paid ? "Marked as Paid" : "Marked as Unpaid",
        description: `The expense has been marked as ${paid ? 'paid' : 'unpaid'}.`,
      });
    } catch (error) {
      setExpenses(expenses);
      console.error('Error updating expense paid status:', error);
      toast({
        title: "Error",
        description: "Failed to update expense status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRecurring = async () => {
    try {
      await expenseService.generateRecurringExpenses(selectedYearMonth);
      await fetchExpenses(selectedYearMonth);
      toast({
        title: "Success",
        description: "Recurring expenses generated successfully.",
      });
    } catch (error) {
      console.error('Error generating recurring expenses:', error);
      toast({
        title: "Error",
        description: "Failed to generate recurring expenses. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    expenses,
    isLoading,
    handleAddOrUpdateExpense,
    handleDelete,
    handleTogglePaid,
    handleGenerateRecurring,
    refetchExpenses: () => fetchExpenses(selectedYearMonth),
  };
};