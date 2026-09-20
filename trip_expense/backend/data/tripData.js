/**
 * In-Memory Trips Data Store
 */

const trips = [
  {
    id: "1",
    name: "Goa Trip",
    destination: "Goa",
    startDate: "2026-11-12",
    endDate: "2026-11-16",
    days: 5,
    budget: 20000,
    tripType: "group",
    members: [
      { id: "1", name: "Vikas" },
      { id: "2", name: "Rahul" },
      { id: "3", name: "Arjun" }
    ],
    createdAt: "2026-09-01T10:00:00.000Z"
  }
];

module.exports = trips;
