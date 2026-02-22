const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getClientProfile,
  getClientAppointments,
  bookPrivateEvent,
  updateProfile
} = require("../controllers/clientProfileController");

// GET PROFILE
router.get("/", protect, getClientProfile);

// GET APPOINTMENTS
router.get("/appointments", protect, getClientAppointments);

// BOOK EVENT
router.post("/private-event-booking", protect, bookPrivateEvent);

// UPDATE PROFILE
router.put("/update/:id", protect, updateProfile);

module.exports = router;