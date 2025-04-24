
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { translations } from '@/utils/translations';
import { Expense } from '@/services/expenseService';

interface ExpenseListItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onTogglePaid: (id: number, paid: boolean) => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = ({
  expense,
  onEdit,
  onDelete,
  onTogglePaid,
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {expense.name}
        {expense.recurringId && (
          <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-400 border-purple-500/20">
            <Calendar className="ml-1 h-3 w-3" />
            {translations.recurring}
          </Badge>
        )}
      </TableCell>
      <TableCell>{expense.category?.name || translations.uncategorized}</TableCell>
      <TableCell>{expense.bank}</TableCell>
      <TableCell>
        <button 
          onClick={() => onTogglePaid(expense.id, !expense.paid)}
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors",
            expense.paid
              ? "bg-green-500/15 text-green-500 border border-green-500/20 hover:bg-green-500/25"
              : "bg-red-500/15 text-red-500 border border-red-500/20 hover:bg-red-500/25"
          )}>
          {expense.paid ? (
            <>
              <CheckCircle2 className="ml-1 h-3.5 w-3.5" />
              {translations.paid}
            </>
          ) : (
            <>
              <XCircle className="ml-1 h-3.5 w-3.5" />
              {translations.unpaid}
            </>
          )}
        </button>
      </TableCell>
      <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(expense)}
          title={translations.edit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(expense.id)}
          title={translations.delete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
