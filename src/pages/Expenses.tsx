
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseHeader } from '@/components/expenses/ExpenseHeader';
import { ExpenseDeleteDialog } from '@/components/expenses/ExpenseDeleteDialog';
import { ExpenseFilters, defaultExpenseFilters, ExpenseFiltersState } from '@/components/expenses/ExpenseFilters';
import { useExpenses } from '@/hooks/use-expenses';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { ExpenseDialogManager } from '@/components/expenses/ExpenseDialogManager';
import { useSelectedMonth } from '@/hooks/use-selected-month';

import { Expense } from '@/services/expenseService';

const matchesFilters = (expense: Expense, filters: ExpenseFiltersState): boolean => {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const nameMatch = expense.name?.toLowerCase().includes(term);
    const descriptionMatch = expense.description?.toLowerCase().includes(term);
    if (!nameMatch && !descriptionMatch) return false;
  }

  if (filters.category !== 'all' && String(expense.category?.id) !== filters.category) {
    return false;
  }

  if (filters.paid !== 'all') {
    if (filters.paid === 'paid' && !expense.paid) return false;
    if (filters.paid === 'unpaid' && expense.paid) return false;
  }

  if (filters.bank !== 'all' && expense.bank !== filters.bank) {
    return false;
  }

  if (filters.recurring !== 'all') {
    const isRecurring = Boolean(expense.recurringId);
    if (filters.recurring === 'recurring' && !isRecurring) return false;
    if (filters.recurring === 'non-recurring' && isRecurring) return false;
  }

  return true;
};

const Expenses = () => {
  const navigate = useNavigate();
  const { selectedDate, goToPreviousMonth, goToNextMonth } = useSelectedMonth();
  const [filters, setFilters] = useState<ExpenseFiltersState>(defaultExpenseFilters);

  const {
    expenses,
    handleAddOrUpdateExpense,
    handleDelete,
    handleTogglePaid,
    handleGenerateRecurring,
    isLoading,
    error,
    refetchExpenses,
  } = useExpenses(selectedDate);


  // Derive filter categories from the already-loaded expenses — no extra fetch.
  // Categories are only fetched from the API lazily when the Add/Edit dialog opens.
  const categories = useMemo(() => {
    const map = new Map<number, { id: number; name: string; description: string }>();
    for (const expense of expenses) {
      if (expense.category && expense.category.id != null && !map.has(expense.category.id)) {
        map.set(expense.category.id, expense.category);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => matchesFilters(expense, filters));
  }, [expenses, filters]);

  const banks = useMemo(() => {
    const unique = new Set(expenses.map((expense) => expense.bank).filter(Boolean));
    return Array.from(unique).sort();
  }, [expenses]);

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
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex items-center">
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
        
        <div className="glass-morphism rounded-lg p-3 sm:p-6 shadow-lg animate-scale-in">
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
          <div className="p-2 sm:p-4">
            <ExpenseFilters
              filters={filters}
              onChange={setFilters}
              categories={categories}
              banks={banks}
            />
          </div>
          {isLoading ? (
            <div className="text-center py-10 px-4 text-muted-foreground">
              Loading expenses…
            </div>
          ) : (
            <>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onTogglePaid={handleTogglePaid}
              />
              {expenses.length === 0 && (
                <div className="text-center py-10 px-4 text-muted-foreground">
                  No expenses recorded for {format(selectedDate, 'MMMM yyyy')}.
                </div>
              )}
              {filteredExpenses.length === 0 && expenses.length > 0 && (
                <div className="text-center py-10 px-4 text-muted-foreground">
                  No expenses match the selected filters.
                </div>
              )}
            </>
          )}
        </div>

        <ExpenseDeleteDialog {...deleteDialogProps} />
      </div>
    </AppLayout>
  );

};

export default Expenses;
