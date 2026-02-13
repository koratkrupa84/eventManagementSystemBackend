const PrivateEventRequest = require("../models/PrivateEventRequest");

exports.createPrivateEventRequest = async (req, res) => {
  try {
    const { fullName, mobile, eventType, eventDate, eventTime, location, guests, budget, message, packageId } = req.body;

    if (!fullName || !mobile || !eventType || !eventDate || !location) {
      return res.status(400).json({
        success: false,
        message: "Full name, mobile, event type, event date and location are required"
      });
    }

    const request = new PrivateEventRequest({
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
