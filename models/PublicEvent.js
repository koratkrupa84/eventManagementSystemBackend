const mongoose = require('mongoose');

const publicEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    event_date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true
    },
    category: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed'],
      default: 'upcoming'
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PublicEvent', publicEventSchema);
