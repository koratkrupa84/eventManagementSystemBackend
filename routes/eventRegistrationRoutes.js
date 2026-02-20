const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
  getEventRegistrations
} = require('../controllers/eventRegistrationController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.get('/user/my-registrations', protect, getUserRegistrations);
router.delete('/:id', protect, cancelRegistration);
router.get('/event/:eventId', protect, isAdmin, getEventRegistrations);

module.exports = router;
