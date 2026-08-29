
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseListItem } from './ExpenseListItem';
import { ExpenseCardItem } from './ExpenseCardItem';
import { Expense } from '@/services/expenseService';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onTogglePaid: (id: number, paid: boolean) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  onTogglePaid,
}) => {
  return (
    <>
      {/* Mobile: compact cards */}
      <div className="md:hidden space-y-2 p-2">
        {expenses.map((expense) => (
          <ExpenseCardItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePaid={onTogglePaid}
          />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-lg border border-border/40 backdrop-blur-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                expense={expense}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePaid={onTogglePaid}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
