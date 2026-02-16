const Review = require('../models/Review');

// GET ALL REVIEWS
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
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
};

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { name, rating, message, date } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and message are required'
      });
    }

    const review = new Review({
      name,
      rating: Number(rating),
      message,
      date: date ? new Date(date) : new Date()
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE REVIEW
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, message, date, isActive } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (name) review.name = name;
    if (rating) review.rating = Number(rating);
    if (message) review.message = message;
    if (date) review.date = new Date(date);
    if (isActive !== undefined) review.isActive = isActive;

    await review.save();

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
};

// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
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
};
