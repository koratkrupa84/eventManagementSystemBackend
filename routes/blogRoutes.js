const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogStats
} = require('../controllers/blogController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBlogs);
router.get('/stats', getBlogStats);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlog);

// Admin only routes
router.post('/', protect, isAdmin, createBlog);
router.put('/:id', protect, isAdmin, updateBlog);
router.delete('/:id', protect, isAdmin, deleteBlog);

module.exports = router;
