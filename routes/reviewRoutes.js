const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllReviews);
router.post('/', protect, isAdmin, addReview);
router.put('/:id', protect, isAdmin, updateReview);
router.delete('/:id', protect, isAdmin, deleteReview);

module.exports = router;
