const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    event_type: {
      type: String,
      enum: ['public', 'private'],
      required: true
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    image_path: {
      type: String,
      required: true,
      maxlength: 255
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);
