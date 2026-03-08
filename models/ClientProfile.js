const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String,
    maxlength: 15,
    trim: true
  },
  address: {
    type: String,
    trim: true
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model('ClientProfile', clientProfileSchema);