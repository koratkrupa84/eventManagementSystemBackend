const express = require('express');
const { addPackage, getAllPackages } = require('../controllers/packageController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// GET ALL PACKAGES
router.get("/get-packages", getAllPackages);  
// ONLY ADMIN CAN ADD PACKAGE
// ADD PACKAGE (ADMIN ONLY + IMAGES)
router.post(
     "/", 
     protect,              // ✅ token check
     isAdmin,              // ✅ admin check
     (req, res, next) => {
       req.uploadModule = "packages"; // 🔥 folder name
       next();
     },
     upload.array("images", 5), // ✅ multer
     addPackage
   );

module.exports = router;

