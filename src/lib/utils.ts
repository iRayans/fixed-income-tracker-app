
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if the date is valid before formatting
  if (!isValid(date)) {
    console.error(`Invalid date: ${dateString}`);
    return 'Invalid date';
  }
  
  return format(date, "MMM d, yyyy")
}
