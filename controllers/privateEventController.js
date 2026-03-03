const PrivateEventRequest = require("../models/PrivateEventRequest");
const PrivateEvent = require("../models/PrivateEvent");

// user add
exports.createPrivateEventRequest = async (req, res) => {
  try {
    const { eventType, eventDate, location, guests, budget, message, packageId } = req.body;

    if (!eventType || !eventDate || !location) {
      return res.status(400).json({
        success: false,
        message: "Event type, event date and location are required"
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }

    const request = new PrivateEventRequest({
      client_id: req.user._id,
      event_type: eventType,
      event_date: eventDate,
      location: location,
      guests: guests ? Number(guests) : undefined,
      budget: budget ? Number(budget) : undefined,
      special_requirements: message || undefined,
      package_id: packageId || undefined
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// admin add
exports.adminCreatePrivateEventRequest = async (req, res) => {
  try {
    const {
      eventType,
      eventDate,
      location,
      guests,
      budget,
      message,
      packageId,
      clientId
    } = req.body;

    if (!eventType || !eventDate || !location || !clientId) {
      return res.status(400).json({
        success: false,
        message: "Event type, event date, location and client ID are required"
      });
    }

    const request = new PrivateEventRequest({
      client_id: clientId,
      event_type: eventType,
      event_date: eventDate,
      location,
      guests: guests ? Number(guests) : undefined,
      budget: budget ? Number(budget) : undefined,
      special_requirements: message || undefined,
      package_id: packageId || undefined,
      status: "approved"
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: "Private event added by admin successfully",
      data: request
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE PRIVATE EVENT FROM APPROVED REQUEST
exports.createPrivateEvent = async (req, res) => {
  try {
    console.log('Request body received:', req.body);
    
    const { request_id, client_id, clientName, organizer_id, event_name, details, guests, budget, location, event_date, special_requirements, package_id } = req.body;
    
    console.log('Extracted client_id:', client_id);
    console.log('Extracted clientName:', clientName);
    
    if (!request_id || !event_name || !details) {
      return res.status(400).json({
        success: false,
        message: "Request ID, event name and details are required"
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }

    const request = await PrivateEventRequest.findById(request_id);
    if (!request || request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: "Request not found or not approved"
      });
    }

    // Get client_id from the request object if not provided in body
    const actualClientId = client_id || request.client_id;
    console.log('Actual client_id from request:', actualClientId);
    
    if (!actualClientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required but not found"
      });
    }

    // Create private event with proper client reference
    const privateEvent = new PrivateEvent({
      request_id: request._id,
      client_id: actualClientId,  // Use client_id from request object
      clientName: clientName,  // Client name for display
      organizer_id: organizer_id,
      event_name: event_name,
      details: details,
      guests: guests ? Number(guests) : undefined,
      budget: budget ? Number(budget) : undefined,
      location: location,
      event_date: event_date,
      special_requirements: special_requirements || undefined,
      package_id: package_id || undefined,
      status: "confirmed"
    });

    console.log('Private event to save:', privateEvent);
    await privateEvent.save();
    
    console.log('Private event saved successfully');
    
    res.status(201).json({
      success: true,
      message: "Private event created successfully",
      data: privateEvent
    });
  } catch (error) {
    console.error('Error creating private event:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL PRIVATE EVENTS
exports.getAllPrivateEvents = async (req, res) => {
  try {
    const events = await PrivateEvent.find({ status: 'completed' })
      .populate('request_id')
      .populate('organizer_id', 'name email')
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

// GET SINGLE PRIVATE EVENT
exports.getPrivateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await PrivateEvent.findById(id)
      .populate('request_id')
      .populate('organizer_id', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Private event not found'
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

// UPDATE PRIVATE EVENT
exports.updatePrivateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name, details } = req.body;

    const event = await PrivateEvent.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Private event not found'
      });
    }

    if (event_name) event.event_name = event_name;
    if (details) event.details = details;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Private event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PRIVATE EVENT
exports.deletePrivateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await PrivateEvent.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Private event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Private event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
