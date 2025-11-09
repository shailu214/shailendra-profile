const express = require('express');
const mongoose = require('mongoose');

// Import all route modules
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const blogRoutes = require('./blog');
const portfolioRoutes = require('./portfolio');
const contactRoutes = require('./contact');
const settingsRoutes = require('./settings');
const skillsRoutes = require('./skills');
const testimonialsRoutes = require('./testimonials');
const pagesRoutes = require('./pages');
const dashboardRoutes = require('./dashboard');

const router = express.Router();

// Portfolio-specific health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const dbName = mongoose.connection.name || 'portfolio-website';
    
    res.json({
      success: true,
      service: 'Portfolio Website API',
      project: 'Full-Stack Portfolio Website',
      message: 'Portfolio API server is healthy and running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      server: {
        uptime: Math.floor(process.uptime()),
        port: process.env.PORT || 5000,
        node_version: process.version
      },
      database: {
        status: dbStatus,
        name: dbName,
        host: mongoose.connection.host || 'memory-server'
      },
      endpoints: {
        auth: '/api/auth - Authentication & user management',
        portfolio: '/api/portfolio - Portfolio projects management', 
        blog: '/api/blog - Blog posts & comments',
        contact: '/api/contact - Contact form submissions',
        settings: '/api/settings - Site configuration',
        skills: '/api/skills - Skills & technologies',
        testimonials: '/api/testimonials - Client testimonials management',
        pages: '/api/pages - Page management & SEO',
        dashboard: '/api/dashboard - Admin dashboard statistics & analytics'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      service: 'Portfolio Website API',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed portfolio service status
router.get('/portfolio-status', async (req, res) => {
  try {
    const { User, Blog, Portfolio, Settings } = require('../models');
    
    // Get counts for each collection
    const stats = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Portfolio.countDocuments(),
      Settings.countDocuments()
    ]);

    res.json({
      success: true,
      service: 'Portfolio Website API',
      message: 'Portfolio service detailed status',
      timestamp: new Date().toISOString(),
      data: {
        users: stats[0],
        blog_posts: stats[1],
        portfolio_projects: stats[2],
        settings_configured: stats[3] > 0
      },
      health: 'operational'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      service: 'Portfolio Website API',
      message: 'Status check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/blog', blogRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/skills', skillsRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/pages', pagesRoutes);
router.use('/dashboard', dashboardRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`
  });
});

module.exports = router;