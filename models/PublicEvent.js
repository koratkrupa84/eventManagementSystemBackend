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
    status: {
      type: String,
      enum: ['upcoming', 'completed'],
      default: 'upcoming'
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PublicEvent', publicEventSchema);
