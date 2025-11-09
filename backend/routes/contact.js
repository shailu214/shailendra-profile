const express = require('express');
const rateLimit = require('express-rate-limit');
const { Contact } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 contact form submissions per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', contactLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      category,
      company,
      budget,
      timeline,
      socialMedia
    } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, message, and category are required'
      });
    }

    // Basic spam detection
    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money'];
    const messageText = `${subject} ${message}`.toLowerCase();
    let spamScore = 0;

    spamKeywords.forEach(keyword => {
      if (messageText.includes(keyword)) {
        spamScore += 20;
      }
    });

    // Check for excessive links
    const linkCount = (messageText.match(/http/g) || []).length;
    if (linkCount > 2) {
      spamScore += linkCount * 10;
    }

    // Get client information
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      category,
      company: company || undefined,
      budget: budget || undefined,
      timeline: timeline || undefined,
      socialMedia: socialMedia || undefined,
      ipAddress,
      userAgent,
      referrer,
      spamScore,
      isSpam: spamScore >= 50
    };

    const contact = await Contact.create(contactData);

    // Send success response (don't reveal spam detection)
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.'
    });

    // TODO: Send email notification to admin
    // TODO: Send auto-reply email to user if enabled in settings

  } catch (error) {
    console.error('Contact form error:', error);
    
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
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Get all contacts for admin
// @route   GET /api/contact
// @access  Private/Admin
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    const priority = req.query.priority || '';
    const isRead = req.query.isRead;
    const isStarred = req.query.isStarred;
    const isSpam = req.query.isSpam;

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
    
    if (priority) {
      query.priority = priority;
    }
    
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    
    if (isStarred !== undefined) {
      query.isStarred = isStarred === 'true';
    }
    
    if (isSpam !== undefined) {
      query.isSpam = isSpam === 'true';
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
    if (req.query.sort === 'priority') sortOption = { priority: 1, createdAt: -1 };
    if (req.query.sort === 'name') sortOption = { name: 1 };

    const contacts = await Contact.find(query)
      .populate('response.respondedBy', 'name')
      .populate('followUps.addedBy', 'name')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    // Get summary statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          new: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          starred: { $sum: { $cond: [{ $eq: ['$isStarred', true] }, 1, 0] } },
          spam: { $sum: { $cond: [{ $eq: ['$isSpam', true] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $in: ['$priority', ['High', 'Urgent']] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        total: 0,
        unread: 0,
        new: 0,
        inProgress: 0,
        starred: 0,
        spam: 0,
        highPriority: 0
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('response.respondedBy', 'name email')
      .populate('followUps.addedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read when viewed
    if (!contact.isRead) {
      await contact.markAsRead();
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.updateStatus(status);

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle star status
// @route   PUT /api/contact/:id/star
// @access  Private/Admin
router.put('/:id/star', protect, restrictTo('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.toggleStar();

    res.json({
      success: true,
      message: `Contact ${contact.isStarred ? 'starred' : 'unstarred'} successfully`,
      contact
    });
  } catch (error) {
    console.error('Toggle star error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add response to contact
// @route   POST /api/contact/:id/response
// @access  Private/Admin
router.post('/:id/response', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.addResponse(message, req.user.id);

    res.json({
      success: true,
      message: 'Response added successfully',
      contact
    });

    // TODO: Send email response to the contact person

  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add follow-up note
// @route   POST /api/contact/:id/followup
// @access  Private/Admin
router.post('/:id/followup', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Follow-up note is required'
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.addFollowUp(note, req.user.id);

    res.json({
      success: true,
      message: 'Follow-up note added successfully',
      contact
    });
  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark contact as spam
// @route   PUT /api/contact/:id/spam
// @access  Private/Admin
router.put('/:id/spam', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { isSpam } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isSpam },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: `Contact marked as ${isSpam ? 'spam' : 'not spam'}`,
      contact
    });
  } catch (error) {
    console.error('Mark spam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get contact analytics
// @route   GET /api/contact/analytics
// @access  Private/Admin
router.get('/meta/analytics', protect, restrictTo('admin'), async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get contacts by category
    const categoryStats = await Contact.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get contacts over time
    const timeStats = await Contact.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get priority distribution
    const priorityStats = await Contact.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get source distribution
    const sourceStats = await Contact.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        categoryStats,
        timeStats,
        priorityStats,
        sourceStats
      }
    });
  } catch (error) {
    console.error('Get contact analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;