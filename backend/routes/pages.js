const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect: auth } = require('../middleware/auth');

// @route   GET /api/pages
// @desc    Get all pages (with optional filtering)
// @access  Public (filtered) / Private (admin - full data)
router.get('/', async (req, res) => {
  try {
    const { status, template, includeAnalytics } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';
    
    let query = {};
    
    // Add filters
    if (status) query.status = status;
    if (template) query.template = template;
    
    // If not admin, only show published pages
    if (!isAdmin) {
      query.status = 'published';
    }

    let pages = await Page.find(query)
      .sort({ isHomepage: -1, createdAt: -1 });
    
    // Transform data based on access level
    if (isAdmin && includeAnalytics === 'true') {
      // Admin gets full data including analytics
      res.json({
        success: true,
        count: pages.length,
        data: pages
      });
    } else if (isAdmin) {
      // Admin gets full data without analytics
      res.json({
        success: true,
        count: pages.length,
        data: pages.map(page => page.toPublic())
      });
    } else {
      // Public gets limited data
      res.json({
        success: true,
        count: pages.length,
        data: pages.map(page => ({
          _id: page._id,
          name: page.name,
          slug: page.slug,
          path: page.path,
          seo: {
            title: page.seo.title,
            metaDescription: page.seo.metaDescription,
            keywords: page.seo.keywords,
            canonicalUrl: page.seo.canonicalUrl
          },
          content: page.content,
          template: page.template
        }))
      });
    }
  } catch (error) {
    console.error('Pages fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/pages/:id
// @desc    Get single page by ID or slug
// @access  Public (published) / Private (admin - any status)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';
    
    // Try to find by ID first, then by slug
    let page = await Page.findById(identifier) || 
               await Page.findOne({ slug: identifier });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // Check access permissions
    if (!isAdmin && page.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // Increment view count for public access
    if (!isAdmin) {
      await page.incrementViews();
    }

    res.json({
      success: true,
      data: isAdmin ? page : page.toPublic()
    });
  } catch (error) {
    console.error('Page fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/pages
// @desc    Create new page
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Validate admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const pageData = req.body;
    
    // If this is set as homepage, remove homepage flag from other pages
    if (pageData.isHomepage) {
      await Page.updateMany({}, { isHomepage: false });
    }

    // Create new page
    const page = new Page(pageData);
    await page.save();

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: page
    });
  } catch (error) {
    console.error('Page creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Page with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/pages/:id
// @desc    Update page
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // If this is set as homepage, remove homepage flag from other pages
    if (updateData.isHomepage) {
      await Page.updateMany({ _id: { $ne: id } }, { isHomepage: false });
    }

    const page = await Page.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Page update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Page with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/pages/:id
// @desc    Delete page
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Validate admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;
    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // Prevent deletion of homepage
    if (page.isHomepage) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the homepage. Set another page as homepage first.'
      });
    }

    await Page.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    console.error('Page deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/pages/bulk
// @desc    Create multiple pages (for initial setup)
// @access  Private (Admin only)
router.post('/bulk', auth, async (req, res) => {
  try {
    // Validate admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { pages } = req.body;
    
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of pages'
      });
    }

    const createdPages = await Page.insertMany(pages);

    res.status(201).json({
      success: true,
      message: `${createdPages.length} pages created successfully`,
      data: createdPages
    });
  } catch (error) {
    console.error('Bulk pages creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating pages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/pages/seo/analysis/:id
// @desc    Get SEO analysis for a specific page
// @access  Private (Admin only)
router.get('/seo/analysis/:id', auth, async (req, res) => {
  try {
    // Validate admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { id } = req.params;
    const page = await Page.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    // Return data formatted for SEO analysis
    const seoData = {
      title: page.seo.title,
      metaDescription: page.seo.metaDescription,
      keyphrase: page.seo.focusKeyphrase,
      content: page.content.sections
        .map(section => section.content)
        .join('\n'),
      url: page.fullUrl,
      keywords: page.seo.keywords
    };

    res.json({
      success: true,
      data: seoData
    });
  } catch (error) {
    console.error('SEO analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing SEO',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;