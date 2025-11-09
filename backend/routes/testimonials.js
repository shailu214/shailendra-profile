const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { Testimonial } = require('../models');

const router = express.Router();

// @desc    Get all active testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, featured, minRating, source } = req.query;
    
    let query = { isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (minRating) {
      query.rating = { $gte: parseInt(minRating) };
    }
    
    if (source) {
      query.source = source;
    }

    console.log('Query:', query);
    
    // Check if we have any testimonials, if not seed some test data
    const allTestimonials = await Testimonial.find({});
    console.log('Total testimonials in DB:', allTestimonials.length);
    
    if (allTestimonials.length === 0) {
      console.log('No testimonials found, seeding test data...');
      const testTestimonials = [
        {
          name: 'Sarah Johnson',
          position: 'CEO',
          company: 'TechStart Solutions',
          content: 'Shailendra delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise is outstanding.',
          rating: 5,
          isActive: true,
          isFeatured: true,
          sortOrder: 1,
          source: 'linkedin',
          dateReceived: new Date('2024-08-15'),
          tags: ['ecommerce', 'react', 'full-stack']
        },
        {
          name: 'Michael Chen',
          position: 'Product Manager',
          company: 'Digital Innovations Corp',
          content: 'Working with Shailendra was a game-changer for our project. His React.js skills and SEO optimization boosted our conversion rates by 40%.',
          rating: 5,
          isActive: true,
          isFeatured: true,
          sortOrder: 2,
          source: 'direct',
          dateReceived: new Date('2024-09-10'),
          tags: ['seo', 'react', 'optimization']
        },
        {
          name: 'Emily Rodriguez',
          position: 'Marketing Director',
          company: 'Growth Co.',
          content: 'Professional, reliable, and incredibly skilled. Shailendra transformed our web presence and delivered results that speak for themselves.',
          rating: 5,
          isActive: true,
          isFeatured: true,
          sortOrder: 3,
          source: 'upwork',
          dateReceived: new Date('2024-09-25'),
          tags: ['web-design', 'marketing', 'conversion']
        },
        {
          name: 'David Kumar',
          position: 'Founder',
          company: 'InnovateNow Tech',
          content: 'Exceptional developer with deep expertise in full-stack technologies. Shailendra\'s SEO knowledge helped us rank #1 on Google for our target keywords.',
          rating: 5,
          isActive: true,
          isFeatured: true,
          sortOrder: 4,
          source: 'freelancer',
          dateReceived: new Date('2024-10-05'),
          tags: ['seo', 'full-stack', 'google-ranking']
        }
      ];
      
      await Testimonial.insertMany(testTestimonials);
      console.log('Test testimonials seeded successfully');
    }

    const testimonials = await Testimonial.find(query)
      .sort({ sortOrder: 1, dateReceived: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-adminNotes -email');

    const total = await Testimonial.countDocuments(query);

    console.log('Found testimonials:', testimonials.length);

    res.json({
      success: true,
      count: testimonials.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
router.get('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { 
      limit = 50, 
      page = 1, 
      status, 
      source, 
      search, 
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;
    
    let query = {};
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    if (source) {
      query.source = source;
    }
    
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { company: regex },
        { content: regex },
        { position: regex },
        { tags: { $in: [regex] } }
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const testimonials = await Testimonial.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Testimonial.countDocuments(query);

    res.json({
      success: true,
      count: testimonials.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      testimonials
    });
  } catch (error) {
    console.error('Get admin testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Private/Admin
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonialData = req.body;
    
    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    
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

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    
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

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle testimonial status
// @route   PUT /api/testimonials/:id/toggle
// @access  Private/Admin
router.put('/:id/toggle', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.json({
      success: true,
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
      testimonial
    });
  } catch (error) {
    console.error('Toggle testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reorder testimonials
// @route   PUT /api/testimonials/reorder
// @access  Private/Admin
router.put('/reorder', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { testimonials } = req.body; // Array of { id, sortOrder }

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({
        success: false,
        message: 'Testimonials must be an array'
      });
    }

    // Update each testimonial's sort order
    const updatePromises = testimonials.map(item => 
      Testimonial.findByIdAndUpdate(
        item.id,
        { sortOrder: item.sortOrder },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    const updatedTestimonials = await Testimonial.find({ isActive: true })
      .sort({ sortOrder: 1 });

    res.json({
      success: true,
      message: 'Testimonials reordered successfully',
      testimonials: updatedTestimonials
    });
  } catch (error) {
    console.error('Reorder testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;