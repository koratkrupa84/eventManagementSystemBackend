const express = require('express');
const router = express.Router();
const {
  getAllPublicEvents,
  getPublicEvent,
  createPublicEvent,
  updatePublicEvent,
  deletePublicEvent
} = require('../controllers/publicEventController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllPublicEvents);
router.get('/:id', getPublicEvent);

// Protected routes (Admin/Organizer only)
router.post('/', protect, (req, res, next) => {
  req.uploadModule = 'public-events';
  next();
}, upload.single('image'), createPublicEvent);

router.put('/:id', protect, (req, res, next) => {
  req.uploadModule = 'public-events';
  next();
}, upload.single('image'), updatePublicEvent);

// Admin only route
router.delete('/:id', protect, isAdmin, deletePublicEvent);

module.exports = router;
