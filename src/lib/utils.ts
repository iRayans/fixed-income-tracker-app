
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'SAR') {
  // Create a formatter that uses the Saudi Riyal symbol (﷼)
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('SAR', '﷼');
}

export function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  
  // Handle yearMonth format (YYYY-MM)
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    try {
      const date = parse(dateString, 'yyyy-MM', new Date());
      if (isValid(date)) {
        return format(date, "MMMM yyyy");
      }
    } catch (error) {
      console.error(`Error parsing year-month format: ${dateString}`, error);
    }
  }
  
  // Handle regular date format
  const date = new Date(dateString);
  
  if (!isValid(date)) {
    console.error(`Invalid date: ${dateString}`);
    return 'Invalid date';
  }
  
  return format(date, "MMM d, yyyy")
}
