/**
 * Fixed-locale formatting utilities to prevent Next.js SSR / client hydration mismatches.
 * Always forces "en-US" so server and client render identical strings regardless of host or browser locale.
 */

export const FIXED_LOCALE = 'en-US';
export const DEFAULT_CURRENCY = 'USD';

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(FIXED_LOCALE, options).format(value);
}

export function formatPrice(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(FIXED_LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(
    FIXED_LOCALE,
    options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ).format(d);
}
