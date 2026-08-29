
import React from 'react';
import { ExpenseDialog } from './ExpenseDialog';
import { ExpenseMonthSelector } from './ExpenseMonthSelector';
import { Expense } from '@/services/expenseService';
import { Button } from "@/components/ui/button";
import { Repeat } from 'lucide-react';

interface ExpenseHeaderProps {
    selectedDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    isDialogOpen: boolean;
    onDialogOpenChange: (open: boolean) => void;
    onAddExpense: (values: any) => void;
    onGenerateRecurring: () => void;
    editingExpense: Expense | null;
}

export const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({
    selectedDate,
    onPreviousMonth,
    onNextMonth,
    isDialogOpen,
    onDialogOpenChange,
    onAddExpense,
    onGenerateRecurring,
    editingExpense,
}) => {
    return (
        <header className="flex flex-col space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-sm text-muted-foreground">Manage your monthly expenses</p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={onGenerateRecurring}
                        className="gap-2 w-full sm:w-auto"
                    >
                        <Repeat className="h-4 w-4" />
                        Generate Recurring
                    </Button>
                    <ExpenseDialog
                        isOpen={isDialogOpen}
                        onOpenChange={onDialogOpenChange}
                        onSubmit={onAddExpense}
                        editingExpense={editingExpense}
                    />
                </div>
            </div>

            <ExpenseMonthSelector
                selectedDate={selectedDate}
                onPreviousMonth={onPreviousMonth}
                onNextMonth={onNextMonth}
            />
        </header>
    );
};

