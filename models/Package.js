const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    package_name: {
      type: String,
      required: true,
      maxlength: 50
    },
    price: {
      type: Number,
      required: true
    },
    services: {
      type: String,
      required: true
    },
    images: {
      type: [String],   // array of image URLs
      default: []       // optional
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Package", packageSchema);
