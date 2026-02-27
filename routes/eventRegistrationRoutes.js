const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
  getEventRegistrations,
  getAllEventRegistrations,
  updateRegistrationStatus,
  deleteRegistration
} = require('../controllers/eventRegistrationController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Client routes
router.post('/:eventId', protect, registerForEvent);
router.get('/user/my-registrations', protect, getUserRegistrations);
router.delete('/:id', protect, cancelRegistration);

// Admin routes
router.get('/event/:eventId', protect, isAdmin, getEventRegistrations);
router.get('/admin/all', protect, isAdmin, getAllEventRegistrations);
router.put('/admin/:id/status', protect, isAdmin, updateRegistrationStatus);
router.delete('/admin/:id', protect, isAdmin, deleteRegistration);

module.exports = router;
