const express = require('express');
const { Blog } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const tags = req.query.tags ? req.query.tags.split(',') : [];
    const featured = req.query.featured === 'true';

    // Build query for published blogs only
    let query = { isPublished: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    if (featured) {
      query.isFeatured = true;
    }

    // Sort options
    let sortOption = { publishedAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') sortOption = { publishedAt: 1 };
    if (req.query.sort === 'popular') sortOption = { views: -1 };
    if (req.query.sort === 'likes') sortOption = { likes: -1 };

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar bio')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content'); // Exclude full content for list view

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all blogs (including unpublished) for admin
// @route   GET /api/blogs/admin
// @access  Private/Admin
router.get('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const category = req.query.category || '';

    // Build query
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (status) {
      query.isPublished = status === 'published';
    }
    
    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content');

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    }).populate('author', 'name avatar bio');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await blog.incrementViews();

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single blog by ID for admin
// @route   GET /api/blogs/admin/:id
// @access  Private/Admin
router.get('/admin/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar bio');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get admin blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id
    };

    const blog = await Blog.create(blogData);
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name avatar bio');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blog: populatedBlog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    
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

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar bio');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    
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

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle blog featured status
// @route   PUT /api/blogs/:id/featured
// @access  Private/Admin
router.put('/:id/featured', protect, restrictTo('admin'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();

    res.json({
      success: true,
      message: `Blog post ${blog.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      blog
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add comment to blog post
// @route   POST /api/blogs/:slug/comments
// @access  Public
router.post('/:slug/comments', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const commentData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      isApproved: false // Comments need admin approval
    };

    await blog.addComment(commentData);

    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully. It will be visible after admin approval.'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get approved comments for a blog post
// @route   GET /api/blogs/:slug/comments
// @access  Public
router.get('/:slug/comments', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const approvedComments = blog.getApprovedComments();

    res.json({
      success: true,
      comments: approvedComments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Manage comments (approve/reject)
// @route   PUT /api/blogs/:id/comments/:commentId
// @access  Private/Admin
router.put('/:id/comments/:commentId', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { isApproved } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.isApproved = isApproved;
    await blog.save();

    res.json({
      success: true,
      message: `Comment ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Manage comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get blog categories (redirects to categories API)
// @route   GET /api/blogs/meta/categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    // Use the new Category model instead of distinct from blogs
    const { Category } = require('../models');
    const categories = await Category.find({ isActive: true })
      .select('name slug postCount')
      .sort({ order: 1, name: 1 });
    
    res.json({
      success: true,
      categories: categories.map(cat => cat.name) // Return array of names for backward compatibility
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get popular tags
// @route   GET /api/blogs/meta/tags
// @access  Public
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      tags: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;