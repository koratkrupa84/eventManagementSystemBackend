const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD CATEGORY
exports.addCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const category = new Category({
      title,
      description,
      image
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, removedImage } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Remove old image if requested
    if (removedImage && category.image) {
      const fullPath = path.join(__dirname, "..", category.image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      category.image = undefined;
    }

    // Add new image if uploaded
    if (req.file) {
      category.image = req.file.path.replace(/\\/g, "/");
    }

    // Update fields
    if (title) category.title = title;
    if (description !== undefined) category.description = description;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Delete image if exists
    if (category.image) {
      const fullPath = path.join(__dirname, "..", category.image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
