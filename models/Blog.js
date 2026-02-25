const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      maxlength: 300,
      trim: true
    },
    author: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Event Planning', 'Decorations', 'Photography', 'Catering', 'Venues', 'Tips & Tricks', 'Success Stories'],
      default: 'Event Planning'
    },
    tags: [{
      type: String,
      trim: true
    }],
    featuredImage: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: {
      type: Date,
      default: null
    },
    readTime: {
      type: Number,
      default: 5 // minutes
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  console.log("=== BLOG PRE-SAVE HOOK ===");
  console.log("Title:", this.title);
  console.log("Slug before:", this.slug);
  
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    console.log("Generated slug:", this.slug);
  }
  
  // Update publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
    console.log("Set publishedAt:", this.publishedAt);
  }
  
  console.log("Calling next() in pre-save hook");
  if (typeof next === 'function') {
    next();
  } else {
    console.error("ERROR: next is not a function in pre-save hook");
    // Don't call next if it's not a function
    // This prevents the "next is not a function" error
  }
});

// Test the model
blogSchema.statics.testConnection = async function() {
  try {
    console.log("=== TESTING BLOG MODEL CONNECTION ===");
    const count = await this.countDocuments();
    console.log("Blog model connection successful. Total blogs:", count);
    return { success: true, count };
  } catch (error) {
    console.error("Blog model connection failed:", error);
    return { success: false, error: error.message };
  }
};

console.log("Blog schema defined successfully");
const Blog = mongoose.model('Blog', blogSchema);

// Test connection on model load
Blog.testConnection();

module.exports = Blog;
