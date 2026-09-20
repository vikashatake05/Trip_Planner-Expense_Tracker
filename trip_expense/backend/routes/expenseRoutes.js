const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpensesByTrip,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/trip/:tripId', getExpensesByTrip);
router.get('/:id', getExpenseById);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
