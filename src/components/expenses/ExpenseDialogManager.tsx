
import React, { useState } from 'react';
import { Expense } from '@/services/expenseService';
import { ExpenseDialog } from './ExpenseDialog';
import { ExpenseDeleteDialog } from './ExpenseDeleteDialog';

interface ExpenseDialogManagerProps {
  onAddOrUpdateExpense: (values: any, editingExpense: Expense | null) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
}

export const ExpenseDialogManager: React.FC<ExpenseDialogManagerProps> = ({
  onAddOrUpdateExpense,
  onDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);

  const handleAddExpense = async (values: any) => {
    const success = await onAddOrUpdateExpense(values, editingExpense);
    if (success) {
      setIsDialogOpen(false);
      setEditingExpense(null);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingExpenseId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingExpenseId) {
      await onDelete(deletingExpenseId);
      setDeletingExpenseId(null);
    }
  };

  return {
    isDialogOpen,
    editingExpense,
    handleEdit,
    handleDeleteClick,
    handleAddExpense,
    dialogProps: {
      isOpen: isDialogOpen,
      onOpenChange: (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) setEditingExpense(null);
      },
      onSubmit: handleAddExpense,
      editingExpense,
    },
    deleteDialogProps: {
      isOpen: !!deletingExpenseId,
      onOpenChange: (open: boolean) => !open && setDeletingExpenseId(null),
      onConfirm: handleConfirmDelete,
    },
  };
};
