import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Expense } from '@/services/expenseService';

interface ExpenseCardItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onTogglePaid: (id: number, paid: boolean) => void;
}

export const ExpenseCardItem: React.FC<ExpenseCardItemProps> = ({
  expense,
  onEdit,
  onDelete,
  onTogglePaid,
}) => {
  return (
    <div className="rounded-lg border border-border/40 bg-card/60 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium leading-tight break-words">{expense.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground break-words">
            {expense.description || 'No description'}
          </p>
        </div>
        <p className="shrink-0 font-semibold">{formatCurrency(expense.amount)}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary/60 px-2 py-0.5">
          {expense.category?.name || 'Uncategorized'}
        </span>
        {expense.bank && <span className="rounded-full bg-secondary/60 px-2 py-0.5">{expense.bank}</span>}
        {expense.recurringId && (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            <Calendar className="mr-1 h-3 w-3" />
            Recurring
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onTogglePaid(expense.id, !expense.paid)}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            expense.paid
              ? "bg-green-500/15 text-green-500 border border-green-500/20"
              : "bg-red-500/15 text-red-500 border border-red-500/20"
          )}
        >
          {expense.paid ? (
            <>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Paid
            </>
          ) : (
            <>
              <XCircle className="mr-1 h-3.5 w-3.5" /> Unpaid
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            aria-label="Edit expense"
            onClick={() => onEdit(expense)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 text-destructive"
            aria-label="Delete expense"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
