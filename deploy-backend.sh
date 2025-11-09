#!/bin/bash

echo "🚀 Setting up Vercel Environment Variables for Portfolio Backend"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Logging into Vercel..."
vercel login

# Navigate to backend directory
cd backend

# Set environment variables
echo "⚙️  Setting up environment variables..."

# MongoDB URI
echo "📊 Setting MONGODB_URI..."
echo "mongodb+srv://shailendracannoneye_db_user:rQlsz17z6oSolOCb@cluster0.m0on7ls.mongodb.net/portfolio-website?retryWrites=true&w=majority" | vercel env add MONGODB_URI production

# JWT Secret
echo "🔐 Setting JWT_SECRET..."
echo "portfolio-jwt-secret-key-2024-super-secure-production-32chars" | vercel env add JWT_SECRET production

# Node Environment
echo "🌐 Setting NODE_ENV..."
echo "production" | vercel env add NODE_ENV production

# Frontend URL for CORS
echo "🔗 Setting CLIENT_URL..."
echo "https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app" | vercel env add CLIENT_URL production

# Optional: JWT Expires
echo "⏰ Setting JWT_EXPIRES_IN..."
echo "7d" | vercel env add JWT_EXPIRES_IN production

# Deploy the backend
echo "🚀 Deploying backend to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your backend should be available at: https://your-backend-url.vercel.app"
echo "🧪 Test with: curl https://your-backend-url.vercel.app/api/health"