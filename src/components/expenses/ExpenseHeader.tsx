
import React from 'react';
import { ExpenseDialog } from './ExpenseDialog';
import { ExpenseMonthSelector } from './ExpenseMonthSelector';
import { Expense } from '@/services/expenseService';

interface ExpenseHeaderProps {
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onAddExpense: (values: any) => void;
  editingExpense: Expense | null;
}

export const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  isDialogOpen,
  onDialogOpenChange,
  onAddExpense,
  editingExpense,
}) => {
  return (
    <header className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Manage your monthly expenses</p>
        </div>
        <ExpenseDialog
          isOpen={isDialogOpen}
          onOpenChange={onDialogOpenChange}
          onSubmit={onAddExpense}
          editingExpense={editingExpense}
        />
      </div>
      
      <ExpenseMonthSelector
        selectedDate={selectedDate}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />
    </header>
  );
};
