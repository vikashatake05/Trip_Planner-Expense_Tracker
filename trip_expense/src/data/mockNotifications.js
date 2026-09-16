export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Trip Invitation',
    description: 'Rahul Sharma invited you to join "Manali Trek".',
    type: 'INVITATION',
    read: false,
    date: '2026-09-14T14:30:00.000Z',
    link: '/invite/token_manali_102'
  },
  {
    id: 'notif_2',
    title: 'New Expense Added',
    description: 'Rahul added "Hotel Booking (Resort Stay)" - ₹5,000 to Goa Trip.',
    type: 'EXPENSE',
    read: false,
    date: '2026-09-13T10:15:00.000Z',
    link: '/trips/goa-trip-2026/expenses'
  },
  {
    id: 'notif_3',
    title: 'Settlement Update',
    description: 'Arjun Mehta marked settlement payment of ₹750 to Vikas as completed.',
    type: 'SETTLEMENT',
    read: true,
    date: '2026-09-12T18:00:00.000Z',
    link: '/trips/goa-trip-2026/settlement'
  },
  {
    id: 'notif_4',
    title: 'Itinerary Updated',
    description: 'Vikas added "Grand Island Scuba Diving" to Day 3 of Goa Trip.',
    type: 'ITINERARY',
    read: true,
    date: '2026-09-11T09:20:00.000Z',
    link: '/trips/goa-trip-2026/plan'
  }
];
