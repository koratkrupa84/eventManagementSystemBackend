const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true
    },
    email: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
      lowercase: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Replied', 'Resolved'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
