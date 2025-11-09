const express = require('express');
const multer = require('multer');
const path = require('path');
const { Profile, User } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc    Get public profile
// @route   GET /api/profile/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const profile = await Profile.findOne({ 'privacy.profileVisibility': 'Public' })
      .populate('user', 'name email')
      .select(Profile.getPublicFields());

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Public profile not found'
      });
    }

    res.json({
      success: true,
      profile: profile.getPublicData()
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get profile by slug
// @route   GET /api/profile/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const profile = await Profile.findOne({ 'seo.slug': slug })
      .populate('user', 'name email')
      .select(Profile.getPublicFields());

    if (!profile || profile.privacy.profileVisibility === 'Private') {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      profile: profile.getPublicData()
    });
  } catch (error) {
    console.error('Get profile by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!profile) {
      // Create a new profile with default values
      profile = await Profile.create({
        user: req.user._id,
        basicInfo: {
          firstName: req.user.name.split(' ')[0] || '',
          lastName: req.user.name.split(' ').slice(1).join(' ') || '',
          title: 'Developer',
          bio: ''
        },
        seo: {
          slug: req.user.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
        }
      });
      
      await profile.populate('user', 'name email');
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update specific profile section
// @route   PUT /api/profile/section/:section
// @access  Private
router.put('/section/:section', protect, async (req, res) => {
  try {
    const { section } = req.params;
    const allowedSections = [
      'basicInfo', 'professional', 'skills', 'experience', 
      'education', 'stats', 'personal', 'contactPreferences', 
      'seo', 'privacy', 'socialMedia'
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section'
      });
    }

    const updateData = { [section]: req.body };
    
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: `${section} updated successfully`,
      profile
    });
  } catch (error) {
    console.error('Update profile section error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload profile avatar
// @route   POST /api/profile/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const avatarUrl = `/uploads/profiles/${req.file.filename}`;
    
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        'basicInfo.avatar': {
          url: avatarUrl,
          alt: `${req.user.name} profile picture`,
          size: req.file.size
        }
      },
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl,
      profile
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload cover image
// @route   POST /api/profile/cover
// @access  Private
router.post('/cover', protect, upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const coverUrl = `/uploads/profiles/${req.file.filename}`;
    
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        'basicInfo.coverImage': {
          url: coverUrl,
          alt: `${req.user.name} cover image`
        }
      },
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Cover image uploaded successfully',
      coverUrl,
      profile
    });
  } catch (error) {
    console.error('Upload cover error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add experience entry
// @route   POST /api/profile/experience
// @access  Private
router.post('/experience', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.experience.push(req.body);
    await profile.save();

    res.json({
      success: true,
      message: 'Experience added successfully',
      profile
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update experience entry
// @route   PUT /api/profile/experience/:id
// @access  Private
router.put('/experience/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const experienceIndex = profile.experience.findIndex(exp => exp._id.toString() === req.params.id);
    
    if (experienceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Experience entry not found'
      });
    }

    profile.experience[experienceIndex] = { ...profile.experience[experienceIndex].toObject(), ...req.body };
    await profile.save();

    res.json({
      success: true,
      message: 'Experience updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete experience entry
// @route   DELETE /api/profile/experience/:id
// @access  Private
router.delete('/experience/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.id);
    await profile.save();

    res.json({
      success: true,
      message: 'Experience deleted successfully',
      profile
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add skill
// @route   POST /api/profile/skills/:type
// @access  Private
router.post('/skills/:type', protect, async (req, res) => {
  try {
    const { type } = req.params;
    const allowedTypes = ['technical', 'soft', 'languages'];
    
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill type'
      });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.skills[type].push(req.body);
    await profile.save();

    res.json({
      success: true,
      message: 'Skill added successfully',
      profile
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get profile analytics/stats
// @route   GET /api/profile/analytics
// @access  Private/Admin
router.get('/analytics', protect, restrictTo('admin'), async (req, res) => {
  try {
    const profileCount = await Profile.countDocuments();
    const publicProfiles = await Profile.countDocuments({ 'privacy.profileVisibility': 'Public' });
    const privateProfiles = await Profile.countDocuments({ 'privacy.profileVisibility': 'Private' });
    
    const avgExperience = await Profile.aggregate([
      {
        $group: {
          _id: null,
          avgExperience: { $avg: '$professional.yearsOfExperience' }
        }
      }
    ]);

    const topSkills = await Profile.aggregate([
      { $unwind: '$skills.technical' },
      {
        $group: {
          _id: '$skills.technical.name',
          count: { $sum: 1 },
          avgProficiency: { $avg: '$skills.technical.proficiency' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      analytics: {
        totalProfiles: profileCount,
        publicProfiles,
        privateProfiles,
        averageExperience: avgExperience[0]?.avgExperience || 0,
        topSkills
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;