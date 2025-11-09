const express = require('express');
const { Portfolio } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all published portfolio items
// @route   GET /api/portfolio
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const technology = req.query.technology || '';
    const featured = req.query.featured === 'true';
    const status = req.query.status || '';

    // Build query for published items only
    let query = { isPublished: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (technology) {
      query['technologies.name'] = { $regex: technology, $options: 'i' };
    }
    
    if (featured) {
      query.isFeatured = true;
    }
    
    if (status) {
      query.status = status;
    }

    // Sort options
    let sortOption = { priority: -1, createdAt: -1 }; // Default: priority then newest
    if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
    if (req.query.sort === 'popular') sortOption = { views: -1 };
    if (req.query.sort === 'likes') sortOption = { likes: -1 };
    if (req.query.sort === 'date-desc') sortOption = { startDate: -1 };
    if (req.query.sort === 'date-asc') sortOption = { startDate: 1 };

    const portfolioItems = await Portfolio.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-detailedDescription'); // Exclude detailed description for list view

    const total = await Portfolio.countDocuments(query);

    res.json({
      success: true,
      portfolioItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get portfolio items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all portfolio items for admin
// @route   GET /api/portfolio/admin
// @access  Private/Admin
router.get('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    const published = req.query.published || '';

    // Build query
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (published) {
      query.isPublished = published === 'true';
    }

    const portfolioItems = await Portfolio.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-detailedDescription');

    const total = await Portfolio.countDocuments(query);

    res.json({
      success: true,
      portfolioItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin portfolio items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single portfolio item by slug
// @route   GET /api/portfolio/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Increment view count
    await portfolioItem.incrementViews();

    res.json({
      success: true,
      portfolioItem
    });
  } catch (error) {
    console.error('Get portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single portfolio item by ID for admin
// @route   GET /api/portfolio/admin/:id
// @access  Private/Admin
router.get('/admin/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      portfolioItem
    });
  } catch (error) {
    console.error('Get admin portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new portfolio item
// @route   POST /api/portfolio
// @access  Private/Admin
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const portfolioItem = await Portfolio.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully',
      portfolioItem
    });
  } catch (error) {
    console.error('Create portfolio item error:', error);
    
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

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      portfolioItem
    });
  } catch (error) {
    console.error('Update portfolio item error:', error);
    
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

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndDelete(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle portfolio featured status
// @route   PUT /api/portfolio/:id/featured
// @access  Private/Admin
router.put('/:id/featured', protect, restrictTo('admin'), async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    portfolioItem.isFeatured = !portfolioItem.isFeatured;
    await portfolioItem.save();

    res.json({
      success: true,
      message: `Portfolio item ${portfolioItem.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      portfolioItem
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Like/Unlike portfolio item
// @route   PUT /api/portfolio/:slug/like
// @access  Public
router.put('/:slug/like', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Simple like increment (in a real app, you'd track user likes)
    portfolioItem.likes += 1;
    await portfolioItem.save();

    res.json({
      success: true,
      message: 'Portfolio item liked successfully',
      likes: portfolioItem.likes
    });
  } catch (error) {
    console.error('Like portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get portfolio categories
// @route   GET /api/portfolio/meta/categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Portfolio.distinct('category', { isPublished: true });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get popular technologies
// @route   GET /api/portfolio/meta/technologies
// @access  Public
router.get('/meta/technologies', async (req, res) => {
  try {
    const technologies = await Portfolio.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$technologies' },
      { 
        $group: { 
          _id: '$technologies.name', 
          count: { $sum: 1 },
          color: { $first: '$technologies.color' },
          icon: { $first: '$technologies.icon' }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      technologies: technologies.map(tech => ({
        name: tech._id,
        count: tech.count,
        color: tech.color,
        icon: tech.icon
      }))
    });
  } catch (error) {
    console.error('Get technologies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get portfolio statistics
// @route   GET /api/portfolio/meta/stats
// @access  Public
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await Portfolio.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          inProgressProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Portfolio.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalProjects: 0,
        totalViews: 0,
        totalLikes: 0,
        completedProjects: 0,
        inProgressProjects: 0
      },
      categoryStats: categoryStats.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;