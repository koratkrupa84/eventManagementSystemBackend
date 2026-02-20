const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// GET ALL GALLERY IMAGES
exports.getAllGalleryImages = async (req, res) => {
  try {
    const { event_type, event_id } = req.query;
    const filter = {};
    
    if (event_type) filter.event_type = event_type;
    if (event_id) filter.event_id = event_id;

    const PublicEvent = require('../models/PublicEvent');
    const PrivateEvent = require('../models/PrivateEvent');

    // Get all images
    const images = await Gallery.find(filter)
      .populate('uploaded_by', 'name email')
      .sort({ createdAt: -1 });

    // Manually populate events based on type
    const populatedImages = await Promise.all(
      images.map(async (img) => {
        const imgObj = img.toObject();
        
        if (img.event_type === 'public') {
          const publicEvent = await PublicEvent.findById(img.event_id);
          imgObj.event_id = publicEvent ? publicEvent.toObject() : null;
        } else if (img.event_type === 'private') {
          const privateEvent = await PrivateEvent.findById(img.event_id);
          imgObj.event_id = privateEvent ? privateEvent.toObject() : null;
        }
        
        return imgObj;
      })
    );
      
    res.status(200).json({
      success: true,
      data: populatedImages
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
    const { event_type, event_id } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    if (!event_type || !['public', 'private'].includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required and must be "public" or "private"'
      });
    }

    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Validate event_id exists based on event_type
    const PublicEvent = require('../models/PublicEvent');
    const PrivateEvent = require('../models/PrivateEvent');
    
    if (event_type === 'public') {
      const publicEvent = await PublicEvent.findById(event_id);
      if (!publicEvent) {
        return res.status(404).json({
          success: false,
          message: 'Public event not found'
        });
      }
    } else if (event_type === 'private') {
      const privateEvent = await PrivateEvent.findById(event_id);
      if (!privateEvent) {
        return res.status(404).json({
          success: false,
          message: 'Private event not found'
        });
      }
    }

    const images = req.files.map(file => ({
      event_type: event_type,
      event_id: event_id,
      image_path: file.path.replace(/\\/g, "/"),
      uploaded_by: req.user._id
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
    if (image.image_path) {
      const fullPath = path.join(__dirname, "..", image.image_path);
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

// UPDATE GALLERY IMAGE
exports.updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_type, event_id } = req.body;

    // Find the image
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Validate event_type if provided
    if (event_type && !['public', 'private'].includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: 'Event type must be "public" or "private"'
      });
    }

    // Validate event_id if provided
    if (event_id) {
      const PublicEvent = require('../models/PublicEvent');
      const PrivateEvent = require('../models/PrivateEvent');
      const eventType = event_type || image.event_type;
      
      if (eventType === 'public') {
        const publicEvent = await PublicEvent.findById(event_id);
        if (!publicEvent) {
          return res.status(404).json({
            success: false,
            message: 'Public event not found'
          });
        }
      } else if (eventType === 'private') {
        const privateEvent = await PrivateEvent.findById(event_id);
        if (!privateEvent) {
          return res.status(404).json({
            success: false,
            message: 'Private event not found'
          });
        }
      }
    }

    // Update the image
    const updateData = {};
    if (event_type) updateData.event_type = event_type;
    if (event_id) updateData.event_id = event_id;

    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploaded_by', 'name email');

    // Manually populate the event data
    const PublicEvent = require('../models/PublicEvent');
    const PrivateEvent = require('../models/PrivateEvent');
    
    let populatedImage = updatedImage.toObject();
    if (populatedImage.event_type === 'public') {
      const publicEvent = await PublicEvent.findById(populatedImage.event_id);
      populatedImage.event_id = publicEvent ? publicEvent.toObject() : null;
    } else if (populatedImage.event_type === 'private') {
      const privateEvent = await PrivateEvent.findById(populatedImage.event_id);
      populatedImage.event_id = privateEvent ? privateEvent.toObject() : null;
    }

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: populatedImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
