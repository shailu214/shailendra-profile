# 🚀 Professional Portfolio Website

A modern, dynamic portfolio website built with React.js, Node.js, and MongoDB featuring comprehensive content management, SEO optimization, and responsive design.

## ✨ Features

### 🎯 **Dynamic Content Management**
- **Admin Dashboard**: Complete CRUD operations for all content
- **Profile Management**: Dynamic profile with skills, experience, education
- **Blog System**: Full-featured blog with SEO optimization
- **Portfolio Showcase**: Project management with detailed case studies
- **Settings Management**: Site-wide configuration and customization

### 🔍 **SEO & Performance**
- **Dynamic Meta Tags**: Automatic SEO optimization for all pages
- **Open Graph Integration**: Social media sharing optimization
- **Structured Data**: JSON-LD schemas for rich search results
- **Sitemap Generation**: Automated XML sitemap creation
- **Performance Optimized**: Fast loading with modern optimization techniques

### 🛡️ **Security & Authentication**
- **JWT Authentication**: Secure admin authentication
- **Role-based Access**: Protected admin routes
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Secure cross-origin requests

### 📱 **Modern Tech Stack**
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel (Frontend & API)
- **Storage**: MongoDB Atlas (Production)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (Atlas account recommended)
- Git

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run seed  # Populate database with sample data
npm run dev   # Start backend server
\`\`\`

### 3. Setup Frontend
\`\`\`bash
cd ../frontend
npm install
npm run dev   # Start frontend development server
\`\`\`

### 4. Access Application
- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **API**: http://localhost:5000/api

**Default Admin Credentials:**
- Email: admin@portfolio.com  
- Password: admin123

⚠️ **Change admin credentials in production!**

## 🌐 Production Deployment

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create new cluster (M0 Free tier)
3. Create database user with read/write access
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string

### Vercel Deployment

#### Backend API
\`\`\`bash
cd backend
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# MONGODB_URI, JWT_SECRET, CORS_ORIGIN, NODE_ENV
\`\`\`

#### Frontend
\`\`\`bash
cd frontend  
# Update VITE_API_URL in environment variables
vercel --prod
\`\`\`

### Production Seeding
\`\`\`bash
# After backend deployment, seed production database
cd backend
npm run seed:prod
\`\`\`

## 📁 Project Structure

\`\`\`
portfolio-website/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context for state management
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   └── public/              # Static assets
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware functions
│   ├── config/             # Configuration files
│   └── seeders/            # Database seeding scripts
└── docs/                   # Documentation
\`\`\`

## 🔧 API Endpoints

### Authentication
- \`POST /api/auth/login\` - Admin login
- \`POST /api/auth/register\` - Admin registration
- \`GET /api/auth/me\` - Get current user

### Profile Management
- \`GET /api/profile/public\` - Get public profile
- \`PUT /api/profile\` - Update profile (admin)
- \`POST /api/profile/avatar\` - Upload avatar

### Blog Management
- \`GET /api/blog\` - Get published blog posts
- \`GET /api/blog/:slug\` - Get single blog post
- \`POST /api/blog\` - Create blog post (admin)
- \`PUT /api/blog/:id\` - Update blog post (admin)
- \`DELETE /api/blog/:id\` - Delete blog post (admin)

### Portfolio Management
- \`GET /api/portfolio\` - Get portfolio projects
- \`GET /api/portfolio/:slug\` - Get single project
- \`POST /api/portfolio\` - Create project (admin)
- \`PUT /api/portfolio/:id\` - Update project (admin)
- \`DELETE /api/portfolio/:id\` - Delete project (admin)

### Settings Management
- \`GET /api/settings\` - Get site settings
- \`PUT /api/settings\` - Update settings (admin)

## 🎨 Admin Panel Features

### Dashboard Overview
- **Content Statistics**: Blog posts, projects, profile completeness
- **Recent Activity**: Latest content updates
- **Quick Actions**: Create new content, update profile

### Profile Management
- **Basic Information**: Name, title, bio, avatar upload
- **Professional Details**: Current position, years of experience
- **Skills Management**: Technical skills with proficiency levels
- **Experience Timeline**: Work history with detailed descriptions
- **Education Records**: Academic background
- **Personal Information**: Location, availability status
- **Social Media Links**: GitHub, LinkedIn, Twitter integration

### Content Management
- **Blog Posts**: Rich text editor, SEO optimization, featured images
- **Portfolio Projects**: Detailed project information, image galleries
- **Settings**: Site configuration, theme customization
- **SEO Management**: Meta tags, Open Graph, structured data

## 🔍 SEO Features

### Meta Tag Optimization
- **Dynamic Titles**: Page-specific optimized titles
- **Meta Descriptions**: Compelling descriptions for each page
- **Keywords**: Relevant keyword optimization
- **Canonical URLs**: Prevent duplicate content issues

### Social Media Integration
- **Open Graph**: Optimized Facebook/LinkedIn sharing
- **Twitter Cards**: Enhanced Twitter previews  
- **Dynamic Images**: Auto-generated social media previews

### Search Engine Optimization
- **Structured Data**: Rich snippets with JSON-LD
- **XML Sitemap**: Automated sitemap generation
- **Robots.txt**: Search engine crawling directives
- **Performance**: Fast loading for better rankings

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Rate Limiting**: API protection against brute force
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: Security headers for production
- **Environment Variables**: Secure configuration management

## 🚀 Performance Optimization

- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Images and components
- **Compression**: Gzip compression for API responses
- **Caching**: Browser and server-side caching
- **CDN Ready**: Static asset optimization
- **Database Indexing**: Optimized MongoDB queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the \`docs/\` directory
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Vercel**: For seamless deployment platform
- **MongoDB**: For flexible database solution
- **Tailwind CSS**: For rapid UI development
- **Framer Motion**: For smooth animations

---

### 🌟 Star this repository if it helped you build your portfolio!

**Built with ❤️ by [Your Name](https://your-portfolio.vercel.app)**