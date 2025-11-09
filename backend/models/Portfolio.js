const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [80, 'Title cannot exceed 80 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Web Development', 'Mobile App', 'Desktop Application', 'API Development', 'UI/UX Design', 'E-commerce', 'Data Analysis', 'Machine Learning', 'Other']
  },
  technologies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: String, // URL or icon class
    color: String // For UI styling
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  links: {
    live: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Live URL must be a valid HTTP/HTTPS URL'
      }
    },
    github: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
        },
        message: 'GitHub URL must be a valid GitHub repository URL'
      }
    },
    demo: String,
    documentation: String
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planned', 'On Hold'],
    default: 'Completed'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  duration: String, // e.g., "2 months", "3 weeks"
  client: {
    name: String,
    website: String,
    testimonial: {
      text: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  },
  features: [{
    title: {
      type: String,
      required: true
    },
    description: String
  }],
  challenges: [{
    problem: {
      type: String,
      required: true
    },
    solution: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  // SEO Fields
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [String],
    canonicalUrl: String,
    ogImage: String,
    schemaMarkup: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Auto-generate slug from title if not provided
portfolioSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  
  // Calculate duration if not provided
  if (this.startDate && this.endDate && !this.duration) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      this.duration = `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.ceil(diffDays / 30);
      this.duration = `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.ceil(diffDays / 365);
      this.duration = `${years} year${years > 1 ? 's' : ''}`;
    }
  }
  
  next();
});

// Increment view count
portfolioSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Get primary image
portfolioSchema.methods.getPrimaryImage = function() {
  return this.images.find(img => img.isPrimary) || this.images[0];
};

// Text search index
portfolioSchema.index({ 
  title: 'text', 
  description: 'text', 
  'technologies.name': 'text',
  'seo.keywords': 'text'
});

// Compound indexes for better query performance
portfolioSchema.index({ isPublished: 1, priority: -1 });
portfolioSchema.index({ category: 1, isPublished: 1 });
portfolioSchema.index({ isFeatured: 1, isPublished: 1 });
portfolioSchema.index({ status: 1, startDate: -1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);