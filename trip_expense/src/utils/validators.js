/**
 * Form validation helper utilities for TripLedger
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

export const validateDateRange = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) {
    return { isValid: false, message: 'Both start and end dates are required' };
  }
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, message: 'Invalid date selection' };
  }

  if (start > end) {
    return { isValid: false, message: 'Start date cannot be after end date' };
  }

  return { isValid: true, message: '' };
};
