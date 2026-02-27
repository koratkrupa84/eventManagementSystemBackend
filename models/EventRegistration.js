const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublicEvent',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    total_Parson:{
      type: Number,
      required: true
    },
    registration_date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate registrations
eventRegistrationSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
