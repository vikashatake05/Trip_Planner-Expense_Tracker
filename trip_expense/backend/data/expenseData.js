/**
 * In-Memory Expenses Data Store
 */

const expenses = [
  {
    id: "101",
    tripId: "1",
    description: "Hotel Resort Booking",
    amount: 5000,
    category: "accommodation",
    paidBy: "2", // Rahul
    splitType: "equal",
    participants: ["1", "2", "3"],
    splits: { "1": 1666.67, "2": 1666.67, "3": 1666.66 },
    date: "2026-11-12",
    createdAt: "2026-11-12T10:00:00.000Z"
  },
  {
    id: "102",
    tripId: "1",
    description: "Dinner at Beach Shack",
    amount: 3000,
    category: "food",
    paidBy: "1", // Vikas
    splitType: "equal",
    participants: ["1", "2", "3"],
    splits: { "1": 1000, "2": 1000, "3": 1000 },
    date: "2026-11-13",
    createdAt: "2026-11-13T20:00:00.000Z"
  }
];

module.exports = expenses;
