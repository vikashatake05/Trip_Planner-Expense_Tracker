/**
 * Utility formatters for TripLedger
 */

/**
 * Format number as Indian Rupee (₹)
 * @param {number|string} amount
 * @returns {string} e.g. "₹20,000"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  const numericVal = Math.round(Number(amount));
  return '₹' + numericVal.toLocaleString('en-IN');
};

/**
 * Format a date string or Date object into short display date (e.g. "12 Nov")
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/**
 * Format date range for trip header (e.g. "12 Nov – 16 Nov 2026" or "12 Nov – 16 Nov")
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string}
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return `${startDate} – ${endDate}`;
  }

  const startFormatted = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const endFormatted = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const yearFormatted = end.getFullYear();

  return `${startFormatted} – ${endFormatted}, ${yearFormatted}`;
};
