const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'Portfolio Website API',
    message: 'API server is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      name: mongoose.connection.name || 'Not connected'
    }
  });
});

// API Routes - Load conditionally to prevent startup failures
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading API routes:', error.message);
  // Provide fallback routes for basic functionality
  app.get('/api/*', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'API routes not available',
      error: 'Server is starting up'
    });
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;