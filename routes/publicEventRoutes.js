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

router.get('/', getAllPublicEvents);
router.get('/:id', getPublicEvent);
router.post('/', protect, createPublicEvent);
router.put('/:id', protect, updatePublicEvent);
router.delete('/:id', protect, isAdmin, deletePublicEvent);

module.exports = router;
