const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createExpense,
  getAllExpenses,
  getExpensesByTrip,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.use(authMiddleware);
router.post('/', createExpense);
router.get('/', getAllExpenses);
router.get('/trip/:tripId', getExpensesByTrip);
router.get('/:id', getExpenseById);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
