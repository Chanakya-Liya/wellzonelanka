// Utility functions for consistent date handling across the application

/**
 * Formats a Date object to YYYY-MM-DD string without timezone conversion
 * @param date - The date to format
 * @returns YYYY-MM-DD formatted string
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a YYYY-MM-DD date string to a readable format
 * @param dateString - The date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Checks if a date string is today
 * @param dateString - The date string to check
 * @returns True if the date is today
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayString();
};

/**
 * Checks if a date string is in the past
 * @param dateString - The date string to check
 * @returns True if the date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  return dateString < getTodayString();
};

/**
 * Checks if a date string is in the future
 * @param dateString - The date string to check
 * @returns True if the date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  return dateString > getTodayString();
};