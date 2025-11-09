const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple in-memory storage for demo
const admin = {
  email: 'admin@portfolio.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "admin123"
  name: 'Admin',
  role: 'admin'
};

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));
app.use(express.json());

// Simple auth endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);
    
    // Check credentials
    if (email !== admin.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate simple token (in production use JWT)
    const token = 'demo-token-' + Date.now();
    
    res.json({
      success: true,
      token,
      user: {
        id: '1',
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Profile endpoint
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('demo-token-')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  res.json({
    success: true,
    user: {
      id: '1',
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Simple auth server running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Auth Server running on port ${PORT}`);
  console.log(`📝 Admin credentials: admin@portfolio.com / admin123`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;