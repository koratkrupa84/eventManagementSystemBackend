const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Organizer = require('../models/Organizer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= JWT GENERATOR =================
function generateToken(organizer) {
  return jwt.sign(
    {
      id: organizer._id,
      email: organizer.email,
      role: 'organizer'
    },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '7d' }
  );
}

// ================= REGISTER =================
const registerOrganizer = async (req, res) => {
  try {
    console.log('Received registration data:', req.body);
    
    const { 
      name, 
      email, 
      password, 
      confirmPassword, 
      company, 
      phone, 
      specialization, 
      experience, 
      bio, 
      website, 
      address,
      licenseNumber,
      services
    } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Name, email, password, and confirm password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Clean up the data before creating
    const organizerData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      company: company?.trim() || '',
      phone: phone?.trim() || '',
      specialization: specialization || 'other',
      experience: experience || '0-2',
      bio: bio?.trim() || '',
      website: website?.trim() || '',
      address: address || {},
      licenseNumber: licenseNumber?.trim() || '',
      services: Array.isArray(services) ? services : []
    };

    console.log('Cleaned organizer data:', organizerData);

    const organizer = await Organizer.create(organizerData);

    const token = generateToken(organizer);

    res.status(201).json({
      message: 'Organizer registered successfully',
      token,
      organizer: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        company: organizer.company,
        phone: organizer.phone,
        specialization: organizer.specialization,
        experience: organizer.experience,
        bio: organizer.bio,
        website: organizer.website,
        address: organizer.address,
        licenseNumber: organizer.licenseNumber,
        services: organizer.services,
        isVerified: organizer.isVerified,
        rating: organizer.rating,
        totalEvents: organizer.totalEvents
      }
    });

  } catch (error) {
    console.error('Organizer registration error:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ 
        message: `${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================= LOGIN =================
const loginOrganizer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!organizer.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, organizer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(organizer);

    res.json({
      message: 'Login successful',
      token,
      organizer: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        company: organizer.company,
        phone: organizer.phone,
        specialization: organizer.specialization,
        experience: organizer.experience,
        bio: organizer.bio,
        website: organizer.website,
        address: organizer.address,
        licenseNumber: organizer.licenseNumber,
        services: organizer.services,
        isVerified: organizer.isVerified,
        rating: organizer.rating,
        totalEvents: organizer.totalEvents
      }
    });

  } catch (error) {
    console.error('Organizer login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================= GOOGLE LOGIN =================
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name } = payload;

    let organizer = await Organizer.findOne({ email });

    if (!organizer) {
      organizer = await Organizer.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        provider: 'google'
      });
    }

    const jwtToken = generateToken(organizer);

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      organizer: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        company: organizer.company,
        phone: organizer.phone,
        specialization: organizer.specialization,
        experience: organizer.experience,
        bio: organizer.bio,
        website: organizer.website,
        address: organizer.address,
        licenseNumber: organizer.licenseNumber,
        services: organizer.services,
        isVerified: organizer.isVerified,
        rating: organizer.rating,
        totalEvents: organizer.totalEvents
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// ================= GET ORGANIZER PROFILE =================
const getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.user.id).select('-password');
    
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    res.json({
      success: true,
      data: organizer
    });
  } catch (error) {
    console.error('Get organizer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= UPDATE ORGANIZER PROFILE =================
const updateOrganizerProfile = async (req, res) => {
  try {
    console.log('Update profile request:', req.body);
    console.log('Uploaded file:', req.file);
    
    const allowedUpdates = [
      'name', 'company', 'phone', 'specialization', 'experience', 
      'bio', 'website', 'address', 'licenseNumber', 'services'
    ];
    
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Handle profile photo upload
    if (req.file) {
      const photoPath = req.file.path.replace(/\\/g, '/');
      updates.profileImage = `/${photoPath}`;
      console.log('Profile photo path:', updates.profileImage);
    }

    console.log('Updates to apply:', updates);

    const organizer = await Organizer.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: organizer
    });
  } catch (error) {
    console.error('Update organizer profile error:', error);
    res.status(500).json({ 
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================= UPLOAD MULTIPLE EVENT PHOTOS =================
const uploadEventPhotos = async (req, res) => {
  try {
    console.log('Multiple event photos upload request:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No photo files provided' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const organizer = await Organizer.findById(decoded.id);

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Initialize eventPhotos array if it doesn't exist
    if (!organizer.eventPhotos) {
      organizer.eventPhotos = [];
    }

    // Process all uploaded photos
    const uploadedPhotos = [];
    req.files.forEach(file => {
      const photoPath = file.path.replace(/\\/g, '/');
      const photoUrl = `/${photoPath}`;
      organizer.eventPhotos.push(photoUrl);
      uploadedPhotos.push(photoUrl);
    });

    await organizer.save();

    res.json({
      success: true,
      message: `${uploadedPhotos.length} event photos uploaded successfully`,
      data: {
        eventPhotos: uploadedPhotos,
        totalPhotos: organizer.eventPhotos.length
      }
    });

  } catch (error) {
    console.error('Multiple event photos upload error:', error);
    res.status(500).json({ 
      message: 'Server error during photo upload',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================= UPLOAD EVENT PHOTO =================
const uploadEventPhoto = async (req, res) => {
  try {
    console.log('Event photo upload request:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo file provided' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const organizer = await Organizer.findById(decoded.id);

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const photoPath = req.file.path.replace(/\\/g, '/');
    const photoUrl = `/${photoPath}`;

    // Add photo to organizer's event photos array
    if (!organizer.eventPhotos) {
      organizer.eventPhotos = [];
    }
    organizer.eventPhotos.push(photoUrl);

    await organizer.save();

    res.json({
      success: true,
      message: 'Event photo uploaded successfully',
      data: {
        eventPhoto: photoUrl,
        totalPhotos: organizer.eventPhotos.length
      }
    });

  } catch (error) {
    console.error('Event photo upload error:', error);
    res.status(500).json({ 
      message: 'Server error during photo upload',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================= DELETE EVENT PHOTO =================
const deleteEventPhoto = async (req, res) => {
  try {
    const { photoIndex } = req.params;
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const organizer = await Organizer.findById(decoded.id);

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    if (!organizer.eventPhotos || organizer.eventPhotos.length === 0) {
      return res.status(404).json({ message: 'No event photos found' });
    }

    const index = parseInt(photoIndex);
    if (index < 0 || index >= organizer.eventPhotos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }

    // Remove photo from array
    organizer.eventPhotos.splice(index, 1);
    await organizer.save();

    res.json({
      success: true,
      message: 'Event photo deleted successfully',
      data: {
        remainingPhotos: organizer.eventPhotos.length
      }
    });

  } catch (error) {
    console.error('Event photo delete error:', error);
    res.status(500).json({ 
      message: 'Server error during photo deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================= GET EVENT PHOTOS =================
const getEventPhotos = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const organizer = await Organizer.findById(decoded.id);

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    res.json({
      success: true,
      data: organizer.eventPhotos || []
    });

  } catch (error) {
    console.error('Get event photos error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching photos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerOrganizer,
  loginOrganizer,
  googleLogin,
  getOrganizerProfile,
  updateOrganizerProfile,
  uploadEventPhotos,
  uploadEventPhoto,
  deleteEventPhoto,
  getEventPhotos
};
