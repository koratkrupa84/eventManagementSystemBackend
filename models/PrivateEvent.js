const mongoose = require('mongoose');

const privateEventSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrivateEventRequest',
      required: true
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true
    },
    details: {
      type: String,
      required: true
    },
    guests: {
      type: Number
    },
    budget: {
      type: Number
    },
    location: {
      type: String
    },
    event_date: {
      type: Date
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PrivateEvent', privateEventSchema);
