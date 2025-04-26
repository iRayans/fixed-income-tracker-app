
import React from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpenseMonthSelectorProps {
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const ExpenseMonthSelector: React.FC<ExpenseMonthSelectorProps> = ({
  selectedDate,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between bg-muted/40 p-4 rounded-lg">
      <Button variant="ghost" size="icon" onClick={onPreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">
        {format(selectedDate, 'MMMM yyyy')}
      </h2>
      <Button variant="ghost" size="icon" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
