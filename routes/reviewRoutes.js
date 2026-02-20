const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /reviews - Get all reviews (public endpoint)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /reviews - Add new review
router.post('/', async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    
    // Validation
    if (!name || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and message are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const newReview = new Review({
      name: name.trim(),
      rating: Number(rating),
      message: message.trim(),
      isActive: true
    });
    
    const savedReview = await newReview.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: savedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /reviews/:id - Update review
router.put('/:id', async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    const reviewId = req.params.id;
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { 
        name: name?.trim(),
        rating: rating ? Number(rating) : undefined,
        message: message?.trim()
      },
      { new: true, runValidators: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /reviews/:id - Delete review
router.delete('/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isActive: false },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
