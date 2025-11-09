#!/bin/bash

# 🚀 Vercel Deployment Script  
# Run this after pushing to GitHub

echo "🌐 Portfolio Website - Vercel Deployment"
echo "========================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🔧 Step 1: Deploy Backend API"
echo "=============================="
cd backend || exit

echo "📡 Deploying backend to Vercel..."
echo "Choose these settings during setup:"
echo "  - Link to existing project? No"
echo "  - Project name: portfolio-backend-api"
echo "  - Deploy? Yes"
echo ""

read -p "Press Enter to deploy backend..."
vercel --prod

BACKEND_URL=$(vercel --prod 2>/dev/null | grep "https://" | tail -1)
echo "✅ Backend deployed to: $BACKEND_URL"
echo ""

echo "🔧 Step 2: Deploy Frontend"  
echo "========================="
cd ../frontend || exit

echo "📡 Deploying frontend to Vercel..."
echo "Choose these settings during setup:"
echo "  - Link to existing project? No"
echo "  - Project name: portfolio-website"
echo "  - Deploy? Yes"
echo ""

read -p "Press Enter to deploy frontend..."
vercel --prod

FRONTEND_URL=$(vercel --prod 2>/dev/null | grep "https://" | tail -1)
echo "✅ Frontend deployed to: $FRONTEND_URL"

cd ..

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Backend API: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

echo "⚠️  IMPORTANT: Configure Environment Variables"
echo "=============================================="
echo ""
echo "🔧 Backend Environment Variables (Vercel Dashboard):"
echo "  NODE_ENV=production"
echo "  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-website"
echo "  JWT_SECRET=your-super-secure-64-character-jwt-secret-key"  
echo "  CORS_ORIGIN=$FRONTEND_URL"
echo "  PORT=3000"
echo "  ADMIN_EMAIL=admin@yourportfolio.com"
echo "  ADMIN_PASSWORD=SecurePassword123!"
echo "  SITE_URL=$FRONTEND_URL"
echo ""

echo "🔧 Frontend Environment Variables (Vercel Dashboard):"
echo "  VITE_API_URL=${BACKEND_URL}/api"
echo "  NODE_ENV=production"
echo ""

echo "📋 Next Steps:"
echo "1. Go to Vercel Dashboard and add environment variables above"
echo "2. Set up MongoDB Atlas database (see GITHUB_DEPLOYMENT_STEPS.md)"  
echo "3. Run production database seeding"
echo "4. Test your deployed website!"
echo ""

echo "🔗 Quick Links:"
echo "  Vercel Dashboard: https://vercel.com/dashboard"
echo "  MongoDB Atlas: https://cloud.mongodb.com"
echo "  Your Frontend: $FRONTEND_URL"
echo "  Your Backend: $BACKEND_URL/api/health"