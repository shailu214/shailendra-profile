const express = require('express');
const { Skill } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all active skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category || '';
    const highlighted = req.query.highlighted === 'true';
    const trending = req.query.trending === 'true';

    // Build query for active skills only
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (highlighted) {
      query.isHighlighted = true;
    }
    
    if (trending) {
      query['usage.trending'] = true;
    }

    // Sort by sort order, then proficiency
    const skills = await Skill.find(query)
      .sort({ sortOrder: 1, proficiency: -1 })
      .select('-resources -certifications'); // Exclude detailed info for public view

    // Group by category
    const skillsByCategory = {};
    skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    res.json({
      success: true,
      skills,
      skillsByCategory
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all skills for admin
// @route   GET /api/skills/admin
// @access  Private/Admin
router.get('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const isActive = req.query.isActive;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skills = await Skill.find(query)
      .populate('projects', 'title slug')
      .sort({ category: 1, sortOrder: 1, proficiency: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Skill.countDocuments(query);

    res.json({
      success: true,
      skills,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Private/Admin
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('projects', 'title slug startDate endDate status');

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      skill
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Skill with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    console.error('Update skill error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle skill highlighted status
// @route   PUT /api/skills/:id/highlight
// @access  Private/Admin
router.put('/:id/highlight', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    skill.isHighlighted = !skill.isHighlighted;
    await skill.save();

    res.json({
      success: true,
      message: `Skill ${skill.isHighlighted ? 'highlighted' : 'unhighlighted'} successfully`,
      skill
    });
  } catch (error) {
    console.error('Toggle highlight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update skill project count
// @route   PUT /api/skills/:id/update-projects
// @access  Private/Admin
router.put('/:id/update-projects', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await skill.updateProjectCount();
    await skill.checkTrending();

    res.json({
      success: true,
      message: 'Skill project count updated successfully',
      skill
    });
  } catch (error) {
    console.error('Update project count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add certification to skill
// @route   POST /api/skills/:id/certifications
// @access  Private/Admin
router.post('/:id/certifications', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await skill.addCertification(req.body);

    res.status(201).json({
      success: true,
      message: 'Certification added successfully',
      skill
    });
  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add learning resource to skill
// @route   POST /api/skills/:id/resources
// @access  Private/Admin
router.post('/:id/resources', protect, restrictTo('admin'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await skill.addResource(req.body);

    res.status(201).json({
      success: true,
      message: 'Resource added successfully',
      skill
    });
  } catch (error) {
    console.error('Add resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update multiple skills order
// @route   PUT /api/skills/reorder
// @access  Private/Admin
router.put('/reorder', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { skills } = req.body; // Array of {id, sortOrder}

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills array is required'
      });
    }

    // Update sort order for each skill
    const updatePromises = skills.map(({ id, sortOrder }) =>
      Skill.findByIdAndUpdate(id, { sortOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Skills reordered successfully'
    });
  } catch (error) {
    console.error('Reorder skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get skill categories
// @route   GET /api/skills/meta/categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Skill.distinct('category', { isActive: true });
    
    // Get count for each category
    const categoryStats = await Skill.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgProficiency: { $avg: '$proficiency' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories,
      categoryStats: categoryStats.map(cat => ({
        category: cat._id,
        count: cat.count,
        avgProficiency: Math.round(cat.avgProficiency)
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get skill statistics
// @route   GET /api/skills/meta/stats
// @access  Public
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await Skill.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalSkills: { $sum: 1 },
          avgProficiency: { $avg: '$proficiency' },
          highlightedSkills: {
            $sum: { $cond: [{ $eq: ['$isHighlighted', true] }, 1, 0] }
          },
          trendingSkills: {
            $sum: { $cond: [{ $eq: ['$usage.trending', true] }, 1, 0] }
          },
          expertLevel: {
            $sum: { $cond: [{ $gte: ['$proficiency', 90] }, 1, 0] }
          },
          advancedLevel: {
            $sum: { $cond: [{ $and: [{ $gte: ['$proficiency', 75] }, { $lt: ['$proficiency', 90] }] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalSkills: 0,
        avgProficiency: 0,
        highlightedSkills: 0,
        trendingSkills: 0,
        expertLevel: 0,
        advancedLevel: 0
      }
    });
  } catch (error) {
    console.error('Get skill stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;