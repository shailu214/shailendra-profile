// Minimal test server
const http = require('http');
const url = require('url');

const PORT = 5000;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${req.method} ${path}`);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (path === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Minimal server running',
      port: PORT,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  if (path === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        console.log('Login attempt:', email);
        
        if (email === 'admin@portfolio.com' && password === 'admin123') {
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            token: 'test-token-' + Date.now(),
            user: {
              id: '1',
              name: 'Admin User',
              email: email,
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid credentials'
          }));
        }
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid JSON'
        }));
      }
    });
    return;
  }
  
  if (path === '/api/auth/me' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (token && token.startsWith('test-token-')) {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@portfolio.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }));
    } else {
      res.writeHead(401);
      res.end(JSON.stringify({
        success: false,
        message: 'Unauthorized'
      }));
    }
    return;
  }
  
  // Default 404
  res.writeHead(404);
  res.end(JSON.stringify({ success: false, message: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Minimal auth server running on port ${PORT}`);
  console.log(`📝 Admin credentials: admin@portfolio.com / admin123`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});