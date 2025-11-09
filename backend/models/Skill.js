const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Frontend Development',
      'Backend Development', 
      'Database',
      'DevOps',
      'Mobile Development',
      'UI/UX Design',
      'Testing',
      'Cloud Services',
      'Programming Languages',
      'Frameworks & Libraries',
      'Tools & Software',
      'Soft Skills',
      'Other'
    ]
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: [1, 'Proficiency must be at least 1'],
    max: [100, 'Proficiency cannot exceed 100']
  },
  experience: {
    years: {
      type: Number,
      min: 0,
      default: 0
    },
    description: String
  },
  icon: {
    type: String, // URL to icon or icon class name
    trim: true
  },
  color: {
    type: String, // Hex color for UI theming
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color'],
    default: '#3B82F6'
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  // Related projects that showcase this skill
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  }],
  // Certifications related to this skill
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialUrl: String,
    credentialId: String
  }],
  // Learning resources
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['Course', 'Book', 'Tutorial', 'Documentation', 'Article', 'Video', 'Other']
    },
    url: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  // Usage statistics
  usage: {
    projectCount: {
      type: Number,
      default: 0
    },
    lastUsed: Date,
    trending: {
      type: Boolean,
      default: false
    }
  },
  // Display order for UI
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update project count when skill is associated with projects
skillSchema.methods.updateProjectCount = async function() {
  const Portfolio = mongoose.model('Portfolio');
  const count = await Portfolio.countDocuments({
    'technologies.name': this.name,
    isPublished: true
  });
  
  this.usage.projectCount = count;
  return await this.save();
};

// Get proficiency level as text
skillSchema.methods.getProficiencyLevel = function() {
  if (this.proficiency >= 90) return 'Expert';
  if (this.proficiency >= 75) return 'Advanced';
  if (this.proficiency >= 60) return 'Proficient';
  if (this.proficiency >= 40) return 'Intermediate';
  if (this.proficiency >= 20) return 'Beginner';
  return 'Learning';
};

// Check if skill is trending (used in recent projects)
skillSchema.methods.checkTrending = async function() {
  const Portfolio = mongoose.model('Portfolio');
  const recentProjectsCount = await Portfolio.countDocuments({
    'technologies.name': this.name,
    isPublished: true,
    createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } // Last 6 months
  });
  
  this.usage.trending = recentProjectsCount >= 2;
  return await this.save();
};

// Add certification
skillSchema.methods.addCertification = function(certData) {
  this.certifications.push(certData);
  return this.save();
};

// Add learning resource
skillSchema.methods.addResource = function(resourceData) {
  this.resources.push(resourceData);
  return this.save();
};

// Get valid certifications (not expired)
skillSchema.methods.getValidCertifications = function() {
  const now = new Date();
  return this.certifications.filter(cert => 
    !cert.expiryDate || cert.expiryDate > now
  );
};

// Index for better query performance
skillSchema.index({ category: 1, proficiency: -1 });
skillSchema.index({ isHighlighted: 1, sortOrder: 1 });
skillSchema.index({ isActive: 1, proficiency: -1 });
skillSchema.index({ 'usage.trending': 1, proficiency: -1 });

module.exports = mongoose.model('Skill', skillSchema);