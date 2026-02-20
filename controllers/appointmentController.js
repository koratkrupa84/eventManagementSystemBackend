const PrivateEventRequest = require('../models/PrivateEventRequest');

// GET ALL APPOINTMENTS
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await PrivateEventRequest.find()
      .populate('client_id', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE APPOINTMENT STATUS
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await PrivateEventRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE APPOINTMENT
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await PrivateEventRequest.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    const {
      client_id,
      event_type,
      event_date,
      location,
      guests,
      budget,
      special_requirements
    } = req.body;

    // Validate required fields
    if (!event_type) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required'
      });
    }

    if (!event_date) {
      return res.status(400).json({
        success: false,
        message: 'Event date is required'
      });
    }

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    // Validate client exists (only if client_id is provided and not a backend entry)
    if (client_id && client_id !== "backend_user_id") {
      const User = require('../models/User');
      const client = await User.findById(client_id);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }
    }

    const appointmentData = {
      event_type,
      event_date,
      location,
      guests: guests ? Number(guests) : undefined,
      budget: budget ? Number(budget) : undefined,
      special_requirements,
      status: 'pending'
    };

    // Only add client_id if it's provided and not a backend entry
    if (client_id && client_id !== "backend_user_id") {
      appointmentData.client_id = client_id;
    }

    const appointment = new PrivateEventRequest(appointmentData);
    await appointment.save();

    // Populate client info for response if client_id exists
    if (appointmentData.client_id) {
      await appointment.populate('client_id', 'name email');
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
