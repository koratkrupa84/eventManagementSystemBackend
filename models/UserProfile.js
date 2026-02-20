const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    address: {
      type: String,
      trim: true,
      default: '',
    },

    bio: {
      type: String,
      trim: true,
      default: '',
    },

    // Client specific fields
    preferences: {
      type: String,
      trim: true,
      default: '',
    },

    // Organizer specific fields
    specialization: {
      type: String,
      trim: true,
      default: '',
    },

    experience: {
      type: String,
      trim: true,
      default: '',
    },

    portfolio: {
      type: String,
      trim: true,
      default: '',
    },

    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },

    profileImage: {
      type: String,
      default: '',
    },

    socialLinks: {
      website: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
