const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripSummary
} = require('../controllers/tripController');

router.use(authMiddleware);
router.post('/', createTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.get('/:tripId/summary', getTripSummary);

module.exports = router;
