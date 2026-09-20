const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createItineraryItem,
  getItineraryByTrip,
  getItineraryItemById,
  updateItineraryItem,
  deleteItineraryItem
} = require('../controllers/itineraryController');

router.use(authMiddleware);
router.post('/', createItineraryItem);
router.get('/trip/:tripId', getItineraryByTrip);
router.get('/:id', getItineraryItemById);
router.patch('/:id', updateItineraryItem);
router.delete('/:id', deleteItineraryItem);

module.exports = router;
