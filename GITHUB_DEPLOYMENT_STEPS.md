# 📋 Step-by-Step GitHub & Vercel Deployment Guide

## ✅ Completed Steps
- [x] Git repository initialized
- [x] .gitignore files created for frontend, backend, and root
- [x] GitHub Actions workflows created for CI/CD
- [x] Production deployment configurations ready
- [x] Initial commit made with all project files

## 🚀 Next Steps for Deployment

### Step 1: Create GitHub Repositories

#### Option A: Create Two Separate Repositories (Recommended)
```bash
# 1. Create main repository for the full project
# Go to GitHub.com and create new repository: portfolio-website

# 2. Add remote and push
git remote add origin https://github.com/yourusername/portfolio-website.git
git branch -M main
git push -u origin main
```

#### Option B: Create Monorepo with Both Frontend and Backend
```bash
# Single repository containing both frontend and backend
# This is what we have set up currently
```

### Step 2: Set up Vercel Projects

#### Backend API Deployment
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy Backend (from backend directory)
cd backend
vercel --prod

# 3. During setup, choose:
# - Link to existing project? No
# - Project name: portfolio-backend-api (or your preferred name)
# - Directory: ./backend
# - Override settings? Yes
#   - Build Command: (leave empty)
#   - Output Directory: (leave empty) 
#   - Install Command: npm install
```

#### Frontend Deployment  
```bash
# 1. Deploy Frontend (from frontend directory)
cd ../frontend
vercel --prod

# 2. During setup, choose:
# - Link to existing project? No
# - Project name: portfolio-website (or your preferred name)
# - Directory: ./frontend  
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Install Command: npm install
```

### Step 3: Configure Environment Variables

#### Backend Environment Variables (Vercel Dashboard)
```bash
# Go to Vercel Dashboard > portfolio-backend-api > Settings > Environment Variables
# Add these variables:

NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-website
JWT_SECRET=your-super-secure-64-character-jwt-secret-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PORT=3000
ADMIN_EMAIL=admin@yourportfolio.com
ADMIN_PASSWORD=SecurePassword123!
SITE_URL=https://your-frontend-domain.vercel.app
```

#### Frontend Environment Variables (Vercel Dashboard)
```bash
# Go to Vercel Dashboard > portfolio-website > Settings > Environment Variables
# Add these variables:

VITE_API_URL=https://your-backend-api.vercel.app/api
NODE_ENV=production
```

### Step 4: MongoDB Atlas Setup

#### Create Production Database
```bash
# 1. Go to https://cloud.mongodb.com
# 2. Create new project: "Portfolio-Production"
# 3. Create cluster (M0 Free tier)
# 4. Database Access:
#    - Username: portfoliouser
#    - Password: [generate secure password]
#    - Role: Read and write to any database
# 5. Network Access:
#    - Add IP: 0.0.0.0/0 (Allow from anywhere)
# 6. Get connection string and update MONGODB_URI
```

### Step 5: Seed Production Database

```bash
# After backend is deployed and environment variables are set
# Run this once to populate the database:

cd backend
npm run seed:prod
```

### Step 6: Configure GitHub Actions (Optional but Recommended)

#### Add GitHub Secrets
```bash
# Go to GitHub Repository > Settings > Secrets and variables > Actions
# Add these secrets:

VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id  
VERCEL_BACKEND_PROJECT_ID=backend-project-id
VERCEL_FRONTEND_PROJECT_ID=frontend-project-id
MONGODB_URI=your-mongodb-uri
ADMIN_EMAIL=admin@yourportfolio.com
ADMIN_PASSWORD=SecurePassword123!
SITE_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-api.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
VITE_API_URL=https://your-backend-api.vercel.app/api
```

#### Get Vercel Tokens and IDs
```bash
# 1. Vercel Token:
#    - Go to Vercel Dashboard > Settings > Tokens
#    - Create new token with appropriate scopes

# 2. Organization ID:
#    - Go to Vercel Dashboard > Settings > General
#    - Copy Team ID (Organization ID)

# 3. Project IDs:
#    - Go to each project > Settings > General  
#    - Copy Project ID for both frontend and backend
```

### Step 7: Test Deployment

#### Verify Backend API
```bash
# Test API health endpoint
curl https://your-backend-api.vercel.app/api/health

# Expected response:
{
  "status": "OK", 
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

#### Verify Frontend
```bash
# Visit your frontend URL
https://your-frontend-domain.vercel.app

# Check admin panel
https://your-frontend-domain.vercel.app/admin/login
```

#### Test Admin Login
```bash
# Use credentials from production seeding:
Email: admin@yourportfolio.com (or ADMIN_EMAIL)
Password: [your ADMIN_PASSWORD]
```

### Step 8: Custom Domain (Optional)

#### Add Custom Domain to Vercel
```bash
# 1. Go to Vercel Dashboard > Domain Settings
# 2. Add your custom domain (e.g., yourname.com)
# 3. Configure DNS records as shown by Vercel
# 4. Update CORS_ORIGIN and SITE_URL environment variables
```

## 🚨 Important Security Notes

### Change Default Credentials
```bash
# After first deployment:
# 1. Login to admin panel
# 2. Change admin password immediately
# 3. Update admin email if needed
# 4. Remove or rotate ADMIN_PASSWORD from environment variables
```

### Environment Security
```bash
# Never commit these to Git:
- .env files with real credentials
- MongoDB URIs with passwords
- JWT secrets
- API keys
```

## 🔧 Troubleshooting Common Issues

### Backend Deployment Issues
```bash
# Issue: Build fails
# Solution: Check Node.js version (use 18+)

# Issue: Database connection fails  
# Solution: Check MongoDB Atlas IP whitelist and connection string

# Issue: CORS errors
# Solution: Verify CORS_ORIGIN matches frontend domain exactly
```

### Frontend Deployment Issues
```bash
# Issue: Build fails
# Solution: Check VITE_API_URL is set correctly

# Issue: API calls fail
# Solution: Ensure backend is deployed first and URL is correct

# Issue: Routes not working
# Solution: Check vercel.json rewrites configuration
```

## ✅ Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Vercel with environment variables
- [ ] Frontend deployed to Vercel with API URL configured  
- [ ] Production database seeded
- [ ] Admin login tested and password changed
- [ ] GitHub Actions configured (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All endpoints tested and working

## 🎉 Success Indicators

### Your portfolio website is live when:
- ✅ Frontend loads at your domain
- ✅ Admin panel accessible and functional
- ✅ Blog posts and portfolio items display
- ✅ Contact forms work (if configured)
- ✅ SEO meta tags visible in page source
- ✅ Mobile responsive design working
- ✅ All API endpoints responding correctly

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GitHub Actions**: https://docs.github.com/en/actions
- **Project Issues**: Create issue in your GitHub repository

---

**Total Deployment Time**: 30-45 minutes
**Difficulty Level**: Intermediate
**Cost**: Free (with MongoDB Atlas M0 and Vercel hobby plan)