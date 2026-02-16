const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getAllAppointments);
router.put('/:id/status', protect, isAdmin, updateAppointmentStatus);
router.delete('/:id', protect, isAdmin, deleteAppointment);

module.exports = router;
