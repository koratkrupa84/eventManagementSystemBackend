const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema(
  
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
    },

    company: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    specialization: {
      type: String,
      enum: ['wedding', 'corporate', 'birthday', 'concert', 'conference', 'sports', 'other'],
      default: 'other',
    },

    experience: {
      type: String,
      enum: ['0-2', '2-5', '5-10', '10+'],
      default: '0-2',
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    website: {
      type: String,
      trim: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalEvents: {
      type: Number,
      default: 0,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    profileImage: {
      type: String,
      default: '',
    },

    eventPhotos: [{
      type: String,
    }],

    licenseNumber: {
      type: String,
      trim: true,
    },

    services: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organizer', organizerSchema);
