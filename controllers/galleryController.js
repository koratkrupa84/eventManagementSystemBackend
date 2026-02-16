const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// GET ALL GALLERY IMAGES
exports.getAllGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD GALLERY IMAGE
exports.addGalleryImage = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const images = req.files.map(file => ({
      image: file.path.replace(/\\/g, "/"),
      title: title || undefined,
      description: description || undefined
    }));

    const savedImages = await Gallery.insertMany(images);

    res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      data: savedImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE GALLERY IMAGE
exports.deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete file
    if (image.image) {
      const fullPath = path.join(__dirname, "..", image.image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
