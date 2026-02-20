const express = require('express');
const router = express.Router();
const {
  getAllGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getAllGalleryImages);
router.post(
  '/',
  protect,
  isAdmin,
  (req, res, next) => {
    req.uploadModule = 'gallery';
    next();
  },
  upload.array('images', 10),
  addGalleryImage
);
router.put('/:id', protect, isAdmin, updateGalleryImage);
router.delete('/:id', protect, isAdmin, deleteGalleryImage);

module.exports = router;
