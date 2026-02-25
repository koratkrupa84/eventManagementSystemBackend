const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointment,
  createAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getAllAppointments);
router.post('/', protect, isAdmin, createAppointment);
router.put('/:id', protect, isAdmin, updateAppointment);
router.patch('/:id', protect, isAdmin, updateAppointmentStatus);
router.delete('/:id', protect, isAdmin, deleteAppointment);

module.exports = router;
