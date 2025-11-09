const express = require('express');
const { Settings } = require('../models');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public (returns only public settings)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getInstance();

    // Return only public settings
    const publicSettings = {
      site: settings.site,
      personal: {
        name: settings.personal.name,
        title: settings.personal.title,
        bio: settings.personal.bio,
        avatar: settings.personal.avatar,
        location: settings.personal.location,
        availability: settings.personal.availability
      },
      contact: {
        email: settings.contact.email,
        phone: settings.contact.phone,
        address: settings.contact.address,
        workingHours: settings.contact.workingHours
      },
      social: settings.getActiveSocialLinks(),
      theme: settings.theme,
      navigation: {
        showLogo: settings.navigation.showLogo,
        menuItems: settings.getMenuItems(),
        showSocial: settings.navigation.showSocial,
        stickyHeader: settings.navigation.stickyHeader
      },
      homepage: settings.homepage,
      seo: {
        defaultTitle: settings.seo.defaultTitle,
        titleSeparator: settings.seo.titleSeparator,
        defaultDescription: settings.seo.defaultDescription,
        defaultKeywords: settings.seo.defaultKeywords,
        openGraphImage: settings.seo.openGraphImage,
        twitterHandle: settings.seo.twitterHandle
      },
      analytics: {
        googleAnalytics: {
          trackingId: settings.analytics.googleAnalytics.trackingId,
          enabled: settings.analytics.googleAnalytics.enabled
        },
        googleTagManager: {
          containerId: settings.analytics.googleTagManager.containerId,
          enabled: settings.analytics.googleTagManager.enabled
        },
        facebookPixel: {
          pixelId: settings.analytics.facebookPixel.pixelId,
          enabled: settings.analytics.facebookPixel.enabled
        },
        hotjar: {
          siteId: settings.analytics.hotjar.siteId,
          enabled: settings.analytics.hotjar.enabled
        }
      },
      maintenance: settings.maintenance.mode ? {
        mode: settings.maintenance.mode,
        message: settings.maintenance.message,
        estimatedTime: settings.maintenance.estimatedTime
      } : { mode: false }
    };

    res.json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all settings (admin only)
// @route   GET /api/settings/admin
// @access  Private/Admin
router.get('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const settings = await Settings.getInstance();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    let settings = await Settings.getInstance();

    // Update settings with provided data
    Object.keys(req.body).forEach(key => {
      if (settings.schema.paths[key]) {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    
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

// @desc    Update specific setting section
// @route   PUT /api/settings/:section
// @access  Private/Admin
router.put('/:section', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = [
      'site', 'personal', 'contact', 'social', 'theme', 
      'navigation', 'homepage', 'analytics', 'email', 
      'seo', 'security', 'maintenance'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings section'
      });
    }

    let settings = await Settings.getInstance();
    settings[section] = { ...settings[section], ...req.body };

    await settings.save();

    res.json({
      success: true,
      message: `${section} settings updated successfully`,
      settings: settings[section]
    });
  } catch (error) {
    console.error('Update settings section error:', error);
    
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

// @desc    Get working hours status
// @route   GET /api/settings/working-hours
// @access  Public
router.get('/working-hours', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    const isInWorkingHours = settings.isInWorkingHours();
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const workingHours = settings.getWorkingHours(currentDay);

    res.json({
      success: true,
      workingHours: {
        isInWorkingHours,
        currentDay,
        todaySchedule: workingHours,
        timezone: settings.contact.workingHours.timezone,
        availability: settings.personal.availability
      }
    });
  } catch (error) {
    console.error('Get working hours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle maintenance mode
// @route   PUT /api/settings/maintenance
// @access  Private/Admin
router.put('/maintenance', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { mode, message, allowedIPs, estimatedTime } = req.body;

    let settings = await Settings.getInstance();
    
    settings.maintenance.mode = mode;
    if (message) settings.maintenance.message = message;
    if (allowedIPs) settings.maintenance.allowedIPs = allowedIPs;
    if (estimatedTime) settings.maintenance.estimatedTime = estimatedTime;

    await settings.save();

    res.json({
      success: true,
      message: `Maintenance mode ${mode ? 'enabled' : 'disabled'}`,
      maintenance: settings.maintenance
    });
  } catch (error) {
    console.error('Toggle maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add menu item
// @route   POST /api/settings/menu-items
// @access  Private/Admin
router.post('/menu-items', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { label, path, isExternal = false, order = 0 } = req.body;

    if (!label || !path) {
      return res.status(400).json({
        success: false,
        message: 'Label and path are required'
      });
    }

    let settings = await Settings.getInstance();
    
    settings.navigation.menuItems.push({
      label,
      path,
      isExternal,
      order,
      isActive: true
    });

    await settings.save();

    res.json({
      success: true,
      message: 'Menu item added successfully',
      menuItems: settings.getMenuItems()
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update menu item
// @route   PUT /api/settings/menu-items/:id
// @access  Private/Admin
router.put('/menu-items/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    let settings = await Settings.getInstance();
    
    const menuItem = settings.navigation.menuItems.id(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      if (menuItem[key] !== undefined) {
        menuItem[key] = req.body[key];
      }
    });

    await settings.save();

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      menuItems: settings.getMenuItems()
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete menu item
// @route   DELETE /api/settings/menu-items/:id
// @access  Private/Admin
router.delete('/menu-items/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    let settings = await Settings.getInstance();
    
    const menuItem = settings.navigation.menuItems.id(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem.remove();
    await settings.save();

    res.json({
      success: true,
      message: 'Menu item deleted successfully',
      menuItems: settings.getMenuItems()
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Test email configuration
// @route   POST /api/settings/test-email
// @access  Private/Admin
router.post('/test-email', protect, restrictTo('admin'), async (req, res) => {
  try {
    // TODO: Implement email testing functionality
    // This would send a test email using the configured SMTP settings
    
    res.json({
      success: true,
      message: 'Email test functionality not implemented yet'
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reset settings to defaults
// @route   POST /api/settings/reset
// @access  Private/Admin
router.post('/reset', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { section } = req.body;

    let settings = await Settings.getInstance();

    if (section && section !== 'all') {
      // Reset specific section to defaults
      const defaultSettings = new Settings();
      settings[section] = defaultSettings[section];
    } else {
      // Reset all settings (but keep personal info)
      const personalInfo = settings.personal;
      const siteInfo = settings.site;
      
      await Settings.findByIdAndDelete(settings._id);
      settings = await Settings.getInstance();
      
      settings.personal = personalInfo;
      settings.site = siteInfo;
    }

    await settings.save();

    res.json({
      success: true,
      message: section === 'all' ? 'All settings reset to defaults' : `${section} settings reset to defaults`,
      settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;