const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',  // Allow both frontend ports
    'http://localhost:5175',  // Allow for other ports
    'http://localhost:5003',   // Allow backend port for testing
    'https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app', // Production frontend
    'https://myportfolio-backend-shailu214s-projects.vercel.app'     // Production backend
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Simple MongoDB connection for production
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      console.log('🌐 Connecting to MongoDB Atlas...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        retryWrites: true,
      });
      console.log('✅ MongoDB Connected successfully');
    } else {
      console.log('⚠️  No MONGODB_URI - running without database');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't fail the server startup in production
  }
};

// Connect to database
connectDB();

// Health check endpoint
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