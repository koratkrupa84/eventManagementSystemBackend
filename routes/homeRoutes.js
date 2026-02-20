const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Package = require('../models/Package');
const Review = require('../models/Review');
const PublicEvent = require('../models/PublicEvent');

// GET /home/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /home/packages - Get popular packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8);
    
    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /home/reviews - Get recent reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('client_id', 'name');
    
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

// GET /home/events - Get upcoming public events
router.get('/events', async (req, res) => {
  try {
    const events = await PublicEvent.find({ 
      status: 'upcoming',
      isActive: true 
    })
    .sort({ event_date: 1 })
    .limit(6)
    .populate('created_by', 'name');
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /home/stats - Get home page stats
router.get('/stats', async (req, res) => {
  try {
    const [
      categoryCount,
      packageCount,
      reviewCount,
      eventCount
    ] = await Promise.all([
      Category.countDocuments({ isActive: true }),
      Package.countDocuments({ isActive: true }),
      Review.countDocuments({ isActive: true }),
      PublicEvent.countDocuments({ isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        categories: categoryCount,
        packages: packageCount,
        reviews: reviewCount,
        events: eventCount,
        totalEvents: 500, // Static stats
        satisfaction: 98
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
