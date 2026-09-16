/**
 * Centralized Mock Expense Data for TripLedger.
 * This mock data provides structured expense records mapped to trips.
 */

export const INITIAL_MOCK_EXPENSES = [
  {
    id: 'exp_101',
    tripId: 'goa-trip-2026',
    title: 'Hotel Booking (Resort Stay)',
    category: 'Accommodation',
    amount: 5000,
    paidBy: 'Rahul',
    paidById: '2',
    date: '2026-11-12',
    notes: 'Advance booking for 3 nights'
  },
  {
    id: 'exp_102',
    tripId: 'goa-trip-2026',
    title: 'Seafood Dinner & Drinks',
    category: 'Food',
    amount: 3125,
    paidBy: 'Vikas',
    paidById: '1',
    date: '2026-11-13',
    notes: 'Baga beach shack dinner'
  },
  {
    id: 'exp_103',
    tripId: 'goa-trip-2026',
    title: 'Bus & Local Scooter Rental',
    category: 'Transport',
    amount: 1875,
    paidBy: 'Arjun',
    paidById: '3',
    date: '2026-11-13',
    notes: 'Two scooters for 3 days'
  },
  {
    id: 'exp_104',
    tripId: 'goa-trip-2026',
    title: 'Scuba & Water Sports',
    category: 'Activities',
    amount: 1250,
    paidBy: 'Rahul',
    paidById: '2',
    date: '2026-11-14',
    notes: 'Grand Island package'
  },
  {
    id: 'exp_105',
    tripId: 'goa-trip-2026',
    title: 'Beach Entry & Snacks',
    category: 'Others',
    amount: 1250,
    paidBy: 'Vikas',
    paidById: '1',
    date: '2026-11-15',
    notes: 'Sunbed rental and cold beverages'
  }
];

export const DEFAULT_INITIAL_TRIP = {
  id: 'goa-trip-2026',
  name: 'Goa Trip',
  destination: 'Goa',
  numberOfDays: 5,
  startDate: '2026-11-12',
  endDate: '2026-11-16',
  tripType: 'Group',
  budget: 20000,
  numberOfTravelers: 3,
  members: [
    { id: '1', name: 'Vikas', email: 'vikas@example.com' },
    { id: '2', name: 'Rahul', email: 'rahul@example.com' },
    { id: '3', name: 'Arjun', email: 'arjun@example.com' }
  ],
  createdBy: 'Vikas',
  createdAt: '2026-09-16T10:00:00.000Z'
};
