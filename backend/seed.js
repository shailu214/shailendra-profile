const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import database configuration and models
const { connectDB, disconnectDB } = require('./config/database');
const { User, Blog, Portfolio, Settings, Testimonial, Page } = require('./models');
const { seedPages } = require('./seeders/pages');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('📊 Connected to database for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Portfolio.deleteMany({});
    await Settings.deleteMany({});
    await Testimonial.deleteMany({});
    await Page.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@portfolio.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Portfolio website administrator'
    });

    console.log('👤 Admin user created');

    // Create sample blog posts
    const blogPosts = [
      {
        title: 'Getting Started with React and TypeScript',
        slug: 'getting-started-react-typescript',
        excerpt: 'Learn how to build modern web applications with React and TypeScript for better type safety and developer experience.',
        content: `
# Getting Started with React and TypeScript

React and TypeScript make a powerful combination for building robust web applications. TypeScript adds static type checking to JavaScript, helping catch errors early and improving code quality.

## Why Use TypeScript with React?

- **Better Developer Experience**: IntelliSense, auto-completion, and error detection
- **Catch Errors Early**: Type checking at compile time
- **Better Refactoring**: Safe code refactoring with IDE support
- **Self-Documenting Code**: Types serve as inline documentation

## Setting Up a New Project

\`\`\`bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
\`\`\`

## Key TypeScript Concepts for React

### Props and State Types

\`\`\`typescript
interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

const Counter: React.FC<Props> = ({ title, count, onIncrement }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};
\`\`\`

This is just the beginning of your TypeScript journey with React!
        `,
        author: adminUser._id,
        category: 'Web Development',
        tags: ['React', 'TypeScript', 'JavaScript', 'Frontend'],
        featuredImage: 'https://via.placeholder.com/800x400',
        isPublished: true,
        publishedAt: new Date(),
        isFeatured: true,
        readingTime: 5
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        slug: 'building-restful-apis-nodejs-express',
        excerpt: 'A comprehensive guide to creating scalable and maintainable RESTful APIs using Node.js and Express framework.',
        content: `
# Building RESTful APIs with Node.js and Express

Node.js and Express provide an excellent foundation for building RESTful APIs. This guide will walk you through creating a production-ready API.

## Project Setup

\`\`\`bash
npm init -y
npm install express mongoose cors helmet bcryptjs jsonwebtoken
npm install -D nodemon
\`\`\`

## Basic Express Server

\`\`\`javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Best Practices

1. **Error Handling**: Implement global error handling middleware
2. **Validation**: Validate input data using libraries like Joi or express-validator
3. **Security**: Use helmet, rate limiting, and input sanitization
4. **Documentation**: Use tools like Swagger for API documentation

Building robust APIs takes practice, but following these patterns will set you up for success!
        `,
        author: adminUser._id,
        category: 'Programming',
        tags: ['Node.js', 'Express', 'API', 'Backend'],
        featuredImage: 'https://via.placeholder.com/800x400',
        isPublished: true,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        isFeatured: false,
        readingTime: 8
      },
      {
        title: 'Modern CSS Techniques: Grid, Flexbox, and Beyond',
        slug: 'modern-css-techniques-grid-flexbox',
        excerpt: 'Explore modern CSS layout techniques including CSS Grid, Flexbox, and new properties that make web design easier.',
        content: `
# Modern CSS Techniques: Grid, Flexbox, and Beyond

CSS has evolved significantly in recent years. Let's explore the modern layout techniques that make web design more efficient and enjoyable.

## CSS Grid vs Flexbox

### When to Use CSS Grid
- Two-dimensional layouts (rows AND columns)
- Complex grid-based designs
- When you need precise control over both axes

### When to Use Flexbox  
- One-dimensional layouts (either row OR column)
- Aligning items within a container
- Dynamic spacing and sizing

## CSS Grid Example

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
\`\`\`

## Modern CSS Features

- **Container Queries**: Style based on container size
- **CSS Custom Properties**: Dynamic theming
- **Logical Properties**: Better internationalization
- **CSS Subgrid**: Nested grid layouts

The future of CSS is bright with these powerful new features!
        `,
        author: adminUser._id,
        category: 'Design',
        tags: ['CSS', 'Grid', 'Flexbox', 'Frontend', 'Design'],
        featuredImage: 'https://via.placeholder.com/800x400',
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isFeatured: true,
        readingTime: 6
      }
    ];

    await Blog.insertMany(blogPosts);
    console.log('📝 Blog posts created');

    // Create sample portfolio projects
    const portfolioProjects = [
      {
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description: 'Full-stack e-commerce application built with React, Node.js, and MongoDB with secure payment processing and admin dashboard',
        detailedDescription: `
## Project Overview
A comprehensive e-commerce platform featuring modern web technologies and best practices for online retail.

### Key Features
- User authentication and authorization
- Shopping cart and wishlist functionality
- Secure payment processing with Stripe
- Admin dashboard with analytics
- Product catalog with search and filtering
- Order management system
- Real-time inventory tracking

### Technical Implementation
Built using React for the frontend with Redux for state management, Node.js/Express for the backend API, and MongoDB for data persistence. Implemented JWT authentication, bcrypt for password hashing, and comprehensive error handling.

### Challenges & Solutions
- **Challenge**: Handling concurrent inventory updates
- **Solution**: Implemented optimistic locking and transaction management
- **Challenge**: Payment security and PCI compliance  
- **Solution**: Integrated Stripe payment processing with webhook validation
        `,
        technologies: [
          { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
          { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
          { name: 'MongoDB', icon: 'fas fa-database', color: '#47A248' },
          { name: 'Stripe', icon: 'fab fa-stripe', color: '#008CDD' },
          { name: 'Redux', icon: 'fab fa-redux', color: '#764ABC' }
        ],
        category: 'E-commerce',
        images: [
          { url: 'https://via.placeholder.com/800x600', alt: 'Homepage Screenshot', isPrimary: true },
          { url: 'https://via.placeholder.com/800x600', alt: 'Product Page' },
          { url: 'https://via.placeholder.com/800x600', alt: 'Admin Dashboard' }
        ],
        links: {
          live: 'https://demo-ecommerce.example.com',
          github: 'https://github.com/username/ecommerce-platform',
          demo: 'https://demo.ecommerce.example.com'
        },
        status: 'Completed',
        priority: 9,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-10-15'),
        client: {
          name: 'TechStart Solutions',
          website: 'https://techstart.com',
          testimonial: {
            text: 'Outstanding work! The platform exceeded our expectations and delivered excellent performance.',
            rating: 5
          }
        },
        features: [
          { title: 'Secure Authentication', description: 'JWT-based user authentication with role management' },
          { title: 'Payment Processing', description: 'Integrated Stripe for secure payment handling' },
          { title: 'Admin Dashboard', description: 'Comprehensive admin panel with analytics and management tools' }
        ],
        challenges: [
          { 
            problem: 'Managing concurrent inventory updates during high traffic', 
            solution: 'Implemented database transactions and optimistic locking to prevent overselling'
          }
        ],
        isFeatured: true
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'Collaborative task management application with real-time updates and team collaboration features',
        detailedDescription: `
## Project Overview
A modern task management application designed for team collaboration with real-time synchronization.

### Key Features
- Real-time task updates using WebSocket
- Team collaboration tools
- Project management dashboard  
- File sharing and comments
- Time tracking and reporting
- Mobile-responsive design

### Technical Stack
Vue.js frontend with Vuex for state management, Socket.io for real-time communication, Express.js backend with PostgreSQL database.
        `,
        technologies: [
          { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#4FC08D' },
          { name: 'Socket.io', icon: 'fas fa-plug', color: '#000000' },
          { name: 'Express', icon: 'fab fa-node-js', color: '#339933' },
          { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791' }
        ],
        category: 'Web Development',
        images: [
          { url: 'https://via.placeholder.com/800x600', alt: 'Dashboard View', isPrimary: true },
          { url: 'https://via.placeholder.com/800x600', alt: 'Task Board' }
        ],
        links: {
          live: 'https://demo-tasks.example.com',
          github: 'https://github.com/username/task-manager'
        },
        status: 'Completed',
        priority: 8,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-09-20'),
        features: [
          { title: 'Real-time Updates', description: 'Instant task synchronization across team members' },
          { title: 'Team Collaboration', description: 'Comments, file sharing, and team notifications' }
        ],
        isFeatured: true
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'Interactive weather dashboard with maps, forecasts, and weather alerts using modern APIs',
        detailedDescription: `
## Project Overview
A comprehensive weather application providing detailed forecasts and interactive weather visualization.

### Features
- Current weather conditions
- 7-day forecast
- Interactive weather maps
- Location-based weather alerts
- Historical weather data
        `,
        technologies: [
          { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
          { name: 'Chart.js', icon: 'fas fa-chart-line', color: '#FF6384' },
          { name: 'Weather API', icon: 'fas fa-cloud', color: '#87CEEB' },
          { name: 'Tailwind CSS', icon: 'fas fa-palette', color: '#38BDF8' }
        ],
        category: 'Web Development',
        images: [
          { url: 'https://via.placeholder.com/800x600', alt: 'Weather Dashboard', isPrimary: true }
        ],
        links: {
          live: 'https://demo-weather.example.com',
          github: 'https://github.com/username/weather-dashboard'
        },
        status: 'Completed',
        priority: 6,
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-08-10'),
        features: [
          { title: 'Interactive Maps', description: 'Dynamic weather visualization with layer controls' },
          { title: 'Forecast Charts', description: 'Temperature and precipitation trend charts' }
        ],
        isFeatured: false
      }
    ];

    await Portfolio.insertMany(portfolioProjects);
    console.log('💼 Portfolio projects created');

    // Create sample testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        position: 'CEO',
        company: 'TechStartup Inc.',
        content: 'Shailendra delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise are outstanding. The project was completed on time and within budget.',
        rating: 5,
        projectType: 'E-commerce Development',
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        source: 'linkedin',
        email: 'sarah@techstartup.com',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        tags: ['e-commerce', 'react', 'node.js'],
        dateReceived: new Date('2024-10-15')
      },
      {
        name: 'Michael Chen',
        position: 'Product Manager',
        company: 'Digital Solutions',
        content: 'Working with Shailendra was a game-changer for our project. His React.js skills and SEO optimization boosted our conversion rates by 40%. Highly recommended!',
        rating: 5,
        projectType: 'Web Development',
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        source: 'direct',
        email: 'michael@digitalsolutions.com',
        tags: ['react', 'seo', 'performance'],
        dateReceived: new Date('2024-09-22')
      },
      {
        name: 'Emily Rodriguez',
        position: 'Marketing Director',
        company: 'Growth Co.',
        content: 'Professional, reliable, and incredibly skilled. Shailendra transformed our web presence and delivered results that speak for themselves. The new website generated 3x more leads.',
        rating: 5,
        projectType: 'Website Redesign',
        isActive: true,
        isFeatured: true,
        sortOrder: 3,
        source: 'upwork',
        tags: ['redesign', 'lead-generation', 'ui-ux'],
        dateReceived: new Date('2024-08-30')
      },
      {
        name: 'David Kumar',
        position: 'Founder',
        company: 'InnovateNow',
        content: 'Exceptional developer with deep expertise in full-stack technologies. Shailendra\'s SEO knowledge helped us rank #1 on Google for our target keywords within 3 months.',
        rating: 5,
        projectType: 'SEO & Development',
        isActive: true,
        isFeatured: true,
        sortOrder: 4,
        source: 'freelancer',
        tags: ['seo', 'full-stack', 'ranking'],
        dateReceived: new Date('2024-07-18')
      },
      {
        name: 'Lisa Thompson',
        position: 'Operations Manager',
        company: 'CloudTech Solutions',
        content: 'Shailendra built us a robust task management system that streamlined our workflow. The real-time features and intuitive design made team adoption seamless.',
        rating: 4,
        projectType: 'Task Management App',
        isActive: true,
        isFeatured: false,
        sortOrder: 5,
        source: 'direct',
        tags: ['task-management', 'real-time', 'workflow'],
        dateReceived: new Date('2024-06-25')
      },
      {
        name: 'James Wilson',
        position: 'CTO',
        company: 'FinanceFlow',
        content: 'Outstanding work on our financial dashboard. The data visualization and performance optimization were exactly what we needed. Clean code and excellent documentation.',
        rating: 5,
        projectType: 'Dashboard Development',
        isActive: true,
        isFeatured: false,
        sortOrder: 6,
        source: 'linkedin',
        tags: ['dashboard', 'data-visualization', 'performance'],
        dateReceived: new Date('2024-05-12')
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('🌟 Testimonials created');

    // Create settings
    const settings = await Settings.create({
      site: {
        name: 'Shailendra Chaurasia Portfolio',
        tagline: 'Senior Full Stack Developer & SEO Expert',
        description: 'Professional portfolio of Shailendra Chaurasia - 10+ years experience in Full Stack Development, ReactJS, Node.js, MongoDB, and SEO optimization.',
        url: 'https://shailendra-portfolio.com'
      },
      personal: {
        name: 'Shailendra Chaurasia',
        title: 'Senior Full Stack Developer & SEO Expert',
        bio: 'Seasoned full-stack developer with 10+ years of experience in creating scalable web applications. Expert in ReactJS, Node.js, MongoDB, and SEO optimization. Passionate about delivering high-performance solutions that drive business growth.',
        avatar: {
          url: 'https://via.placeholder.com/200x200',
          alt: 'John Developer Profile Photo'
        },
        location: {
          city: 'San Francisco',
          country: 'United States',
          timezone: 'America/Los_Angeles'
        },
        availability: {
          status: 'Available',
          message: 'Available for consulting, freelance projects, and senior developer opportunities'
        }
      },
      contact: {
        email: {
          primary: 'shailendra.chaurasia@gmail.com',
          business: 'business@shailendra-dev.com'
        },
        phone: {
          primary: '+91 98765 43210'
        },
        workingHours: {
          timezone: 'America/Los_Angeles',
          schedule: [
            { day: 'Monday', start: '09:00', end: '17:00', available: true },
            { day: 'Tuesday', start: '09:00', end: '17:00', available: true },
            { day: 'Wednesday', start: '09:00', end: '17:00', available: true },
            { day: 'Thursday', start: '09:00', end: '17:00', available: true },
            { day: 'Friday', start: '09:00', end: '17:00', available: true }
          ]
        }
      },
      social: {
        github: 'https://github.com/shailendrachaurasia',
        linkedin: 'https://linkedin.com/in/shailendra-chaurasia',
        twitter: 'https://twitter.com/shailendra_dev',
        instagram: 'https://instagram.com/shailendra.dev',
        medium: 'https://medium.com/@shailendra.chaurasia'
      },
      theme: {
        colorScheme: 'auto',
        primaryColor: '#3B82F6',
        secondaryColor: '#EF4444',
        fontFamily: 'Inter',
        animations: true,
        particles: false
      },
      navigation: {
        showLogo: true,
        menuItems: [
          { label: 'Home', path: '/', order: 1, isActive: true },
          { label: 'About', path: '/about', order: 2, isActive: true },
          { label: 'Portfolio', path: '/portfolio', order: 3, isActive: true },
          { label: 'Blog', path: '/blog', order: 4, isActive: true },
          { label: 'Contact', path: '/contact', order: 5, isActive: true }
        ],
        showSocial: true,
        stickyHeader: true
      },
      homepage: {
        heroSection: {
          showAnimation: true,
          backgroundType: 'gradient',
          ctaButton: {
            text: 'View My Work',
            link: '/portfolio'
          }
        },
        sections: {
          showAbout: true,
          showSkills: true,
          showPortfolio: true,
          showBlog: true,
          showContact: true
        }
      },
      analytics: {
        googleAnalytics: {
          trackingId: 'GA_MEASUREMENT_ID',
          enabled: false
        }
      },
      seo: {
        defaultTitle: 'John Developer - Full Stack Developer',
        defaultDescription: 'Experienced full-stack web developer specializing in React, Node.js, and modern web technologies.',
        defaultKeywords: ['portfolio', 'web developer', 'react', 'node.js', 'full-stack'],
        openGraphImage: 'https://via.placeholder.com/1200x630'
      }
    });

    console.log('⚙️ Settings created');

    // Seed pages
    await seedPages();
    console.log('📄 Pages created');

    console.log('\n✅ Database seeded successfully!');
    console.log('📋 Summary:');
    console.log(`👤 Admin User: admin@portfolio.com / admin123`);
    console.log(`📝 Blog Posts: ${blogPosts.length} posts created`);
    console.log(`💼 Portfolio Projects: ${portfolioProjects.length} projects created`);
    console.log(`🌟 Testimonials: ${testimonials.length} testimonials created`);
    console.log(`📄 Pages: 5 pages with SEO data created`);
    console.log(`⚙️ Site Settings: Configured`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// Run seeding
seedData();