const mongoose = require('mongoose');
const Review = require('./models/Review');
const dbConnect = require('./config/dbConnect');

// Fetch and display existing reviews from database
const fetchReviews = async () => {
  try {
    await dbConnect();
    
    console.log('🔍 Fetching reviews from database...');
    
    // Fetch all reviews from database
    const reviews = await Review.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`📊 Found ${reviews.length} reviews in database:`);
    console.log('=====================================');
    
    reviews.forEach((review, index) => {
      console.log(`\n📝 Review #${index + 1}:`);
      console.log(`   Name: ${review.name}`);
      console.log(`   Rating: ${'⭐'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`);
      console.log(`   Message: "${review.message}"`);
      console.log(`   Date: ${review.date ? review.date.toLocaleDateString() : 'N/A'}`);
      console.log(`   Active: ${review.isActive ? '✅' : '❌'}`);
      console.log(`   Created: ${review.createdAt ? review.createdAt.toLocaleDateString() : 'N/A'}`);
    });
    
    console.log('\n=====================================');
    console.log(`✅ Successfully fetched ${reviews.length} reviews from database!`);
    
    if (reviews.length === 0) {
      console.log('\n❌ No reviews found in database.');
      console.log('💡 You can add reviews using MongoDB Compass or API endpoints.');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    process.exit(1);
  }
};

fetchReviews();
