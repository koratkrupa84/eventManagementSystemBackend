const PrivateEventRequest = require('../models/PrivateEventRequest');
const User = require('../models/User');
const PrivateEvent = require('../models/PrivateEvent');

// GET ALL APPOINTMENTS
exports.getAllAppointments = async (req, res) => {
  try {
    console.log("=== GET ALL APPOINTMENTS DEBUG START ===");

    // Import PrivateEvent mod

    // Get ALL private event requests
    const allRequests = await PrivateEventRequest.find({})
      .populate('client_id', 'name email')
      .sort({ createdAt: -1 });

    // Get ALL private events
    const allPrivateEvents = await PrivateEvent.find({})
      .populate({
        path: 'request_id',
        populate: {
          path: 'client_id',
          select: 'name email'
        },
        select: 'event_type event_date location guests budget client_id'
      })
      .populate('client_id', 'name email')
      .populate('organizer_id', 'name email phone company specialization experience')
      .sort({ createdAt: -1 });

    console.log("All requests found:", allRequests.length);
    console.log("All private events found:", allPrivateEvents.length);
    
    // Debug: Check first event data
    if (allPrivateEvents.length > 0) {
      console.log("First event data:", JSON.stringify(allPrivateEvents[0], null, 2));
      console.log("First event request_id:", allPrivateEvents[0].request_id);
      console.log("First event client_id:", allPrivateEvents[0].request_id?.client_id);
    }

    // Convert requests to appointment format
    const requestAppointments = allRequests.map(request => ({
      _id: request._id,
      client_id: request.client_id,
      event_type: request.event_type,
      event_date: request.event_date,
      location: request.location,
      guests: request.guests,
      budget: request.budget,
      special_requirements: request.special_requirements,
      status: request.status,
      full_name: request.client_id?.name || 'Unknown Client',
      createdAt: request.createdAt,
      type: 'request'
    }));

    // Convert private events to appointment format
    const eventAppointments = allPrivateEvents.map(event => ({
      _id: event._id,
      request_id: event.request_id,
      client_id: event.request_id?.client_id,
      organizer_id: event.organizer_id,
      organizer: event.organizer_id, // Add organizer object
      event_name: event.event_name,
      event_type: event.request_id?.event_type || 'Private Event',
      event_date: event.event_date || event.request_id?.event_date,
      location: event.location || event.request_id?.location,
      guests: event.guests || event.request_id?.guests,
      budget: event.budget || event.request_id?.budget,
      details: event.details,
      status: event.status || 'confirmed',
      full_name: event.request_id?.client_id?.name || 'Unknown Client',
      createdAt: event.createdAt,
      type: 'private_event'
    }));

    // Combine both arrays
    const allAppointments = [...requestAppointments, ...eventAppointments];

    console.log("Total appointments:", allAppointments.length);
    console.log("=== GET ALL APPOINTMENTS DEBUG END ===");

    res.status(200).json({
      success: true,
      data: allAppointments
    });
  } catch (error) {
    console.log("ERROR in getAllAppointments:", error);
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

    // Import PrivateEvent model
    const PrivateEvent = require('../models/PrivateEvent');

    // First try to update PrivateEvent
    let appointment = await PrivateEvent.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('request_id', 'event_type event_date location guests budget');

    // If not found in PrivateEvent, try PrivateEventRequest
    if (!appointment) {
      appointment = await PrivateEventRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('client_id', 'name email');
    }

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

// UPDATE APPOINTMENT (Complete Update)
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Import PrivateEvent model
    const PrivateEvent = require('../models/PrivateEvent');

    // First try to update PrivateEvent
    let appointment = await PrivateEvent.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate({
      path: 'request_id',
      populate: {
        path: 'client_id',
        select: 'name email'
      },
      select: 'event_type event_date location guests budget client_id'
    })
     .populate('organizer_id', 'name email phone company specialization experience');

    // If not found in PrivateEvent, try PrivateEventRequest
    if (!appointment) {
      appointment = await PrivateEventRequest.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('client_id', 'name email');
    }

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Format response data for frontend
    const responseData = {
      _id: appointment._id,
      request_id: appointment.request_id,
      client_id: appointment.request_id?.client_id,
      organizer_id: appointment.organizer_id,
      organizer: appointment.organizer_id,
      event_name: appointment.event_name,
      event_type: appointment.request_id?.event_type || 'Private Event',
      event_date: appointment.event_date || appointment.request_id?.event_date,
      location: appointment.location || appointment.request_id?.location,
      guests: appointment.guests || appointment.request_id?.guests,
      budget: appointment.budget || appointment.request_id?.budget,
      details: appointment.details,
      status: appointment.status || 'confirmed',
      full_name: appointment.request_id?.client_id?.name || 'Unknown Client',
      createdAt: appointment.createdAt,
      type: 'private_event'
    };

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: responseData
    });
  } catch (error) {
    console.log("UPDATE APPOINTMENT ERROR:", error);
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

    // Import PrivateEvent model
    const PrivateEvent = require('../models/PrivateEvent');

    // First try to delete from PrivateEvent
    let appointment = await PrivateEvent.findByIdAndDelete(id);

    // If not found in PrivateEvent, try PrivateEventRequest
    if (!appointment) {
      appointment = await PrivateEventRequest.findByIdAndDelete(id);
    }

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
      request_id,
      organizer_id,
      details,
      guests,
      budget,
      location,
      event_date,
      status
    } = req.body;

    console.log("=== CREATE PRIVATE EVENT DEBUG START ===");
    console.log("Request data:", { request_id, organizer_id, details, guests, budget, location, event_date, status });

    // Import PrivateEvent model
    const PrivateEvent = require('../models/PrivateEvent');

    // Validate required fields
    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    if (!organizer_id) {
      return res.status(400).json({
        success: false,
        message: 'Organizer ID is required'
      });
    }

    // Create PrivateEvent using PrivateEvent model with all fields
    const privateEvent = await PrivateEvent.create({
      request_id,
      organizer_id,
      details: details || 'Private Event',
      guests: guests || null,
      budget: budget || null,
      location: location || null,
      event_date: event_date || null,
      status: status || 'confirmed'
    });

    // Also update the original request status to confirmed
    await PrivateEventRequest.findByIdAndUpdate(
      request_id,
      { status: 'confirmed' },
      { new: true }
    );

    console.log("PrivateEvent created:", privateEvent);
    console.log("=== CREATE PRIVATE EVENT DEBUG END ===");

    res.status(201).json({
      success: true,
      message: 'Private event created successfully',
      data: privateEvent
    });
  } catch (error) {
    console.log("ERROR in createAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
