const express = require('express');
const { 
  getPublicOrganizers,
  getPublicOrganizerById
} = require('../controllers/publicOrganizerController');

const router = express.Router();

// GET /api/organizers - Get all organizers for public viewing
router.get('/', getPublicOrganizers);

// GET /api/organizers/:id - Get single organizer by ID for public viewing
router.get('/:id', getPublicOrganizerById);

module.exports = router;
