const Package = require('../models/Package');

// ADD PACKAGE from admin 
exports.addPackage = async (req, res) => {
     try {
       const { package_name, price, services } = req.body;
   
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