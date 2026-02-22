const User = require("../models/User");
const ClientProfile = require("../models/ClientProfile");
const PrivateEventRequest = require("../models/PrivateEventRequest");

/* ===============================
   GET CLIENT PROFILE
================================= */
exports.getClientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const profile = await ClientProfile.findOne({
      user_id: req.user._id
    });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        phone: profile?.phone,
        address: profile?.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile fetch failed"
    });
  }
};

/* ===============================
   GET CLIENT APPOINTMENTS
================================= */
exports.getClientAppointments = async (req, res) => {
  try {
    const appointments = await PrivateEventRequest.find({
      client_id: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Appointments fetch failed"
    });
  }
};

/* ===============================
   BOOK PRIVATE EVENT
================================= */
exports.bookPrivateEvent = async (req, res) => {
  try {
    const newEvent = await PrivateEventRequest.create({
      ...req.body,
      client_id: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Event booked successfully",
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Booking failed"
    });
  }
};

// ===================== UPDATE PROFILE =====================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const { id } = req.params; // Get ID from URL params
    const userId = req.user.id; // Get user ID from authenticated token

    // Verify that the user is updating their own profile
    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile"
      });
    }

    // Update User name and other basic info
    await User.findByIdAndUpdate(id, { 
      name: name,
      phone: phone,
      address: address
    }, { new: true });

    // Update or create ClientProfile with user_id reference
    let profile = await ClientProfile.findOne({ user_id: id });
    if (profile) {
      profile.phone = phone;
      profile.address = address;
      await profile.save();
    } else {
      profile = new ClientProfile({ 
        user_id: id, 
        phone: phone, 
        address: address 
      });
      await profile.save();
    }

    // Get updated user data
    const updatedUser = await User.findById(id).select("-password");

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.log("Profile update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Profile update failed" 
    });
  }
};