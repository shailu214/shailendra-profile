#!/bin/bash
# Vercel Backend Deployment Verification Script

echo "🚀 Vercel Backend Deployment Verification"
echo "=========================================="

# Backend URLs
BACKEND_URL="https://myportfolio-backend-shailu214s-projects.vercel.app"
FRONTEND_URL="https://myportfolio-nxkkfu9uk-shailu214s-projects.vercel.app"

echo ""
echo "📡 Testing Backend Endpoints..."
echo ""

# Test root endpoint
echo "1. Testing Root Endpoint:"
echo "   URL: $BACKEND_URL/"
curl -s -w "\n   Status: %{http_code}\n" "$BACKEND_URL/" | head -3
echo ""

# Test health endpoint  
echo "2. Testing Health Endpoint:"
echo "   URL: $BACKEND_URL/api/health"
curl -s -w "\n   Status: %{http_code}\n" "$BACKEND_URL/api/health" | head -3
echo ""

# Test categories endpoint
echo "3. Testing Categories Endpoint:"
echo "   URL: $BACKEND_URL/api/categories"
curl -s -w "\n   Status: %{http_code}\n" "$BACKEND_URL/api/categories" | head -3
echo ""

echo "🌐 Testing Frontend:"
echo "   URL: $FRONTEND_URL/"
curl -s -w "\n   Status: %{http_code}\n" "$FRONTEND_URL/" | head -2
echo ""

echo "📋 Deployment Status Summary:"
echo "=============================="
echo "✅ If you see JSON responses above: Backend is working"
echo "❌ If you see 'DEPLOYMENT_NOT_FOUND': Backend deployment failed"
echo "🔧 If you see timeouts: Check MongoDB Atlas IP whitelist"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access"
echo "3. Redeploy backend in Vercel"
echo ""