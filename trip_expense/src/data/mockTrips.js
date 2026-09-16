export const MOCK_TRIPS = [
  {
    id: 'goa-trip-2026',
    name: 'Goa Trip',
    destination: 'Goa',
    numberOfDays: 5,
    startDate: '2026-11-12',
    endDate: '2026-11-16',
    tripType: 'Group',
    budget: 20000,
    numberOfTravelers: 3,
    ownerId: 'usr_101',
    createdBy: 'Vikas S',
    members: [
      { userId: 'usr_101', name: 'Vikas S', email: 'vikas@example.com', role: 'OWNER', status: 'ACCEPTED', joinedAt: '2026-09-01' },
      { userId: 'usr_102', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'MEMBER', status: 'ACCEPTED', joinedAt: '2026-09-02' },
      { userId: 'usr_103', name: 'Arjun Mehta', email: 'arjun@example.com', role: 'MEMBER', status: 'PENDING', joinedAt: '2026-09-03' }
    ],
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'manali-trip-2026',
    name: 'Manali Trek',
    destination: 'Manali',
    numberOfDays: 7,
    startDate: '2026-12-01',
    endDate: '2026-12-07',
    tripType: 'Group',
    budget: 35000,
    numberOfTravelers: 4,
    ownerId: 'usr_102',
    createdBy: 'Rahul Sharma',
    members: [
      { userId: 'usr_102', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'OWNER', status: 'ACCEPTED', joinedAt: '2026-09-05' },
      { userId: 'usr_101', name: 'Vikas S', email: 'vikas@example.com', role: 'MEMBER', status: 'ACCEPTED', joinedAt: '2026-09-06' },
      { userId: 'usr_104', name: 'Priya Verma', email: 'priya@example.com', role: 'MEMBER', status: 'ACCEPTED', joinedAt: '2026-09-06' }
    ],
    createdAt: '2026-09-05T12:00:00.000Z'
  },
  {
    id: 'bali-solo-2026',
    name: 'Bali Getaway',
    destination: 'Bali',
    numberOfDays: 6,
    startDate: '2027-01-15',
    endDate: '2027-01-21',
    tripType: 'Solo',
    budget: 60000,
    numberOfTravelers: 1,
    ownerId: 'usr_101',
    createdBy: 'Vikas S',
    members: [
      { userId: 'usr_101', name: 'Vikas S', email: 'vikas@example.com', role: 'OWNER', status: 'ACCEPTED', joinedAt: '2026-09-10' }
    ],
    createdAt: '2026-09-10T15:00:00.000Z'
  }
];
