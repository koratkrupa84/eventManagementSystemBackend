const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConnect = require('./dbConnect');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const privateEventRoutes = require('./routes/privateEventRoutes');
const packageRoutes = require('./routes/packageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/privateEvents', privateEventRoutes);
app.use('/package', packageRoutes);

app.get('/', (req, res) => {
  res.send('Event Management API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

