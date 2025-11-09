const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Information
  basicInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'], 
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters']
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    avatar: {
      url: String,
      alt: String,
      size: Number
    },
    coverImage: {
      url: String,
      alt: String
    }
  },

  // Professional Information
  professional: {
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [50, 'Years of experience cannot exceed 50']
    },
    currentPosition: {
      title: String,
      company: String,
      startDate: Date,
      isCurrent: {
        type: Boolean,
        default: true
      }
    },
    specializations: [{
      name: String,
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
      },
      yearsOfExperience: Number
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      credentialId: String,
      url: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    awards: [{
      title: String,
      issuer: String,
      date: Date,
      description: String,
      category: String
    }]
  },

  // Skills & Technologies
  skills: {
    technical: [{
      name: String,
      category: String, // Frontend, Backend, Database, DevOps, etc.
      proficiency: {
        type: Number,
        min: 1,
        max: 100,
        default: 50
      },
      yearsOfExperience: Number,
      isFeatured: {
        type: Boolean,
        default: false
      }
    }],
    soft: [{
      name: String,
      proficiency: {
        type: Number,
        min: 1,
        max: 100,
        default: 50
      }
    }],
    languages: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
        default: 'Conversational'
      }
    }]
  },

  // Work Experience
  experience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isCurrent: {
      type: Boolean,
      default: false
    },
    description: String,
    responsibilities: [String],
    achievements: [String],
    technologies: [String],
    companyUrl: String,
    companyLogo: String
  }],

  // Education
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: Number,
    description: String,
    achievements: [String]
  }],

  // Statistics & Achievements
  stats: {
    projectsCompleted: {
      type: Number,
      default: 0
    },
    clientsSatisfied: {
      type: Number,
      default: 0
    },
    yearsOfExperience: {
      type: Number,
      default: 0
    },
    technologiesMastered: {
      type: Number,
      default: 0
    },
    customStats: [{
      label: String,
      value: Number,
      icon: String,
      color: String
    }]
  },

  // Personal Information
  personal: {
    dateOfBirth: Date,
    location: {
      city: String,
      state: String,
      country: String,
      timezone: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    availability: {
      status: {
        type: String,
        enum: ['Available', 'Busy', 'Not Available'],
        default: 'Available'
      },
      message: String,
      hourlyRate: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'USD'
        }
      },
      workingHours: {
        timezone: String,
        schedule: [{
          day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          startTime: String,
          endTime: String,
          isAvailable: {
            type: Boolean,
            default: true
          }
        }]
      }
    },
    interests: [String],
    hobbies: [String]
  },

  // Contact Preferences
  contactPreferences: {
    preferredMethod: {
      type: String,
      enum: ['Email', 'Phone', 'LinkedIn', 'WhatsApp'],
      default: 'Email'
    },
    responseTime: {
      type: String,
      enum: ['Within 1 hour', 'Within 24 hours', 'Within 48 hours', 'Within a week'],
      default: 'Within 24 hours'
    },
    timeZone: String,
    bestTimeToContact: String
  },

  // SEO & Meta Information
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },

  // Privacy & Visibility
  privacy: {
    showEmail: {
      type: Boolean,
      default: true
    },
    showPhone: {
      type: Boolean,
      default: true
    },
    showLocation: {
      type: Boolean,
      default: true
    },
    showExperience: {
      type: Boolean,
      default: true
    },
    showEducation: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['Public', 'Private', 'Limited'],
      default: 'Public'
    }
  },

  // Social Media & Links
  socialMedia: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
    website: String,
    portfolio: String,
    blog: String,
    custom: [{
      platform: String,
      url: String,
      icon: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
profileSchema.virtual('fullName').get(function() {
  return `${this.basicInfo.firstName} ${this.basicInfo.lastName}`;
});

// Virtual for display name or full name
profileSchema.virtual('displayNameOrFull').get(function() {
  return this.basicInfo.displayName || this.fullName;
});

// Virtual for years of experience calculation
profileSchema.virtual('calculatedExperience').get(function() {
  if (this.professional.yearsOfExperience) {
    return this.professional.yearsOfExperience;
  }
  
  // Calculate from experience entries
  const currentDate = new Date();
  let totalMonths = 0;
  
  this.experience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? currentDate : new Date(exp.endDate);
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
    totalMonths += monthDiff;
  });
  
  return Math.round(totalMonths / 12);
});

// Indexes for better performance
profileSchema.index({ user: 1 });
profileSchema.index({ 'seo.slug': 1 });
profileSchema.index({ 'basicInfo.firstName': 'text', 'basicInfo.lastName': 'text' });

// Pre-save middleware
profileSchema.pre('save', function(next) {
  // Generate display name if not provided
  if (!this.basicInfo.displayName) {
    this.basicInfo.displayName = this.fullName;
  }
  
  // Generate SEO slug if not provided
  if (!this.seo.slug) {
    const name = this.fullName.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    this.seo.slug = name;
  }
  
  // Update stats automatically
  this.stats.technologiesMastered = this.skills.technical.length;
  this.stats.yearsOfExperience = this.calculatedExperience;
  
  next();
});

// Static method to get public profile fields
profileSchema.statics.getPublicFields = function() {
  return {
    basicInfo: 1,
    professional: 1,
    skills: 1,
    experience: 1,
    education: 1,
    stats: 1,
    personal: {
      location: 1,
      availability: 1
    },
    contactPreferences: 1,
    seo: 1,
    socialMedia: 1,
    createdAt: 1,
    updatedAt: 1
  };
};

// Instance method to get public data
profileSchema.methods.getPublicData = function() {
  const publicData = this.toObject();
  
  // Remove sensitive information based on privacy settings
  if (!this.privacy.showEmail) {
    delete publicData.contactPreferences;
  }
  
  if (!this.privacy.showLocation) {
    delete publicData.personal.location;
  }
  
  if (!this.privacy.showExperience) {
    delete publicData.experience;
  }
  
  if (!this.privacy.showEducation) {
    delete publicData.education;
  }
  
  return publicData;
};

module.exports = mongoose.model('Profile', profileSchema);