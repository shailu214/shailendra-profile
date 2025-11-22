// Force Vercel Redeploy 5 - Add debug endpoint
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

// Trust Vercel Proxy (Required for rate limiting behind proxy)
app.set('trust proxy', 1);

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
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5003',
    'https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app',
    'https://myportfolio-backend-shailu214s-projects.vercel.app',
    'https://shailendrachaurasia.com',
    'https://www.shailendrachaurasia.com'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Simple MongoDB connection for production
let connectionError = null;

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      // Log masked URI for debugging
      const uri = process.env.MONGODB_URI;
      const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
      console.log(`🌐 Attempting to connect to MongoDB: ${maskedUri}`);

      await mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        retryWrites: true,
      });
      console.log('✅ MongoDB Connected successfully');
      console.log(`📊 Database Name: ${mongoose.connection.name}`);
      console.log(`🔌 Host: ${mongoose.connection.host}`);
      connectionError = null;
    } else {
      console.log('⚠️  No MONGODB_URI - running without database');
      connectionError = { message: 'MONGODB_URI environment variable not set' };
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error Details:');
    console.error(`   Name: ${error.name}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    if (error.cause) console.error(`   Cause: ${error.cause}`);

    // Store error for debugging endpoint
    connectionError = {
      name: error.name,
      message: error.message,
      code: error.code,
      cause: error.cause?.toString()
    };
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

// Debug endpoint to show connection error
app.get('/api/debug/db', (req, res) => {
  res.json({
    connectionState: mongoose.connection.readyState,
    connectionStates: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    },
    currentState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    hasMongoUri: !!process.env.MONGODB_URI,
    error: connectionError,
    dbName: mongoose.connection.name || null,
    host: mongoose.connection.host || null
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
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);;
});

module.exports = app;