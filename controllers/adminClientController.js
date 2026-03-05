
const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');

// GET ALL CLIENTS WITH PROFILES
exports.getAllClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .populate({
        path: 'clientProfile',
        select: 'phone address'
      })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET CLIENT BY ID WITH PROFILE
exports.getClientById = async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.params.id, role: 'client' })
      .populate({
        path: 'clientProfile',
        select: 'phone address'
      })
      .select('-password');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Get client by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const client = await User.findOneAndDelete({ _id: req.params.id, role: 'client' });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Also delete associated client profile
    await ClientProfile.findOneAndDelete({ user_id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE CLIENT STATUS
exports.updateClientStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const client = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'client' },
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client status updated successfully',
      data: client
    });
  } catch (error) {
    console.error('Update client status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
