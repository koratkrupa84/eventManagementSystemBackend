const express = require("express");
const router = express.Router();
const {
  createPrivateEventRequest,
  adminCreatePrivateEventRequest,
  createPrivateEvent,
  getAllPrivateEvents,
  getPrivateEvent,
  updatePrivateEvent,
  deletePrivateEvent
} = require("../controllers/privateEventController");

const { protect, isAdmin, isUser } = require("../middleware/authMiddleware.js");

// User create booking request
router.post("/", protect, isUser, createPrivateEventRequest);

// Admin create booking manually
router.post("/admin/add", protect, isAdmin, adminCreatePrivateEventRequest);

// Create private event from approved request
router.post("/create-event", protect, createPrivateEvent);

// Get all private events
router.get("/events", protect, getAllPrivateEvents);

// Get single private event
router.get("/events/:id", protect, getPrivateEvent);

// Update private event
router.put("/events/:id", protect, isAdmin, updatePrivateEvent);

// Delete private event
router.delete("/events/:id", protect, isAdmin, deletePrivateEvent);

module.exports = router;
