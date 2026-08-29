
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Plus } from 'lucide-react';
import { Expense } from '@/services/expenseService';
import { useQuery } from '@tanstack/react-query';
import { categoryService, Category } from '@/services/categoryService';

interface ExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => void;
  editingExpense: Expense | null;
}

export const ExpenseDialog: React.FC<ExpenseDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  editingExpense
}) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    enabled: isOpen, // lazy: only fetch when the Add/Edit dialog is open
    staleTime: 5 * 60 * 1000, // reuse fresh cache for 5 minutes
  });

  // Convert categories to match the expected format in ExpenseForm
  const formattedCategories = categories.map(category => ({
    id: String(category.id), // Convert number to string
    name: category.name
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => onOpenChange(true)}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <ExpenseForm 
          onSubmit={onSubmit} 
          categories={formattedCategories}
          initialValues={editingExpense}
        />
      </DialogContent>
    </Dialog>
  );
};

