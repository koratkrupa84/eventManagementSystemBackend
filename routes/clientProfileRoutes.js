const express = require('express');
const router = express.Router();
const {
  getClientProfile,
  createOrUpdateProfile
} = require('../controllers/clientProfileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getClientProfile);
router.post('/', protect, createOrUpdateProfile);
router.put('/', protect, createOrUpdateProfile);

module.exports = router;
