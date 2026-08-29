import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from 'lucide-react';

export interface ExpenseFiltersState {
  search: string;
  category: string;
  paid: string;
  bank: string;
  recurring: string;
}

export const defaultExpenseFilters: ExpenseFiltersState = {
  search: '',
  category: 'all',
  paid: 'all',
  bank: 'all',
  recurring: 'all',
};

interface ExpenseFiltersProps {
  filters: ExpenseFiltersState;
  onChange: (filters: ExpenseFiltersState) => void;
  categories: { id?: number | string; name: string }[];
  banks: string[];
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onChange,
  categories,
  banks,
}) => {
  const hasFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.paid !== 'all' ||
    filters.bank !== 'all' ||
    filters.recurring !== 'all';

  const update = (patch: Partial<ExpenseFiltersState>) => {
    onChange({ ...filters, ...patch });
  };

  const clear = () => {
    onChange(defaultExpenseFilters);
  };

  const validCategories = categories.filter((c) => c.id != null);

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 rounded-lg border border-border/40 bg-card/50">
      <div className="relative w-full min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by name or description..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="pl-9 h-11 sm:h-10 bg-secondary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <Select value={filters.category} onValueChange={(value) => update({ category: value })}>
          <SelectTrigger className="w-full sm:w-[160px] h-11 sm:h-10 bg-secondary/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {validCategories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.paid} onValueChange={(value) => update({ paid: value })}>
          <SelectTrigger className="w-full sm:w-[150px] h-11 sm:h-10 bg-secondary/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.bank} onValueChange={(value) => update({ bank: value })}>
          <SelectTrigger className="w-full sm:w-[150px] h-11 sm:h-10 bg-secondary/50">
            <SelectValue placeholder="Bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Banks</SelectItem>
            {banks.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.recurring} onValueChange={(value) => update({ recurring: value })}>
          <SelectTrigger className="w-full sm:w-[170px] h-11 sm:h-10 bg-secondary/50">
            <SelectValue placeholder="Recurring" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expenses</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
            <SelectItem value="non-recurring">Non-Recurring</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="outline"
            onClick={clear}
            className="col-span-2 gap-1 h-11 sm:h-10 w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

