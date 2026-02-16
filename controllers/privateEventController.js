const PrivateEventRequest = require("../models/PrivateEventRequest");

// user add
exports.createPrivateEventRequest = async (req, res) => {
  try {
    const { fullName, mobile, eventType, eventDate, eventTime, location, guests, budget, message, packageId } = req.body;

    if (!fullName || !mobile || !eventType || !eventDate || !location) {
      return res.status(400).json({
        success: false,
        message: "Full name, mobile, event type, event date and location are required"
      });
    }

    console.log(req.body);

    const request = new PrivateEventRequest({
      client_id: req.user?._id || undefined, // Link to logged-in user if available
      full_name: fullName,
      mobile: mobile,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime || undefined,
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
      fullName,
      mobile,
      eventType,
      eventDate,
      eventTime,
      location,
      guests,
      budget,
      message,
      packageId,
      clientId   // optional
    } = req.body;

    if (!fullName || !mobile || !eventType || !eventDate || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const request = new PrivateEventRequest({
      client_id: clientId || undefined, // admin manually set kari shake
      full_name: fullName,
      mobile,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime || undefined,
      location,
      guests: guests ? Number(guests) : undefined,
      budget: budget ? Number(budget) : undefined,
      special_requirements: message || undefined,
      package_id: packageId || undefined,
      status: "approved" // 🔥 admin direct approved kari shake
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
