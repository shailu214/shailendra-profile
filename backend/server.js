const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import database configuration
const { connectDB } = require('./config/database');

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

// Connect to database
connectDB();

// Ensure admin user exists (for development)
const ensureAdminUser = async () => {
  try {
    const { User } = require('./models');
    const adminExists = await User.findOne({ email: 'admin@portfolio.com' });
    
    if (!adminExists) {
      console.log('🔧 Creating default admin user...');
      await User.create({
        name: 'Admin User',
        email: 'admin@portfolio.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Portfolio website administrator'
      });
      console.log('✅ Default admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Create admin user after a short delay to ensure DB connection
setTimeout(ensureAdminUser, 2000);

// API Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

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