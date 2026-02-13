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
        return !this.googleId; // ✅ Google user → no password
      },
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['client', 'admin', 'organizer'],
      default: 'client',
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
