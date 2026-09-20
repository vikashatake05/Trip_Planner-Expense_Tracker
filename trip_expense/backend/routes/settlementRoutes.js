const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getSettlement } = require('../controllers/settlementController');

router.use(authMiddleware);
router.get('/', (req, res) => {
	res.status(400).json({
		success: false,
		message: 'Trip ID is required. Use /api/settlements/:tripId.'
	});
});
router.get('/:tripId', getSettlement);

module.exports = router;
