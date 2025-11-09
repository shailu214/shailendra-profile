const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  // Page identification
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  path: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // SEO Meta Data
  seo: {
    title: {
      type: String,
      required: true,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      required: true,
      maxlength: 160
    },
    keywords: [{
      type: String,
      trim: true
    }],
    focusKeyphrase: {
      type: String,
      trim: true
    },
    canonicalUrl: {
      type: String,
      trim: true
    },
    robots: {
      index: {
        type: Boolean,
        default: true
      },
      follow: {
        type: Boolean,
        default: true
      }
    },
    ogTitle: {
      type: String,
      maxlength: 60
    },
    ogDescription: {
      type: String,
      maxlength: 160
    },
    ogImage: {
      type: String,
      trim: true
    },
    twitterTitle: {
      type: String,
      maxlength: 60
    },
    twitterDescription: {
      type: String,
      maxlength: 160
    },
    twitterImage: {
      type: String,
      trim: true
    }
  },

  // Page Content
  content: {
    hero: {
      title: String,
      subtitle: String,
      description: String,
      ctaText: String,
      ctaLink: String,
      backgroundImage: String
    },
    sections: [{
      type: {
        type: String,
        enum: ['text', 'image', 'gallery', 'testimonials', 'features', 'contact', 'custom'],
        default: 'text'
      },
      title: String,
      content: String,
      data: mongoose.Schema.Types.Mixed,
      order: {
        type: Number,
        default: 0
      }
    }]
  },

  // Page Settings
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isHomepage: {
    type: Boolean,
    default: false
  },
  template: {
    type: String,
    enum: ['default', 'landing', 'blog', 'portfolio', 'contact', 'about'],
    default: 'default'
  },
  
  // Analytics and Performance
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    bounceRate: Number,
    avgTimeOnPage: Number
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
PageSchema.index({ slug: 1 });
PageSchema.index({ path: 1 });
PageSchema.index({ status: 1 });
PageSchema.index({ 'seo.focusKeyphrase': 1 });

// Pre-save middleware to update slug and path
PageSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    if (!this.path) {
      this.path = `/${this.slug}`;
    }
  }
  next();
});

// Virtual for full URL
PageSchema.virtual('fullUrl').get(function() {
  return `${process.env.FRONTEND_URL || 'http://localhost:5181'}${this.path}`;
});

// Methods
PageSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

PageSchema.methods.toPublic = function() {
  const obj = this.toObject();
  return {
    _id: obj._id,
    name: obj.name,
    slug: obj.slug,
    path: obj.path,
    seo: obj.seo,
    content: obj.content,
    status: obj.status,
    template: obj.template,
    isHomepage: obj.isHomepage,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };
};

module.exports = mongoose.model('Page', PageSchema);