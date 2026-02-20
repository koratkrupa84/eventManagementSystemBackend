const ClientProfile = require('../models/ClientProfile');
const User = require('../models/User');

// GET CLIENT PROFILE
exports.getClientProfile = async (req, res) => {
  try {
    const profile = await ClientProfile.findOne({ user_id: req.user._id })
      .populate('user_id', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE OR UPDATE CLIENT PROFILE
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;

    if (!req.user || req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create profiles'
      });
    }

    let profile = await ClientProfile.findOne({ user_id: req.user._id });

    if (profile) {
      // Update existing profile
      if (phone !== undefined) profile.phone = phone;
      if (address !== undefined) profile.address = address;
      await profile.save();
    } else {
      // Create new profile
      profile = new ClientProfile({
        user_id: req.user._id,
        phone,
        address
      });
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
