
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Expense } from '@/services/expenseService';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <ExpenseForm 
          onSubmit={onSubmit} 
          categories={[]}
          initialValues={editingExpense}
        />
      </DialogContent>
    </Dialog>
  );
};
