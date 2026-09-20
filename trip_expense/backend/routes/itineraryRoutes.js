const express = require('express');
const router = express.Router();
const {
  createItineraryItem,
  getItineraryByTrip,
  updateItineraryItem,
  deleteItineraryItem
} = require('../controllers/itineraryController');

router.post('/', createItineraryItem);
router.get('/trip/:tripId', getItineraryByTrip);
router.patch('/:id', updateItineraryItem);
router.delete('/:id', deleteItineraryItem);

module.exports = router;
