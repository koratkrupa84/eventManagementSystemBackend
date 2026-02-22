const mongoose = require("mongoose");

const privateEventRequestSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  event_type: {
    type: String,
    required: true,
    maxlength: 50
  },
  event_date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    maxlength: 150
  },
  guests: {
    type: Number
  },
  budget: {
    type: Number
  },
  special_requirements: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending"
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model(
  "PrivateEventRequest",
  privateEventRequestSchema
);
