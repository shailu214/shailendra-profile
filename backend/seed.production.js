const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import database configuration and models
const { connectDB, disconnectDB } = require('./config/database');
const { User, Blog, Portfolio, Settings, SEO, Profile, Category } = require('./models');

const seedProductionData = async () => {
  try {
    console.log('🚀 Starting production database seeding...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('📊 Connected to production database');

    // Check if data already exists
    const existingUser = await User.findOne({ email: 'admin@portfolio.com' });
    if (existingUser) {
      console.log('⚠️ Production data already exists. Skipping seeding to prevent data loss.');
      console.log('💡 To force re-seed, manually clear the database first.');
      await disconnectDB();
      return;
    }

    // Create admin user with secure password
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Portfolio Admin',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Portfolio website administrator'
    });

    console.log('👤 Admin user created');
    console.log(`📧 Admin email: ${adminUser.email}`);
    console.log(`🔑 Admin password: ${adminPassword}`);
    console.log('⚠️ IMPORTANT: Change the admin password after first login!');

    // Create basic settings
    const settings = await Settings.create({
      site: {
        name: process.env.SITE_NAME || 'Professional Portfolio',
        tagline: 'Full Stack Developer & Tech Enthusiast',
        description: 'Professional portfolio showcasing web development expertise and innovative projects.',
        url: process.env.SITE_URL || 'https://your-portfolio.vercel.app'
      },
      personal: {
        name: process.env.PERSONAL_NAME || 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate developer with expertise in modern web technologies.',
        avatar: {
          url: 'https://via.placeholder.com/200x200',
          alt: 'Profile Photo'
        },
        location: {
          city: 'Your City',
          country: 'Your Country',
          timezone: 'UTC'
        },
        availability: {
          status: 'Available',
          message: 'Available for new projects and opportunities'
        }
      },
      contact: {
        email: {
          primary: process.env.CONTACT_EMAIL || 'contact@yourportfolio.com'
        },
        phone: {
          primary: process.env.CONTACT_PHONE || '+1 (555) 123-4567'
        }
      },
      social: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername'
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
      analytics: {
        googleAnalytics: {
          trackingId: process.env.GOOGLE_ANALYTICS_ID || '',
          enabled: !!process.env.GOOGLE_ANALYTICS_ID
        }
      },
      seo: {
        defaultTitle: 'Professional Portfolio - Full Stack Developer',
        defaultDescription: 'Experienced full-stack developer creating innovative web solutions with modern technologies.',
        defaultKeywords: ['portfolio', 'web developer', 'full-stack', 'react', 'node.js'],
        openGraphImage: process.env.DEFAULT_OG_IMAGE || 'https://via.placeholder.com/1200x630'
      }
    });

    console.log('⚙️ Settings created');

    // Create basic profile
    const profile = await Profile.create({
      basicInfo: {
        firstName: 'Your',
        lastName: 'Name',
        displayName: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate developer with expertise in modern web technologies and a commitment to creating exceptional user experiences.',
        shortDescription: 'Full Stack Developer | React.js | Node.js | MongoDB',
        avatar: {
          url: 'https://via.placeholder.com/200x200',
          alt: 'Profile Photo'
        }
      },
      professional: {
        yearsOfExperience: 5,
        currentPosition: {
          title: 'Senior Full Stack Developer',
          company: 'Tech Company',
          startDate: '2023-01-01',
          isCurrent: true
        },
        specializations: [
          { name: 'Frontend Development', level: 'Expert', yearsOfExperience: 5 },
          { name: 'Backend Development', level: 'Advanced', yearsOfExperience: 4 },
          { name: 'Database Design', level: 'Advanced', yearsOfExperience: 4 }
        ]
      },
      skills: {
        technical: [
          { name: 'React.js', category: 'Frontend', proficiency: 90, yearsOfExperience: 4, isFeatured: true },
          { name: 'Node.js', category: 'Backend', proficiency: 85, yearsOfExperience: 4, isFeatured: true },
          { name: 'MongoDB', category: 'Database', proficiency: 80, yearsOfExperience: 3, isFeatured: true },
          { name: 'TypeScript', category: 'Frontend', proficiency: 85, yearsOfExperience: 3, isFeatured: true }
        ]
      },
      personal: {
        location: {
          city: 'Your City',
          state: 'Your State',
          country: 'Your Country',
          timezone: 'UTC'
        },
        availability: {
          status: 'Available',
          message: 'Open to new opportunities and exciting projects'
        }
      },
      socialMedia: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername',
        website: process.env.SITE_URL || 'https://your-portfolio.vercel.app'
      },
      stats: {
        projectsCompleted: 50,
        clientsSatisfied: 25,
        yearsOfExperience: 5,
        technologiesMastered: 15
      },
      experience: [],
      education: []
    });

    console.log('👨‍💼 Profile created');

    // Create basic SEO data for main pages
    const seoPages = [
      {
        page: 'home',
        title: 'Professional Portfolio - Full Stack Developer',
        description: 'Experienced full-stack developer creating innovative web solutions with React.js, Node.js, and modern technologies.',
        keywords: ['portfolio', 'full-stack developer', 'react', 'node.js', 'web development'],
        openGraph: {
          title: 'Professional Portfolio - Full Stack Developer',
          description: 'Experienced full-stack developer creating innovative web solutions.',
          type: 'website',
          siteName: process.env.SITE_NAME || 'Professional Portfolio'
        }
      },
      {
        page: 'about',
        title: 'About - Professional Developer',
        description: 'Learn about my journey as a full-stack developer and my passion for creating exceptional web experiences.',
        keywords: ['about', 'developer', 'experience', 'skills', 'background'],
        openGraph: {
          title: 'About - Professional Developer',
          description: 'Learn about my journey as a full-stack developer.',
          type: 'profile'
        }
      },
      {
        page: 'portfolio',
        title: 'Portfolio - Web Development Projects',
        description: 'Explore my collection of web development projects showcasing modern technologies and innovative solutions.',
        keywords: ['portfolio', 'projects', 'web development', 'react', 'node.js', 'case studies'],
        openGraph: {
          title: 'Portfolio - Web Development Projects',
          description: 'Explore my collection of web development projects.',
          type: 'website'
        }
      },
      {
        page: 'blog',
        title: 'Blog - Tech Insights & Tutorials',
        description: 'Read my latest blog posts about web development, programming tutorials, and technology insights.',
        keywords: ['blog', 'web development', 'programming', 'tutorials', 'tech insights'],
        openGraph: {
          title: 'Blog - Tech Insights & Tutorials',
          description: 'Read my latest blog posts about web development and programming.',
          type: 'website'
        }
      },
      {
        page: 'contact',
        title: 'Contact - Get In Touch',
        description: 'Get in touch for collaboration opportunities, project inquiries, or professional consultations.',
        keywords: ['contact', 'collaboration', 'hire developer', 'consultation', 'projects'],
        openGraph: {
          title: 'Contact - Get In Touch',
          description: 'Get in touch for collaboration opportunities and project inquiries.',
          type: 'website'
        }
      }
    ];

    await SEO.insertMany(seoPages);
    console.log('🔍 SEO data created for main pages');

    // Create blog categories
    const categories = await Category.create([
      {
        name: 'Web Development',
        description: 'Articles about web development, frontend and backend technologies',
        color: '#3B82F6',
        order: 0,
        isActive: true
      },
      {
        name: 'JavaScript',
        description: 'JavaScript tutorials, tips, and best practices',
        color: '#F59E0B',
        order: 1,
        isActive: true
      },
      {
        name: 'React',
        description: 'React.js development guides and component tutorials',
        color: '#06B6D4',
        order: 2,
        isActive: true
      },
      {
        name: 'Node.js',
        description: 'Server-side JavaScript and backend development',
        color: '#10B981',
        order: 3,
        isActive: true
      },
      {
        name: 'Tutorials',
        description: 'Step-by-step programming tutorials and guides',
        color: '#8B5CF6',
        order: 4,
        isActive: true
      },
      {
        name: 'Technology',
        description: 'Tech industry trends, tools, and insights',
        color: '#EC4899',
        order: 5,
        isActive: true
      }
    ]);

    console.log('📂 Blog categories created');

    // Create a sample blog post
    const sampleBlogPost = await Blog.create({
      title: 'Welcome to My Portfolio Blog',
      slug: 'welcome-to-my-portfolio-blog',
      excerpt: 'Welcome to my blog where I share insights about web development, programming tutorials, and technology trends.',
      content: `# Welcome to My Portfolio Blog

I'm excited to share my journey as a full-stack developer with you. This blog will feature:

## What You'll Find Here

- **Development Tutorials**: Step-by-step guides for web development
- **Technology Insights**: Analysis of the latest trends and tools
- **Project Case Studies**: Behind-the-scenes look at my development process
- **Best Practices**: Tips and tricks I've learned along the way

## My Development Philosophy

I believe in writing clean, maintainable code and creating user experiences that truly make a difference. Stay tuned for more posts!

Happy coding! 🚀`,
      author: adminUser._id,
      category: 'Web Development',
      tags: ['welcome', 'introduction', 'web development'],
      featuredImage: 'https://via.placeholder.com/800x400',
      isPublished: true,
      publishedAt: new Date(),
      isFeatured: true,
      readingTime: 2,
      seo: {
        metaTitle: 'Welcome to My Portfolio Blog',
        metaDescription: 'Welcome to my blog where I share insights about web development and programming.',
        keywords: ['blog', 'web development', 'programming', 'welcome']
      }
    });

    console.log('📝 Sample blog post created');

    // Create a sample portfolio project
    const sampleProject = await Portfolio.create({
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description: 'A modern, responsive portfolio website built with React.js and Node.js featuring dynamic content management.',
      detailedDescription: `## Project Overview
A comprehensive portfolio website showcasing modern web development practices.

### Key Features
- Responsive design with modern UI/UX
- Content management system
- SEO optimization
- Performance optimized

### Technical Stack
Built using React.js, Node.js, MongoDB, and deployed on Vercel.`,
      technologies: [
        { name: 'React.js', icon: 'fab fa-react', color: '#61DAFB' },
        { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
        { name: 'MongoDB', icon: 'fas fa-database', color: '#47A248' },
        { name: 'Vercel', icon: 'fas fa-cloud', color: '#000000' }
      ],
      category: 'Web Development',
      images: [
        { url: 'https://via.placeholder.com/800x600', alt: 'Portfolio Homepage', isPrimary: true }
      ],
      links: {
        live: process.env.SITE_URL || 'https://your-portfolio.vercel.app',
        github: 'https://github.com/yourusername/portfolio'
      },
      status: 'Completed',
      priority: 10,
      startDate: new Date('2024-01-01'),
      endDate: new Date(),
      features: [
        { title: 'Content Management', description: 'Dynamic content management with admin panel' },
        { title: 'SEO Optimized', description: 'Comprehensive SEO implementation with meta tags' }
      ],
      isFeatured: true,
      seo: {
        title: 'Portfolio Website - Modern Web Development',
        description: 'A modern, responsive portfolio website showcasing full-stack development capabilities.',
        keywords: ['portfolio', 'react', 'node.js', 'web development', 'responsive design']
      }
    });

    console.log('💼 Sample portfolio project created');

    console.log('\n✅ Production database seeded successfully!');
    console.log('\n📋 Important Information:');
    console.log(`👤 Admin Login: ${adminUser.email}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
    console.log('⚠️  CRITICAL: Change admin password after first login!');
    console.log(`🌐 Admin Panel: ${process.env.SITE_URL || 'your-site-url'}/admin/login`);
    console.log('\n🎯 Next Steps:');
    console.log('1. Update profile information in admin panel');
    console.log('2. Add your real projects and blog posts');
    console.log('3. Update social media links');
    console.log('4. Configure analytics (optional)');
    console.log('5. Update SEO settings for your brand');

  } catch (error) {
    console.error('❌ Production seeding failed:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Prevent accidental execution
if (process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION_SEED === 'true') {
  seedProductionData()
    .then(() => {
      console.log('✅ Production seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production seeding failed:', error);
      process.exit(1);
    });
} else {
  console.log('⚠️ Production seeding skipped. Set NODE_ENV=production or FORCE_PRODUCTION_SEED=true to run.');
  console.log('💡 This is a safety measure to prevent accidental data seeding in development.');
}