const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getAllCategories);
router.post(
  '/',
  protect,
  isAdmin,
  (req, res, next) => {
    req.uploadModule = 'categories';
    next();
  },
  upload.single('image'),
  addCategory
);
router.put(
  '/:id',
  protect,
  isAdmin,
  (req, res, next) => {
    req.uploadModule = 'categories';
    next();
  },
  upload.single('image'),
  updateCategory
);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
