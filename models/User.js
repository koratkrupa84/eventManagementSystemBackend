const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
        return !this.googleId; // ✅ Only require password if NOT Google user
      },
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['client', 'organizer'],
      default: 'client',
    },

    isActive: {
      type: Boolean,
      default: true,
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

    // Reference to client profile for client users
    clientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientProfile'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
