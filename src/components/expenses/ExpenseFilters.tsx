import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, X, SlidersHorizontal } from 'lucide-react';

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

const FilterSelects: React.FC<{
  filters: ExpenseFiltersState;
  update: (patch: Partial<ExpenseFiltersState>) => void;
  categories: { id?: number | string; name: string }[];
  banks: string[];
  stacked?: boolean;
}> = ({ filters, update, categories, banks, stacked }) => {
  const validCategories = categories.filter((c) => c.id != null);
  const triggerClass = stacked
    ? "w-full h-11 bg-secondary/50"
    : "w-full sm:w-[160px] h-11 sm:h-10 bg-secondary/50";

  return (
    <>
      <Select value={filters.category} onValueChange={(value) => update({ category: value })}>
        <SelectTrigger className={triggerClass}>
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
        <SelectTrigger className={stacked ? triggerClass : "w-full sm:w-[150px] h-11 sm:h-10 bg-secondary/50"}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.bank} onValueChange={(value) => update({ bank: value })}>
        <SelectTrigger className={stacked ? triggerClass : "w-full sm:w-[150px] h-11 sm:h-10 bg-secondary/50"}>
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
        <SelectTrigger className={stacked ? triggerClass : "w-full sm:w-[170px] h-11 sm:h-10 bg-secondary/50"}>
          <SelectValue placeholder="Recurring" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Expenses</SelectItem>
          <SelectItem value="recurring">Recurring</SelectItem>
          <SelectItem value="non-recurring">Non-Recurring</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onChange,
  categories,
  banks,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<ExpenseFiltersState>(filters);

  const hasFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.paid !== 'all' ||
    filters.bank !== 'all' ||
    filters.recurring !== 'all';

  const activeSelectCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.paid !== 'all' ? 1 : 0) +
    (filters.bank !== 'all' ? 1 : 0) +
    (filters.recurring !== 'all' ? 1 : 0);

  const update = (patch: Partial<ExpenseFiltersState>) => {
    onChange({ ...filters, ...patch });
  };

  const updateDraft = (patch: Partial<ExpenseFiltersState>) => {
    setDraft({ ...draft, ...patch });
  };

  const clear = () => {
    onChange(defaultExpenseFilters);
  };

  const searchField = (
    <div className="relative w-full min-w-0 flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search by name or description..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        className="pl-9 h-11 sm:h-10 bg-secondary/50"
      />
    </div>
  );

  return (
    <>
      {/* Mobile: search + Filters button */}
      <div className="md:hidden flex items-center gap-2 p-3 rounded-lg border border-border/40 bg-card/50">
        {searchField}
        <Sheet
          open={sheetOpen}
          onOpenChange={(open) => {
            if (open) setDraft(filters);
            setSheetOpen(open);
          }}
        >
          <SheetTrigger asChild>
            <Button variant="outline" className="h-11 gap-1.5 shrink-0 relative">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeSelectCount > 0 && (
                <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] leading-none text-primary-foreground">
                  {activeSelectCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85dvh] overflow-y-auto">
            <SheetHeader className="text-left">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-3">
              <FilterSelects
                filters={draft}
                update={updateDraft}
                categories={categories}
                banks={banks}
                stacked
              />
              <div className="mt-2 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]">
                <Button
                  className="h-11 w-full"
                  onClick={() => {
                    onChange(draft);
                    setSheetOpen(false);
                  }}
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full gap-1"
                  onClick={() => {
                    setDraft(defaultExpenseFilters);
                    onChange({ ...defaultExpenseFilters, search: filters.search });
                  }}
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: full inline filter bar (unchanged) */}
      <div className="hidden md:flex flex-col gap-3 p-3 sm:p-4 rounded-lg border border-border/40 bg-card/50">
        {searchField}

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <FilterSelects
            filters={filters}
            update={update}
            categories={categories}
            banks={banks}
          />

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
    </>
  );
};
