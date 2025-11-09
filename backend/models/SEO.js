const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  page: {
    type: String,
    required: [true, 'Page identifier is required'],
    unique: true,
    trim: true,
    enum: ['home', 'about', 'portfolio', 'blog', 'contact', 'blog-post', 'portfolio-item']
  },
  title: {
    type: String,
    required: [true, 'SEO title is required'],
    maxlength: [60, 'SEO title cannot exceed 60 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Meta description is required'],
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
    trim: true
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  canonicalUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Canonical URL must be a valid HTTP/HTTPS URL'
    }
  },
  // Open Graph Meta Tags
  openGraph: {
    title: {
      type: String,
      maxlength: [60, 'OG title cannot exceed 60 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'OG description cannot exceed 160 characters']
    },
    image: {
      url: String,
      width: Number,
      height: Number,
      alt: String
    },
    type: {
      type: String,
      enum: ['website', 'article', 'profile'],
      default: 'website'
    },
    url: String,
    siteName: String,
    locale: {
      type: String,
      default: 'en_US'
    }
  },
  // Twitter Card Meta Tags
  twitterCard: {
    card: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image'
    },
    site: String, // @username
    creator: String, // @username
    title: String,
    description: String,
    image: String,
    imageAlt: String
  },
  // Structured Data / Schema.org
  schemaMarkup: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Additional SEO settings
  robots: {
    index: {
      type: Boolean,
      default: true
    },
    follow: {
      type: Boolean,
      default: true
    },
    archive: {
      type: Boolean,
      default: true
    },
    snippet: {
      type: Boolean,
      default: true
    },
    imageindex: {
      type: Boolean,
      default: true
    }
  },
  // Hreflang for international SEO
  hreflang: [{
    lang: String, // e.g., 'en', 'es', 'fr'
    url: String
  }],
  // Custom meta tags
  customMeta: [{
    name: String,
    content: String,
    property: String // for property-based meta tags like og:
  }],
  // SEO Analytics
  analytics: {
    googleAnalyticsId: String,
    googleTagManagerId: String,
    facebookPixelId: String,
    linkedInInsightTag: String,
    customScripts: [{
      name: String,
      script: String,
      position: {
        type: String,
        enum: ['head', 'body-start', 'body-end'],
        default: 'head'
      }
    }]
  },
  // Performance and Technical SEO
  performance: {
    enableCompression: {
      type: Boolean,
      default: true
    },
    enableCaching: {
      type: Boolean,
      default: true
    },
    enableMinification: {
      type: Boolean,
      default: true
    },
    lazyLoadImages: {
      type: Boolean,
      default: true
    }
  },
  // Sitemap and RSS settings
  sitemap: {
    include: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    changeFreq: {
      type: String,
      enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
      default: 'monthly'
    },
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  // SEO Status and monitoring
  status: {
    isActive: {
      type: Boolean,
      default: true
    },
    lastOptimized: {
      type: Date,
      default: Date.now
    },
    seoScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    issues: [{
      type: {
        type: String,
        enum: ['warning', 'error', 'info']
      },
      message: String,
      detectedAt: {
        type: Date,
        default: Date.now
      },
      resolved: {
        type: Boolean,
        default: false
      }
    }]
  }
}, {
  timestamps: true
});

// Generate robots meta content
seoSchema.methods.getRobotsContent = function() {
  const robots = [];
  
  if (this.robots.index) robots.push('index');
  else robots.push('noindex');
  
  if (this.robots.follow) robots.push('follow');
  else robots.push('nofollow');
  
  if (!this.robots.archive) robots.push('noarchive');
  if (!this.robots.snippet) robots.push('nosnippet');
  if (!this.robots.imageindex) robots.push('noimageindex');
  
  return robots.join(', ');
};

// Generate structured data JSON-LD
seoSchema.methods.getStructuredData = function() {
  if (!this.schemaMarkup || Object.keys(this.schemaMarkup).length === 0) {
    return null;
  }
  
  return JSON.stringify(this.schemaMarkup);
};

// Update SEO score based on various factors
seoSchema.methods.calculateSeoScore = function() {
  let score = 0;
  
  // Title optimization (20 points)
  if (this.title && this.title.length >= 30 && this.title.length <= 60) {
    score += 20;
  } else if (this.title && this.title.length > 0) {
    score += 10;
  }
  
  // Description optimization (20 points)
  if (this.description && this.description.length >= 120 && this.description.length <= 160) {
    score += 20;
  } else if (this.description && this.description.length > 0) {
    score += 10;
  }
  
  // Keywords (15 points)
  if (this.keywords && this.keywords.length >= 3 && this.keywords.length <= 10) {
    score += 15;
  } else if (this.keywords && this.keywords.length > 0) {
    score += 8;
  }
  
  // Open Graph (15 points)
  if (this.openGraph && this.openGraph.title && this.openGraph.description && this.openGraph.image) {
    score += 15;
  } else if (this.openGraph && (this.openGraph.title || this.openGraph.description)) {
    score += 8;
  }
  
  // Twitter Card (10 points)
  if (this.twitterCard && this.twitterCard.title && this.twitterCard.description) {
    score += 10;
  } else if (this.twitterCard && (this.twitterCard.title || this.twitterCard.description)) {
    score += 5;
  }
  
  // Structured Data (10 points)
  if (this.schemaMarkup && Object.keys(this.schemaMarkup).length > 0) {
    score += 10;
  }
  
  // Canonical URL (5 points)
  if (this.canonicalUrl) {
    score += 5;
  }
  
  // Analytics (5 points)
  if (this.analytics && this.analytics.googleAnalyticsId) {
    score += 5;
  }
  
  this.status.seoScore = score;
  return score;
};

// Add SEO issue
seoSchema.methods.addIssue = function(type, message) {
  this.status.issues.push({
    type,
    message,
    detectedAt: new Date(),
    resolved: false
  });
  return this.save();
};

// Resolve SEO issue
seoSchema.methods.resolveIssue = function(issueId) {
  const issue = this.status.issues.id(issueId);
  if (issue) {
    issue.resolved = true;
  }
  return this.save();
};

// Pre-save middleware to update SEO score and last optimized date
seoSchema.pre('save', function(next) {
  this.calculateSeoScore();
  this.status.lastOptimized = new Date();
  this.sitemap.lastModified = new Date();
  next();
});

// Index for better query performance
seoSchema.index({ page: 1 });
seoSchema.index({ 'status.isActive': 1 });
seoSchema.index({ 'status.seoScore': -1 });

module.exports = mongoose.model('SEO', seoSchema);