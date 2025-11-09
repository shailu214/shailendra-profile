const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name must be less than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description must be less than 200 characters'],
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Update post count when category is saved
categorySchema.methods.updatePostCount = async function() {
  const Blog = mongoose.model('Blog');
  this.postCount = await Blog.countDocuments({ category: this.name, isPublished: true });
  return this.save();
};

// Static method to update all category post counts
categorySchema.statics.updateAllPostCounts = async function() {
  const categories = await this.find();
  const Blog = mongoose.model('Blog');
  
  for (const category of categories) {
    category.postCount = await Blog.countDocuments({ 
      category: category.name, 
      isPublished: true 
    });
    await category.save();
  }
};

module.exports = mongoose.model('Category', categorySchema);