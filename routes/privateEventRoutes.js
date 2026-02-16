const express = require("express");
const router = express.Router();
const {
  createPrivateEventRequest,
  adminCreatePrivateEventRequest
} = require("../controllers/privateEventController");

const { protect, isAdmin, isUser } = require("../middleware/authMiddleware.js");

// User create booking
router.post("/", protect, isUser, createPrivateEventRequest);

// Admin create booking manually
router.post("/admin/add", protect, isAdmin, adminCreatePrivateEventRequest);

module.exports = router;
