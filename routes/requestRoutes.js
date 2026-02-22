// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const { getApprovedRequests } = require('../controllers/requestController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getApprovedRequests);

module.exports = router;