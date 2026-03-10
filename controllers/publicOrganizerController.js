const Organizer = require('../models/Organizer');

// GET ALL ORGANIZERS (FOR PUBLIC VIEWING)
exports.getPublicOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: organizers
    });
  } catch (error) {
    console.error('Get public organizers error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE ORGANIZER BY ID (FOR PUBLIC VIEWING)
exports.getPublicOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .select('-password');

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organizer
    });
  } catch (error) {
    console.error('Get public organizer by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
