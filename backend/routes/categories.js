const express = require('express');
const { Category, Blog } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all categories for admin (including inactive)
// @route   GET /api/categories/admin
// @access  Private/Admin
router.get('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get admin categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name, description, color, order } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim(),
      color: color || '#3B82F6',
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    
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

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name, description, color, order, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (color) category.color = color;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    
    // Update post count
    await category.updatePostCount();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    
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

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category is being used by any blog posts
    const blogCount = await Blog.countDocuments({ category: category.name });
    
    if (blogCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is used by ${blogCount} blog post(s). Please reassign those posts to another category first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Bulk update category order
// @route   PUT /api/categories/bulk/order
// @access  Private/Admin
router.put('/bulk/order', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, order }

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories must be an array'
      });
    }

    // Update each category's order
    const updatePromises = categories.map(({ id, order }) => 
      Category.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Category order updated successfully'
    });
  } catch (error) {
    console.error('Update category order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update all category post counts
// @route   PUT /api/categories/bulk/update-counts
// @access  Private/Admin
router.put('/bulk/update-counts', protect, restrictTo('admin'), async (req, res) => {
  try {
    await Category.updateAllPostCounts();

    res.json({
      success: true,
      message: 'All category post counts updated successfully'
    });
  } catch (error) {
    console.error('Update category counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private/Admin
router.get('/admin/stats', protect, restrictTo('admin'), async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    const categoriesWithPosts = await Category.countDocuments({ postCount: { $gt: 0 } });
    
    // Get top categories by post count
    const topCategories = await Category.find({ postCount: { $gt: 0 } })
      .sort({ postCount: -1 })
      .limit(5)
      .select('name postCount');

    res.json({
      success: true,
      data: {
        totalCategories,
        activeCategories,
        categoriesWithPosts,
        emptyCategories: totalCategories - categoriesWithPosts,
        topCategories
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;