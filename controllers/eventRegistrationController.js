const EventRegistration = require('../models/EventRegistration');
const PublicEvent = require('../models/PublicEvent');

// REGISTER FOR PUBLIC EVENT
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.user || req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can register for events'
      });
    }

    const event = await PublicEvent.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      event_id: eventId,
      user_id: req.user._id
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    const registration = new EventRegistration({
      event_id: eventId,
      user_id: req.user._id
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Registered for event successfully',
      data: registration
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET USER REGISTRATIONS
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ user_id: req.user._id })
      .populate('event_id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CANCEL REGISTRATION
exports.cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await EventRegistration.findOne({
      _id: id,
      user_id: req.user._id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    await EventRegistration.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET EVENT REGISTRATIONS (Admin/Organizer)
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ event_id: eventId })
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
