const express = require('express');
const { getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
