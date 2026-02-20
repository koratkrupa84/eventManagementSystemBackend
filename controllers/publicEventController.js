const PublicEvent = require('../models/PublicEvent');

// GET ALL PUBLIC EVENTS
exports.getAllPublicEvents = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const events = await PublicEvent.find(filter)
      .populate('created_by', 'name email')
      .sort({ event_date: 1 });

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
};

// GET SINGLE PUBLIC EVENT
exports.getPublicEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await PublicEvent.findById(id)
      .populate('created_by', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE PUBLIC EVENT (Admin/Organizer only)
exports.createPublicEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, category } = req.body;

    if (!title || !description || !event_date || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (req.user.role !== 'organizer' && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only organizers and admins can create public events'
      });
    }

    const event = new PublicEvent({
      title,
      description,
      event_date,
      location,
      category,
      created_by: req.user._id
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Public event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE PUBLIC EVENT
exports.updatePublicEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, location, category, status } = req.body;

    const event = await PublicEvent.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (event_date) event.event_date = event_date;
    if (location) event.location = location;
    if (category) event.category = category;
    if (status) event.status = status;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PUBLIC EVENT
exports.deletePublicEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await PublicEvent.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
