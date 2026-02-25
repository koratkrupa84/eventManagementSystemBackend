const express = require('express');
const router = express.Router();
const {
  getAllInquiries,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry,
  createInquiry
} = require('../controllers/inquiryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', createInquiry);
router.get('/', protect, isAdmin, getAllInquiries);
router.get('/:id', protect, isAdmin, getInquiry);
router.put('/:id/status', protect, isAdmin, updateInquiryStatus);
router.delete('/:id', protect, isAdmin, deleteInquiry);

module.exports = router;
