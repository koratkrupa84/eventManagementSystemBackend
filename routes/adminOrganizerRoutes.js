const express = require('express');
const { 
  getAllOrganizers, 
  deleteOrganizer, 
  updateOrganizerStatus 
} = require('../controllers/adminOrganizerController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /admin/organizers - Get all organizers (admin only)
router.get('/', protect, isAdmin, getAllOrganizers);

// DELETE /admin/organizers/:id - Delete organizer (admin only)
router.delete('/:id', protect, isAdmin, deleteOrganizer);

// PUT /admin/organizers/:id/status - Update organizer status (admin only)
router.put('/:id/status', protect, isAdmin, updateOrganizerStatus);

module.exports = router;
