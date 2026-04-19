const PublicEvent = require('../models/PublicEvent');

// GET ALL PUBLIC EVENTS
exports.getAllPublicEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (status) filter.status = status;

    const events = await PublicEvent.find(filter)
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });

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
    const { title, description, event_date, location, status, price } = req.body;

    // Validation
    if (!title || !description || !event_date || !location || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Price validation
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Title length validation
    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Title must be less than 150 characters'
      });
    }

    // Location length validation
    if (location.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Location must be less than 150 characters'
      });
    }

    // Role validation
    if (req.user.role !== 'organizer' && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only organizers and admins can create public events'
      });
    }

    // Handle image upload
    let imagePath = '';
    if (req.file) {
      imagePath = `/${req.file.destination.replace(/\\/g, '/')}/${req.file.filename}`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Event image is required'
      });
    }

    const event = new PublicEvent({
      title,
      description,
      event_date,
      location,
      status: status || 'upcoming',
      image: imagePath,
      created_by: req.user._id,
      price: parseFloat(price)
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Public event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error creating public event:', error);
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
    const { title, description, event_date, location, status, price } = req.body;

    const event = await PublicEvent.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validation for title length
    if (title && title.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Title must be less than 150 characters'
      });
    }

    // Validation for location length
    if (location && location.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Location must be less than 150 characters'
      });
    }

    // Price validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (event_date) event.event_date = event_date;
    if (location) event.location = location;
    if (status) event.status = status;
    if (price !== undefined) event.price = parseFloat(price);

    // Handle image update
    if (req.file) {
      event.image = `/${req.file.destination.replace(/\\/g, '/')}/${req.file.filename}`;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Error updating public event:', error);
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
