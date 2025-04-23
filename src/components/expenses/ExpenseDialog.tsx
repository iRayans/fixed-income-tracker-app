
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Expense } from '@/services/expenseService';
import { Plus } from 'lucide-react';

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
  const mockCategories = [
    { id: "1", name: "Food" },
    { id: "2", name: "Transportation" },
    { id: "3", name: "Entertainment" },
    { id: "4", name: "Bills" },
    { id: "5", name: "Other" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => onOpenChange(true)}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <ExpenseForm 
          onSubmit={onSubmit} 
          categories={mockCategories}
          initialValues={editingExpense}
        />
      </DialogContent>
    </Dialog>
  );
};
