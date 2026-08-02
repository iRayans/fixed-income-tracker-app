
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseHeader } from '@/components/expenses/ExpenseHeader';
import { ExpenseDeleteDialog } from '@/components/expenses/ExpenseDeleteDialog';
import { useExpenses } from '@/hooks/use-expenses';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { ExpenseDialogManager } from '@/components/expenses/ExpenseDialogManager';
import { useSelectedMonth } from '@/hooks/use-selected-month';

const Expenses = () => {
  const navigate = useNavigate();
  const { selectedDate, goToPreviousMonth, goToNextMonth } = useSelectedMonth();

  const {
    expenses,
    handleAddOrUpdateExpense,
    handleDelete,
    handleTogglePaid,
    handleGenerateRecurring
  } = useExpenses(selectedDate);

  const {
    dialogProps,
    deleteDialogProps,
    handleEdit,
    handleDeleteClick,
  } = ExpenseDialogManager({
    onAddOrUpdateExpense: handleAddOrUpdateExpense,
    onDelete: handleDelete,
  });

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(`/years?redirect=expenses`)}
          >
            <ChevronLeft size={16} />
            <span>All Years</span>
          </Button>
        </div>
        
        <div className="glass-morphism rounded-lg p-6 shadow-lg animate-scale-in">
          <ExpenseHeader
            selectedDate={selectedDate}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onGenerateRecurring={handleGenerateRecurring}
            isDialogOpen={dialogProps.isOpen}
            onDialogOpenChange={dialogProps.onOpenChange}
            onAddExpense={dialogProps.onSubmit}
            editingExpense={dialogProps.editingExpense}
          />
        </div>

        <div className="card-hover bg-card rounded-lg shadow border border-border/40 p-1 animate-slide-up">
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onTogglePaid={handleTogglePaid}
          />
        </div>

        <ExpenseDeleteDialog {...deleteDialogProps} />
      </div>
    </AppLayout>
  );
};

export default Expenses;
