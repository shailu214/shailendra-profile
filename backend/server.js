// Force Vercel Redeploy - Clean server.js with proper syntax and MongoDB connection
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

// Trust Vercel Proxy (required for rate limiting behind proxy)
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

// MongoDB connection with caching for serverless
let connectionError = null;
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error('❌ MONGODB_URI is missing');
      connectionError = { message: 'MONGODB_URI is missing' };
      return null;
    }

    console.log('🌐 Connecting to MongoDB...');
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected successfully');
      connectionError = null;
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Connection Error:', error);
      connectionError = error;
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  // Skip for static files
  if (req.path.startsWith('/uploads')) {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    next();
  }
});

// Initialize connection
connectDB();

// Health check endpoint (root)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'Portfolio Website API',
    message: 'API server is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      name: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
      error: connectionError || null
    }
  });
});

// Debug endpoint for DB connection details
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

// Load API routes (if any)
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading API routes:', error.message);
  // Fallback for API routes
  app.get('/api/*', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'API routes not available',
      error: 'Server is starting up'
    });
  });
}

module.exports = app;