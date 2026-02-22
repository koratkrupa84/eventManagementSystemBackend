const express = require('express');
const { 
  registerOrganizer, 
  loginOrganizer, 
  googleLogin, 
  getOrganizerProfile, 
  updateOrganizerProfile,
  uploadEventPhotos,
  uploadEventPhoto,
  deleteEventPhoto,
  getEventPhotos
} = require('../controllers/organizerController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// ================= PUBLIC ROUTES =================

// POST /organizer/register - Register new organizer
router.post('/register', registerOrganizer);

// POST /organizer/login - Login organizer
router.post('/login', loginOrganizer);

// POST /organizer/google - Google login for organizer
router.post('/google', googleLogin);

// ================= PROTECTED ROUTES =================

// GET /organizer/profile - Get organizer profile
router.get('/profile', protect, getOrganizerProfile);

// PUT /organizer/profile - Update organizer profile
router.put('/profile', protect, updateOrganizerProfile);

// POST /organizer/upload-photo - Upload organizer profile photo
router.post('/upload-photo', protect, (req, res, next) => {
  req.uploadModule = 'organizer';
  next();
}, upload.single('profilePhoto'), updateOrganizerProfile);

// POST /organizer/upload-event-photo - Upload event photo
router.post('/profile/upload-event-photo', protect, (req, res, next) => {
  req.uploadModule = 'organizer';
  next();
}, upload.single('eventPhoto'), uploadEventPhoto);

// POST /organizer/upload-event-photos - Upload multiple event photos
router.post('/profile/upload-event-photos', protect, (req, res, next) => {
  req.uploadModule = 'organizer';
  next();
}, upload.array('eventPhotos', 10), uploadEventPhotos);

// DELETE /organizer/profile/delete-event-photo/:photoIndex - Delete event photo
router.delete('/profile/delete-event-photo/:photoIndex', protect, deleteEventPhoto);

// GET /organizer/profile/event-photos - Get all event photos
router.get('/profile/event-photos', protect, getEventPhotos);

module.exports = router;
