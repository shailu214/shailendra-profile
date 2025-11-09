const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  company: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  
  avatar: {
    type: String,
    trim: true,
    default: null
  },
  
  projectType: {
    type: String,
    trim: true,
    maxlength: 50
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Contact information (optional)
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  linkedin: {
    type: String,
    trim: true
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['linkedin', 'email', 'upwork', 'freelancer', 'direct', 'other'],
    default: 'direct'
  },
  
  dateReceived: {
    type: Date,
    default: Date.now
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Admin notes
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
testimonialSchema.index({ name: 1 });
testimonialSchema.index({ company: 1 });
testimonialSchema.index({ isActive: 1 });
testimonialSchema.index({ isFeatured: 1 });
testimonialSchema.index({ sortOrder: 1 });
testimonialSchema.index({ dateReceived: -1 });
testimonialSchema.index({ source: 1 });
testimonialSchema.index({ tags: 1 });

// Virtual for display name
testimonialSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.position} at ${this.company}`;
});

// Static methods
testimonialSchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, dateReceived: -1 });
};

testimonialSchema.statics.getFeatured = function() {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ sortOrder: 1, dateReceived: -1 });
};

testimonialSchema.statics.getByRating = function(minRating = 4) {
  return this.find({ isActive: true, rating: { $gte: minRating } })
    .sort({ rating: -1, sortOrder: 1, dateReceived: -1 });
};

testimonialSchema.statics.getBySource = function(source) {
  return this.find({ isActive: true, source })
    .sort({ sortOrder: 1, dateReceived: -1 });
};

testimonialSchema.statics.searchByKeyword = function(keyword) {
  const regex = new RegExp(keyword, 'i');
  return this.find({
    isActive: true,
    $or: [
      { name: regex },
      { company: regex },
      { content: regex },
      { tags: { $in: [regex] } }
    ]
  }).sort({ sortOrder: 1, dateReceived: -1 });
};

// Instance methods
testimonialSchema.methods.toggleStatus = function() {
  this.isActive = !this.isActive;
  return this.save();
};

testimonialSchema.methods.toggleFeatured = function() {
  this.isFeatured = !this.isFeatured;
  return this.save();
};

testimonialSchema.methods.updateSortOrder = function(newOrder) {
  this.sortOrder = newOrder;
  return this.save();
};

// Pre-save middleware
testimonialSchema.pre('save', function(next) {
  // Auto-generate sortOrder if not provided
  if (this.isNew && !this.sortOrder) {
    this.constructor.countDocuments({})
      .then(count => {
        this.sortOrder = count;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;