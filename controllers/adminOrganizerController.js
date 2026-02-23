const Organizer = require('../models/Organizer');

// GET ALL ORGANIZERS (FOR ADMIN)
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: organizers
    });
  } catch (error) {
    console.error('Get all organizers error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ORGANIZER (FOR ADMIN)
exports.deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndDelete(req.params.id);

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Organizer deleted successfully'
    });
  } catch (error) {
    console.error('Delete organizer error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE ORGANIZER STATUS (FOR ADMIN)
exports.updateOrganizerStatus = async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;
    
    const organizer = await Organizer.findByIdAndUpdate(
      req.params.id,
      { isActive, isVerified },
      { new: true, runValidators: true }
    ).select('-password');

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Organizer status updated successfully',
      data: organizer
    });
  } catch (error) {
    console.error('Update organizer status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
