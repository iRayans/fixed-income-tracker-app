import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addMonths, subMonths, format } from 'date-fns';

const STORAGE_KEY = 'selectedMonth';

type Stored = { year: number; month: number };

const readStored = (): Stored | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.year || !parsed?.month) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeStored = (value: Stored) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
};

/**
 * Shared selected month state, persisted in the URL (?year=YYYY&month=M)
 * with a localStorage fallback so it survives refreshes and navigation.
 */
export const useSelectedMonth = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const now = new Date();
  const stored = readStored();

  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');

  const year = yearParam ? parseInt(yearParam, 10) : stored?.year ?? now.getFullYear();
  const month = monthParam ? parseInt(monthParam, 10) : stored?.month ?? now.getMonth() + 1;

  const safeYear = Number.isFinite(year) ? year : now.getFullYear();
  const safeMonth = Number.isFinite(month) && month >= 1 && month <= 12 ? month : now.getMonth() + 1;

  const selectedDate = useMemo(() => new Date(safeYear, safeMonth - 1, 1), [safeYear, safeMonth]);
  const yearMonth = format(selectedDate, 'yyyy-MM');

  const setSelectedDate = useCallback(
    (date: Date) => {
      const nextYear = date.getFullYear();
      const nextMonth = date.getMonth() + 1;
      writeStored({ year: nextYear, month: nextMonth });
      const next = new URLSearchParams(searchParams);
      next.set('year', String(nextYear));
      next.set('month', String(nextMonth));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const goToPreviousMonth = useCallback(
    () => setSelectedDate(subMonths(selectedDate, 1)),
    [selectedDate, setSelectedDate]
  );

  const goToNextMonth = useCallback(
    () => setSelectedDate(addMonths(selectedDate, 1)),
    [selectedDate, setSelectedDate]
  );

  return {
    selectedDate,
    year: safeYear,
    month: safeMonth,
    yearMonth,
    setSelectedDate,
    goToPreviousMonth,
    goToNextMonth,
  };
};

/** Query string to append when navigating between monthly pages. */
export const monthSearchString = (year: number, month: number) => `year=${year}&month=${month}`;

export const readSelectedMonthFromStorage = readStored;
