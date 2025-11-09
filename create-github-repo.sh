#!/bin/bash

# 🚀 GitHub Repository Creation Script
# Run these commands step by step

echo "📋 Portfolio Website - GitHub Repository Setup"
echo "============================================="
echo ""

echo "🔧 Step 1: Create GitHub Repository"
echo "Go to https://github.com/new and create a new repository with:"
echo "  - Repository name: portfolio-website"  
echo "  - Description: Full-stack portfolio website with React frontend, Node.js backend, and MongoDB"
echo "  - Public or Private (your choice)"
echo "  - Don't initialize with README, .gitignore, or license (we already have these)"
echo ""

echo "📡 Step 2: Add Remote and Push (run after creating GitHub repo)"
echo "Replace 'yourusername' with your actual GitHub username:"
echo ""
echo "git remote add origin https://github.com/yourusername/portfolio-website.git"
echo "git branch -M main"  
echo "git push -u origin main"
echo ""

echo "🔍 Step 3: Verify Upload"
echo "Check that all these files are in your GitHub repository:"
echo "  ✅ backend/ (with all API files)"
echo "  ✅ frontend/ (with all React files)"
echo "  ✅ .github/workflows/ (CI/CD pipelines)"
echo "  ✅ README.md (project documentation)"
echo "  ✅ GITHUB_DEPLOYMENT_STEPS.md (this guide)"
echo ""

echo "🎯 Next: Follow GITHUB_DEPLOYMENT_STEPS.md for Vercel deployment"
echo ""

# Get current commit info
echo "📊 Current Repository Status:"
echo "Branch: $(git branch --show-current)"
echo "Last Commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
echo "Files Ready: $(git ls-files | wc -l) files committed"
echo ""

echo "🔗 Quick Links After Repository Creation:"
echo "  Repository: https://github.com/yourusername/portfolio-website"
echo "  Vercel Dashboard: https://vercel.com/dashboard"
echo "  MongoDB Atlas: https://cloud.mongodb.com"