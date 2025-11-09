const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['General Inquiry', 'Project Collaboration', 'Job Opportunity', 'Freelance Work', 'Technical Support', 'Business Partnership', 'Other']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Responded', 'Closed', 'Follow-up Required'],
    default: 'New'
  },
  source: {
    type: String,
    enum: ['Website Contact Form', 'LinkedIn', 'Email', 'Referral', 'Social Media', 'Other'],
    default: 'Website Contact Form'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  },
  // Spam detection and security
  isSpam: {
    type: Boolean,
    default: false
  },
  spamScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Follow-up tracking
  followUps: [{
    note: String,
    date: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Social media links if provided
  socialMedia: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  },
  // Company information for business inquiries
  company: {
    name: String,
    website: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    industry: String
  },
  // Budget information for project inquiries
  budget: {
    range: {
      type: String,
      enum: ['< $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '> $50,000', 'To be discussed']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // Project timeline for collaboration inquiries
  timeline: {
    type: String,
    enum: ['ASAP', '1-2 weeks', '1 month', '2-3 months', '3-6 months', '6+ months', 'Flexible']
  }
}, {
  timestamps: true
});

// Mark as read
contactSchema.methods.markAsRead = async function() {
  this.isRead = true;
  return await this.save();
};

// Toggle starred status
contactSchema.methods.toggleStar = async function() {
  this.isStarred = !this.isStarred;
  return await this.save();
};

// Add response
contactSchema.methods.addResponse = async function(message, respondedBy) {
  this.response = {
    message,
    respondedAt: new Date(),
    respondedBy
  };
  this.status = 'Responded';
  return await this.save();
};

// Add follow-up note
contactSchema.methods.addFollowUp = async function(note, addedBy) {
  this.followUps.push({
    note,
    addedBy,
    date: new Date()
  });
  return await this.save();
};

// Update status
contactSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return await this.save();
};

// Check if high priority
contactSchema.methods.isHighPriority = function() {
  return ['High', 'Urgent'].includes(this.priority);
};

// Get days since received
contactSchema.methods.getDaysSinceReceived = function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Text search index
contactSchema.index({ 
  name: 'text', 
  email: 'text', 
  subject: 'text', 
  message: 'text',
  'company.name': 'text'
});

// Compound indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ priority: 1, createdAt: -1 });
contactSchema.index({ isRead: 1, createdAt: -1 });
contactSchema.index({ isStarred: 1, createdAt: -1 });
contactSchema.index({ category: 1, status: 1 });
contactSchema.index({ isSpam: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);