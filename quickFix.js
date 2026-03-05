const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const ClientProfile = require('./models/ClientProfile');

async function fixExistingClients() {
  try {
    // Connect using the same connection as app.js
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventManagement');
    console.log('Connected to MongoDB');
    
    // Find all clients
    const clients = await User.find({ role: 'client' });
    console.log(`Found ${clients.length} clients`);
    
    for (const client of clients) {
      // Check if profile exists
      const existingProfile = await ClientProfile.findOne({ user_id: client._id });
      
      if (!existingProfile) {
        // Create profile
        const profile = await ClientProfile.create({
          user_id: client._id,
          phone: client.phone || '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        });
        
        // Update user with profile reference
        await User.findByIdAndUpdate(client._id, { 
          clientProfile: profile._id 
        });
        
        console.log(`✅ Created profile for: ${client.name}`);
      } else {
        console.log(`⏭️  Profile already exists for: ${client.name}`);
      }
    }
    
    console.log('🎉 Fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

fixExistingClients();
