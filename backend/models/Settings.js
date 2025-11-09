const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Site Information
  site: {
    name: {
      type: String,
      default: 'My Portfolio',
      maxlength: [100, 'Site name cannot exceed 100 characters']
    },
    tagline: {
      type: String,
      default: 'Full Stack Developer & Designer',
      maxlength: [200, 'Tagline cannot exceed 200 characters']
    },
    description: {
      type: String,
      default: 'Welcome to my portfolio website showcasing my work and skills.',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    logo: {
      url: String,
      alt: String
    },
    favicon: String,
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Site URL must be a valid HTTP/HTTPS URL'
      }
    }
  },
  
  // Personal Information
  personal: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      default: 'Shailendra Chaurasia',
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    title: {
      type: String,
      default: 'Full Stack Developer',
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    avatar: {
      url: String,
      alt: String
    },
    location: {
      city: String,
      country: String,
      timezone: String
    },
    availability: {
      status: {
        type: String,
        enum: ['Available', 'Busy', 'Not Available'],
        default: 'Available'
      },
      message: String
    }
  },
  
  // Contact Information
  contact: {
    email: {
      primary: String,
      business: String
    },
    phone: {
      primary: String,
      whatsapp: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    workingHours: {
      timezone: String,
      schedule: [{
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        start: String, // e.g., "09:00"
        end: String,   // e.g., "17:00"
        available: {
          type: Boolean,
          default: true
        }
      }]
    }
  },
  
  // Social Media Links
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
    dribbble: String,
    behance: String,
    medium: String,
    dev: String,
    stackoverflow: String,
    codepen: String,
    discord: String,
    telegram: String,
    custom: [{
      name: String,
      url: String,
      icon: String
    }]
  },
  
  // Theme and UI Settings
  theme: {
    colorScheme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    primaryColor: {
      type: String,
      default: '#3B82F6',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    },
    secondaryColor: {
      type: String,
      default: '#EF4444',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    },
    fontFamily: {
      type: String,
      enum: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat'],
      default: 'Inter'
    },
    animations: {
      type: Boolean,
      default: true
    },
    particles: {
      type: Boolean,
      default: false
    }
  },
  
  // Navigation Settings
  navigation: {
    showLogo: {
      type: Boolean,
      default: true
    },
    menuItems: [{
      label: String,
      path: String,
      isExternal: {
        type: Boolean,
        default: false
      },
      isActive: {
        type: Boolean,
        default: true
      },
      order: {
        type: Number,
        default: 0
      }
    }],
    showSocial: {
      type: Boolean,
      default: true
    },
    stickyHeader: {
      type: Boolean,
      default: true
    }
  },
  
  // Homepage Settings
  homepage: {
    heroSection: {
      showAnimation: {
        type: Boolean,
        default: true
      },
      backgroundType: {
        type: String,
        enum: ['gradient', 'image', 'video', 'particles'],
        default: 'gradient'
      },
      backgroundImage: String,
      backgroundVideo: String,
      ctaButton: {
        text: {
          type: String,
          default: 'View My Work'
        },
        link: {
          type: String,
          default: '/portfolio'
        },
        isExternal: {
          type: Boolean,
          default: false
        }
      }
    },
    sections: {
      showAbout: {
        type: Boolean,
        default: true
      },
      showSkills: {
        type: Boolean,
        default: true
      },
      showPortfolio: {
        type: Boolean,
        default: true
      },
      showBlog: {
        type: Boolean,
        default: true
      },
      showContact: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Analytics and Tracking
  analytics: {
    googleAnalytics: {
      trackingId: String,
      enabled: {
        type: Boolean,
        default: false
      }
    },
    googleTagManager: {
      containerId: String,
      enabled: {
        type: Boolean,
        default: false
      }
    },
    facebookPixel: {
      pixelId: String,
      enabled: {
        type: Boolean,
        default: false
      }
    },
    hotjar: {
      siteId: String,
      enabled: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Email Settings
  email: {
    smtp: {
      host: String,
      port: Number,
      secure: Boolean,
      username: String,
      password: String
    },
    templates: {
      contactForm: {
        subject: {
          type: String,
          default: 'New Contact Form Submission'
        },
        autoReply: {
          enabled: {
            type: Boolean,
            default: true
          },
          subject: {
            type: String,
            default: 'Thank you for your message'
          },
          message: {
            type: String,
            default: 'Thank you for reaching out! I will get back to you soon.'
          }
        }
      }
    },
    notifications: {
      newContact: {
        type: Boolean,
        default: true
      },
      newBlogComment: {
        type: Boolean,
        default: true
      },
      weeklyReport: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // SEO Settings
  seo: {
    defaultTitle: String,
    titleSeparator: {
      type: String,
      default: ' | '
    },
    defaultDescription: String,
    defaultKeywords: [String],
    openGraphImage: String,
    twitterHandle: String,
    enableSitemap: {
      type: Boolean,
      default: true
    },
    enableRobots: {
      type: Boolean,
      default: true
    }
  },
  
  // Security Settings
  security: {
    rateLimiting: {
      enabled: {
        type: Boolean,
        default: true
      },
      windowMs: {
        type: Number,
        default: 15 * 60 * 1000 // 15 minutes
      },
      maxRequests: {
        type: Number,
        default: 100
      }
    },
    cors: {
      origins: [String],
      credentials: {
        type: Boolean,
        default: true
      }
    },
    honeypot: {
      enabled: {
        type: Boolean,
        default: true
      }
    },
    spamProtection: {
      enabled: {
        type: Boolean,
        default: true
      },
      threshold: {
        type: Number,
        default: 70
      }
    }
  },
  
  // Maintenance Settings
  maintenance: {
    mode: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'We are currently under maintenance. Please check back later.'
    },
    allowedIPs: [String],
    estimatedTime: Date
  }
}, {
  timestamps: true
});

// Singleton pattern - only one settings document should exist
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Get navigation menu items in order
settingsSchema.methods.getMenuItems = function() {
  return this.navigation.menuItems
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);
};

// Get active social media links
settingsSchema.methods.getActiveSocialLinks = function() {
  const social = {};
  Object.keys(this.social.toObject()).forEach(key => {
    if (this.social[key] && key !== 'custom') {
      social[key] = this.social[key];
    }
  });
  
  // Add custom social links
  if (this.social.custom && this.social.custom.length > 0) {
    this.social.custom.forEach(link => {
      if (link.name && link.url) {
        social[link.name.toLowerCase()] = link;
      }
    });
  }
  
  return social;
};

// Get working hours for a specific day
settingsSchema.methods.getWorkingHours = function(day) {
  if (!this.contact.workingHours.schedule) return null;
  
  return this.contact.workingHours.schedule.find(
    schedule => schedule.day === day && schedule.available
  );
};

// Check if currently in working hours
settingsSchema.methods.isInWorkingHours = function() {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().substr(0, 5); // HH:MM format
  
  const workingHours = this.getWorkingHours(currentDay);
  if (!workingHours) return false;
  
  return currentTime >= workingHours.start && currentTime <= workingHours.end;
};

// Ensure only one document exists
settingsSchema.pre('save', async function(next) {
  const count = await this.constructor.countDocuments();
  if (count > 0 && this.isNew) {
    const error = new Error('Only one settings document is allowed');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);