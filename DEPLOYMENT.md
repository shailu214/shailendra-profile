# Production Deployment Guide

## Overview
This guide covers deploying the full-stack portfolio website to production platforms.

## Architecture
- **Frontend**: React + TypeScript + Vite → Deployed to Netlify/Vercel
- **Backend**: Node.js + Express + MongoDB → Deployed to Railway/Render/Heroku
- **Database**: MongoDB Atlas (Production)

## 1. Database Setup (MongoDB Atlas)

### Step 1: Create Production Database
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster or use existing one
3. Create a database user for production
4. Configure IP whitelist (0.0.0.0/0 for now, restrict later)
5. Get connection string

### Step 2: Update Backend Environment
Create `.env.production` in backend folder:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio-website-prod?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-here-change-this
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-domain.netlify.app
```

## 2. Backend Deployment (Railway - Recommended)

### Option A: Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

### Option B: Render
1. Connect GitHub repo to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push

### Option C: Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-portfolio-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-connection-string
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

## 3. Frontend Deployment (Netlify - Recommended)

### Step 1: Build Configuration
Create `netlify.toml` in root:
```toml
[build]
  base = "frontend/"
  command = "npm run build"
  publish = "dist/"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Environment Variables
Create `.env.production` in frontend folder:
```bash
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Step 3: Deploy to Netlify
1. Connect GitHub repo to Netlify
2. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Add environment variables in Netlify dashboard
4. Deploy automatically on push

### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

## 4. Domain Configuration

### Custom Domain Setup
1. **Netlify**: Add custom domain in site settings
2. **Backend**: Update CORS settings with your domain
3. **SSL**: Automatic with Netlify/Vercel

### Update CORS Settings
In `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-domain.com',
    'https://your-domain.netlify.app'
  ],
  credentials: true
}));
```

## 5. Post-Deployment Tasks

### 1. Seed Production Database
```bash
# SSH to your backend deployment or run locally with prod DB
NODE_ENV=production npm run seed
```

### 2. Test Production URLs
- Frontend: `https://your-domain.netlify.app`
- Backend API: `https://your-api.railway.app/api/health`
- Admin Login: `https://your-domain.netlify.app/admin/login`

### 3. Security Checklist
- [ ] Change default admin password
- [ ] Restrict MongoDB IP whitelist
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS only
- [ ] Set secure JWT secret
- [ ] Configure rate limiting
- [ ] Set up monitoring

## 6. Monitoring & Maintenance

### Analytics Setup
1. Add Google Analytics tracking ID in admin settings
2. Configure error tracking (Sentry recommended)
3. Set up uptime monitoring (UptimeRobot)

### Backup Strategy
1. MongoDB Atlas automatic backups
2. GitHub repository for code
3. Regular database exports

## 7. Quick Deployment Commands

### Frontend (Netlify)
```bash
cd frontend
npm run build
# Drag dist folder to Netlify deploy
```

### Backend (Railway)
```bash
cd backend
railway up
```

### Full Stack Update
```bash
# Update both simultaneously
git add .
git commit -m "Production update"
git push origin main
# Auto-deploys to both platforms
```

## Environment URLs
- **Development Frontend**: http://localhost:5173
- **Development Backend**: http://localhost:5000
- **Production Frontend**: https://your-domain.netlify.app
- **Production Backend**: https://your-api.railway.app

## Support
For deployment issues, check:
1. Build logs in deployment platform
2. Browser console for API connection errors
3. Backend logs for database connection issues
4. CORS settings for cross-origin errors