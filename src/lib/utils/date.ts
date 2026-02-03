import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { id } from 'date-fns/locale/id';

export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: id });
}

export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const date = new Date(year, month - 1, 1);
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
}

export function getCurrentMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

export function getMonthName(month: number): string {
  const date = new Date(2024, month - 1, 1);
  return format(date, 'MMMM', { locale: id });
}
