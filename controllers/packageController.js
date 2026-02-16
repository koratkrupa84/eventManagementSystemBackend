const Package = require('../models/Package');
const path = require('path');
const fs = require('fs');

// ADD PACKAGE from admin 
exports.addPackage = async (req, res) => {
  try {
    const { package_name, price, services } = req.body;

    console.log(req.body);
    if (!package_name || !price || !services) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const images = req.files?.map(file =>
      file.path.replace(/\\/g, "/")
    ) || [];

    const newPackage = new Package({
      package_name,
      price,
      services,
      images
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package added successfully",
      data: newPackage
    });
  } catch (error) {
    console.error("ADD PACKAGE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL PACKAGES
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE PACKAGE from admin
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { package_name, price, services, removedImages } = req.body;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // -------- REMOVE OLD IMAGES IF ANY --------
    if (removedImages) {
      let imagesToRemove;
      try {
        imagesToRemove = typeof removedImages === 'string' ? JSON.parse(removedImages) : removedImages;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid removedImages format"
        });
      }

      imagesToRemove.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      packageData.images = packageData.images.filter(
        (img) => !imagesToRemove.includes(img)
      );
    }

    // -------- ADD NEW IMAGES --------
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) =>
        file.path.replace(/\\/g, "/")
      );

      packageData.images = [
        ...packageData.images,
        ...newImages
      ];
    }

    // -------- UPDATE TEXT FIELDS --------
    packageData.package_name = package_name || packageData.package_name;
    packageData.price = price || packageData.price;
    packageData.services = services || packageData.services;

    await packageData.save();

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: packageData
    });

  } catch (error) {
    console.error("UPDATE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};