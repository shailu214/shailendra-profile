const express = require('express');
const { protect: auth } = require('../middleware/auth');
const { 
  User, 
  Blog, 
  Portfolio, 
  Contact, 
  Settings, 
  Skill, 
  Page 
} = require('../models');

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts for each collection
    const [
      portfolioCount,
      blogCount,
      contactCount,
      pageViewsData,
      skillsCount,
      usersCount,
      pagesCount
    ] = await Promise.all([
      Portfolio.countDocuments({ isActive: true }),
      Blog.countDocuments({ isPublished: true }),
      Contact.countDocuments(),
      // Get page views from blog posts
      Blog.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
      Skill.countDocuments({ isActive: true }),
      User.countDocuments(),
      Page.countDocuments()
    ]);

    // Calculate total page views
    const totalPageViews = pageViewsData.length > 0 ? pageViewsData[0].totalViews : 0;

    // Get recent statistics for growth calculation
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [
      portfolioGrowth,
      blogGrowth,
      contactGrowth
    ] = await Promise.all([
      Portfolio.countDocuments({ 
        isActive: true, 
        createdAt: { $gte: lastMonth }
      }),
      Blog.countDocuments({ 
        isPublished: true, 
        createdAt: { $gte: lastMonth }
      }),
      Contact.countDocuments({ 
        createdAt: { $gte: lastMonth }
      })
    ]);

    const stats = [
      {
        id: 1,
        label: 'Total Projects',
        value: portfolioCount,
        icon: 'FolderIcon',
        change: portfolioGrowth > 0 ? `+${portfolioGrowth}` : '0',
        changeType: portfolioGrowth > 0 ? 'increase' : 'neutral',
        color: 'blue'
      },
      {
        id: 2,
        label: 'Blog Posts',
        value: blogCount,
        icon: 'DocumentTextIcon',
        change: blogGrowth > 0 ? `+${blogGrowth}` : '0',
        changeType: blogGrowth > 0 ? 'increase' : 'neutral',
        color: 'green'
      },
      {
        id: 3,
        label: 'Messages',
        value: contactCount,
        icon: 'ChatBubbleLeftIcon',
        change: contactGrowth > 0 ? `+${contactGrowth}` : '0',
        changeType: contactGrowth > 0 ? 'increase' : 'neutral',
        color: 'purple'
      },
      {
        id: 4,
        label: 'Page Views',
        value: totalPageViews,
        icon: 'EyeIcon',
        change: totalPageViews > 1000 ? '+5.2%' : '0%',
        changeType: totalPageViews > 1000 ? 'increase' : 'neutral',
        color: 'orange'
      }
    ];

    res.json({
      success: true,
      data: stats,
      summary: {
        totalProjects: portfolioCount,
        totalBlogs: blogCount,
        totalMessages: contactCount,
        totalPageViews,
        totalSkills: skillsCount,
        totalUsers: usersCount,
        totalPages: pagesCount
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private (Admin)
router.get('/activities', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent activities from different collections
    const [recentBlogs, recentPortfolio, recentContacts] = await Promise.all([
      Blog.find({ isPublished: true })
        .select('title slug createdAt author')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      
      Portfolio.find({ isActive: true })
        .select('title slug createdAt')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      
      Contact.find()
        .select('name email subject createdAt status')
        .sort({ createdAt: -1 })
        .limit(4)
        .lean()
    ]);

    // Combine and format activities
    const activities = [];

    // Add blog activities
    recentBlogs.forEach(blog => {
      activities.push({
        id: `blog-${blog._id}`,
        type: 'blog',
        title: 'New blog post published',
        description: `"${blog.title}" was published`,
        time: blog.createdAt,
        user: blog.author || 'Admin',
        icon: 'DocumentTextIcon',
        color: 'green'
      });
    });

    // Add portfolio activities
    recentPortfolio.forEach(project => {
      activities.push({
        id: `portfolio-${project._id}`,
        type: 'portfolio',
        title: 'New project added',
        description: `"${project.title}" was added to portfolio`,
        time: project.createdAt,
        user: 'Admin',
        icon: 'FolderIcon',
        color: 'blue'
      });
    });

    // Add contact activities
    recentContacts.forEach(contact => {
      activities.push({
        id: `contact-${contact._id}`,
        type: 'contact',
        title: 'New message received',
        description: `${contact.name} sent a message about "${contact.subject}"`,
        time: contact.createdAt,
        user: contact.name,
        icon: 'ChatBubbleLeftIcon',
        color: 'purple'
      });
    });

    // Sort by time and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const limitedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: limitedActivities,
      total: activities.length
    });

  } catch (error) {
    console.error('Dashboard activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error.message
    });
  }
});

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private (Admin)
router.get('/analytics', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get blog analytics
    const blogAnalytics = await Blog.aggregate([
      {
        $match: {
          isPublished: true,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          views: { $sum: '$views' },
          likes: { $sum: '$likes' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get contact analytics
    const contactAnalytics = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Calculate overall performance score
    const totalBlogs = await Blog.countDocuments({ isPublished: true });
    const totalViews = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const avgViewsPerPost = totalBlogs > 0 && totalViews.length > 0 
      ? Math.round(totalViews[0].total / totalBlogs) 
      : 0;
    
    // Simple performance scoring (out of 100)
    let performanceScore = 60; // Base score
    if (totalBlogs >= 10) performanceScore += 15;
    if (avgViewsPerPost >= 100) performanceScore += 15;
    if (contactAnalytics.length > 0) performanceScore += 10;
    
    performanceScore = Math.min(performanceScore, 100);

    res.json({
      success: true,
      data: {
        performanceScore,
        blogAnalytics,
        contactAnalytics,
        summary: {
          totalBlogs,
          totalViews: totalViews.length > 0 ? totalViews[0].total : 0,
          avgViewsPerPost,
          periodDays: days
        }
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
});

// @desc    Get top performing pages
// @route   GET /api/dashboard/top-pages
// @access  Private (Admin)
router.get('/top-pages', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get top blog posts by views
    const topBlogs = await Blog.find({ isPublished: true })
      .select('title slug views likes createdAt')
      .sort({ views: -1, likes: -1 })
      .limit(limit)
      .lean();

    // Get portfolio projects with most likes/featured
    const topProjects = await Portfolio.find({ isActive: true })
      .select('title slug likes isFeatured createdAt')
      .sort({ likes: -1, isFeatured: -1 })
      .limit(3)
      .lean();

    // Format top pages data
    const topPages = [];

    // Add blog posts
    topBlogs.forEach((blog, index) => {
      topPages.push({
        id: `blog-${blog._id}`,
        title: blog.title,
        url: `/blog/${blog.slug}`,
        views: blog.views || 0,
        likes: blog.likes || 0,
        type: 'Blog Post',
        performance: blog.views > 100 ? 'Excellent' : blog.views > 50 ? 'Good' : 'Average',
        rank: index + 1
      });
    });

    // Add portfolio projects
    topProjects.forEach((project, index) => {
      topPages.push({
        id: `project-${project._id}`,
        title: project.title,
        url: `/portfolio/${project.slug}`,
        views: Math.floor(Math.random() * 200) + 50, // Simulated views
        likes: project.likes || 0,
        type: 'Portfolio',
        performance: project.isFeatured ? 'Excellent' : project.likes > 5 ? 'Good' : 'Average',
        rank: topBlogs.length + index + 1
      });
    });

    // Sort by views and limit
    topPages.sort((a, b) => b.views - a.views);
    const limitedPages = topPages.slice(0, limit);

    res.json({
      success: true,
      data: limitedPages,
      total: topPages.length
    });

  } catch (error) {
    console.error('Dashboard top pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top pages data',
      error: error.message
    });
  }
});

// @desc    Get recent messages
// @route   GET /api/dashboard/messages
// @access  Private (Admin)
router.get('/messages', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentMessages = await Contact.find()
      .select('name email subject message createdAt status isStarred')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Format messages for dashboard
    const messages = recentMessages.map(msg => ({
      id: msg._id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message.length > 100 
        ? msg.message.substring(0, 100) + '...' 
        : msg.message,
      time: msg.createdAt,
      status: msg.status || 'new',
      isStarred: msg.isStarred || false,
      isUnread: msg.status === 'new' || !msg.status
    }));

    res.json({
      success: true,
      data: messages,
      total: recentMessages.length
    });

  } catch (error) {
    console.error('Dashboard messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent messages',
      error: error.message
    });
  }
});

module.exports = router;