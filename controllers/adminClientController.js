const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');
const bcrypt = require('bcryptjs');

// CREATE NEW CLIENT (ADMIN ONLY)
exports.createClient = async (req, res) => {
  try {
    const { name, email, password, UserProfile } = req.body;
    const phone = UserProfile?.phone;
    const address = UserProfile?.address;
    console.log(req.body);
    // Check if client already exists
    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new client user
    const client = new User({
      name,
      email,
      password: hashedPassword,
      role: 'client',
      isActive: true
    });

    console.log("Client Data:", client);

    await client.save();

    // Create client profile
    const clientProfile = new ClientProfile({
      userId: client._id,
      phone,
      address
    });

    console.log("Client Profile Data:", clientProfile);

    await clientProfile.save();

    // Update user with profile reference
    client.clientProfile = clientProfile._id;
    await client.save();

    // Get populated client data
    const populatedClient = await User.findById(client._id)
      .populate({
        path: 'clientProfile',
        select: 'phone address'
      })
      .select('-password');

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: populatedClient
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
