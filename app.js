const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConnect = require('./config/dbConnect');
const createDefaultAdmin = require("./config/createDefaultAdmin");
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const privateEventRoutes = require('./routes/privateEventRoutes');
const packageRoutes = require('./routes/packageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
dbConnect();
// Create default admin if not exists
createDefaultAdmin();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/privateEvents', privateEventRoutes);
app.use('/package', packageRoutes);
app.use('/admin/dashboard', dashboardRoutes);
app.use('/admin/appointments', appointmentRoutes);
app.use('/admin/categories', categoryRoutes);
app.use('/admin/gallery', galleryRoutes);
app.use('/admin/reviews', reviewRoutes);
app.use('/admin/inquiries', inquiryRoutes);

app.get('/', (req, res) => {
  res.send('Event Management API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

