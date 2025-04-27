
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseHeader } from '@/components/expenses/ExpenseHeader';
import { ExpenseDeleteDialog } from '@/components/expenses/ExpenseDeleteDialog';
import { useExpenses } from '@/hooks/use-expenses';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { ExpenseDialogManager } from '@/components/expenses/ExpenseDialogManager';

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const yearFromUrl = searchParams.get('year') || new Date().getFullYear().toString();
  const [selectedDate, setSelectedDate] = useState(() => {
    const currentDate = new Date();
    const year = parseInt(yearFromUrl);
    return new Date(year, currentDate.getMonth(), 1);
  });

  // Effect to update selectedDate when year parameter changes
  useEffect(() => {
    const year = parseInt(yearFromUrl);
    setSelectedDate(prevDate => {
      return new Date(year, prevDate.getMonth(), 1);
    });
  }, [yearFromUrl]);

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

  const handlePreviousMonth = () => {
    const newDate = subMonths(selectedDate, 1);
    if (newDate.getFullYear().toString() === yearFromUrl) {
      setSelectedDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = addMonths(selectedDate, 1);
    if (newDate.getFullYear().toString() === yearFromUrl) {
      setSelectedDate(newDate);
    }
  };

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
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onGenerateRecurring={handleGenerateRecurring}
            {...dialogProps}
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
