const mongoose = require('mongoose');
const Page = require('../models/Page');

const defaultPages = [
  {
    name: 'Home',
    slug: 'home',
    path: '/',
    status: 'published',
    isHomepage: true,
    template: 'landing',
    seo: {
      title: 'Shailendra Chaurasia - Full Stack Developer & Portfolio',
      metaDescription: 'Professional full stack developer specializing in React, Node.js, and modern web technologies. View my portfolio of innovative projects and technical expertise.',
      keywords: ['full stack developer', 'react developer', 'node.js', 'portfolio', 'web development', 'javascript', 'typescript'],
      focusKeyphrase: 'full stack developer portfolio',
      robots: { index: true, follow: true }
    },
    content: {
      hero: {
        title: 'Full Stack Developer & Tech Innovator',
        subtitle: 'Building Modern Web Solutions',
        description: 'I create exceptional digital experiences using cutting-edge technologies like React, Node.js, and cloud platforms.',
        ctaText: 'View My Work',
        ctaLink: '/portfolio'
      },
      sections: [
        {
          type: 'text',
          title: 'About Me',
          content: '<p>Welcome to my portfolio! I\'m a passionate full stack developer with expertise in modern web technologies. I specialize in creating scalable, efficient, and user-friendly applications that solve real-world problems.</p><p>With a strong foundation in both frontend and backend development, I bring ideas to life through clean code, innovative solutions, and attention to detail.</p>',
          order: 1
        },
        {
          type: 'features',
          title: 'What I Do',
          content: 'Key services and expertise areas',
          data: {
            features: [
              {
                title: 'Frontend Development',
                description: 'React, TypeScript, and modern UI/UX implementation'
              },
              {
                title: 'Backend Development',
                description: 'Node.js, Express, and database architecture'
              },
              {
                title: 'Full Stack Solutions',
                description: 'End-to-end application development and deployment'
              }
            ]
          },
          order: 2
        }
      ]
    }
  },
  {
    name: 'About',
    slug: 'about',
    path: '/about',
    status: 'published',
    isHomepage: false,
    template: 'about',
    seo: {
      title: 'About Shailendra Chaurasia - Full Stack Developer Journey',
      metaDescription: 'Learn about Shailendra Chaurasia\'s journey as a full stack developer. Discover my skills, experience, and passion for creating innovative web solutions.',
      keywords: ['about shailendra', 'developer background', 'web development experience', 'technical skills', 'career journey'],
      focusKeyphrase: 'about full stack developer',
      robots: { index: true, follow: true }
    },
    content: {
      hero: {
        title: 'About Me',
        subtitle: 'My Journey in Web Development',
        description: 'Passionate about creating digital solutions that make a difference.'
      },
      sections: [
        {
          type: 'text',
          title: 'My Story',
          content: '<p>My journey in web development began with a curiosity about how websites work. Today, I\'m a full stack developer with expertise in modern technologies and a passion for continuous learning.</p><p>I believe in writing clean, maintainable code and creating user experiences that are both functional and delightful. Every project is an opportunity to learn something new and push the boundaries of what\'s possible.</p>',
          order: 1
        },
        {
          type: 'text',
          title: 'Technical Expertise',
          content: '<h3>Frontend Technologies</h3><p>React, TypeScript, Next.js, Tailwind CSS, and modern JavaScript frameworks</p><h3>Backend Technologies</h3><p>Node.js, Express, MongoDB, PostgreSQL, and RESTful API development</p><h3>DevOps & Tools</h3><p>Git, Docker, AWS, CI/CD pipelines, and modern development workflows</p>',
          order: 2
        }
      ]
    }
  },
  {
    name: 'Portfolio',
    slug: 'portfolio',
    path: '/portfolio',
    status: 'published',
    isHomepage: false,
    template: 'portfolio',
    seo: {
      title: 'Portfolio - Full Stack Development Projects by Shailendra',
      metaDescription: 'Explore Shailendra Chaurasia\'s portfolio of full stack development projects. React applications, Node.js backends, and modern web solutions.',
      keywords: ['portfolio projects', 'react projects', 'web development portfolio', 'full stack projects', 'javascript applications'],
      focusKeyphrase: 'full stack development projects',
      robots: { index: true, follow: true }
    },
    content: {
      hero: {
        title: 'My Portfolio',
        subtitle: 'Featured Projects & Work',
        description: 'A collection of my best work showcasing various technologies and problem-solving approaches.'
      },
      sections: [
        {
          type: 'text',
          title: 'Project Showcase',
          content: '<p>Here you\'ll find a curated selection of my projects, ranging from full stack web applications to innovative solutions that demonstrate my technical skills and creativity.</p><p>Each project represents a unique challenge and learning opportunity, showcasing different aspects of modern web development.</p>',
          order: 1
        }
      ]
    }
  },
  {
    name: 'Blog',
    slug: 'blog',
    path: '/blog',
    status: 'published',
    isHomepage: false,
    template: 'blog',
    seo: {
      title: 'Tech Blog - Web Development Insights by Shailendra',
      metaDescription: 'Read the latest web development articles and tutorials. Learn about React, Node.js, JavaScript, and modern development practices from Shailendra Chaurasia.',
      keywords: ['web development blog', 'react tutorials', 'javascript articles', 'programming insights', 'tech blog'],
      focusKeyphrase: 'web development blog',
      robots: { index: true, follow: true }
    },
    content: {
      hero: {
        title: 'Tech Blog',
        subtitle: 'Insights & Tutorials',
        description: 'Sharing knowledge about web development, programming best practices, and the latest in tech.'
      },
      sections: [
        {
          type: 'text',
          title: 'Latest Articles',
          content: '<p>Welcome to my blog where I share insights about web development, programming tutorials, and thoughts on the latest trends in technology.</p><p>Whether you\'re a beginner looking to learn or an experienced developer seeking new perspectives, you\'ll find valuable content here.</p>',
          order: 1
        }
      ]
    }
  },
  {
    name: 'Contact',
    slug: 'contact',
    path: '/contact',
    status: 'published',
    isHomepage: false,
    template: 'contact',
    seo: {
      title: 'Contact Shailendra Chaurasia - Full Stack Developer',
      metaDescription: 'Get in touch with Shailendra Chaurasia for web development projects, collaborations, or technical consultations. Let\'s build something amazing together.',
      keywords: ['contact developer', 'hire full stack developer', 'web development services', 'project collaboration'],
      focusKeyphrase: 'contact full stack developer',
      robots: { index: true, follow: true }
    },
    content: {
      hero: {
        title: 'Get In Touch',
        subtitle: 'Let\'s Work Together',
        description: 'Ready to start a project or have a question? I\'d love to hear from you.'
      },
      sections: [
        {
          type: 'contact',
          title: 'Contact Information',
          content: '<p>I\'m always interested in new opportunities and exciting projects. Whether you have a specific project in mind or just want to connect, feel free to reach out.</p>',
          order: 1
        }
      ]
    }
  }
];

async function seedPages() {
  try {
    console.log('🌱 Starting page seeding process...');
    
    // Check if pages already exist
    const existingPages = await Page.countDocuments();
    if (existingPages > 0) {
      console.log(`⚠️  Found ${existingPages} existing pages. Skipping seed.`);
      console.log('💡 To reseed, delete existing pages first.');
      return;
    }

    console.log('📄 Creating default pages...');
    
    // Insert all pages
    const createdPages = await Page.insertMany(defaultPages);
    
    console.log(`✅ Successfully created ${createdPages.length} pages:`);
    createdPages.forEach(page => {
      console.log(`   📋 ${page.name} (${page.path}) - ${page.status}`);
    });
    
    console.log('🎉 Page seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding pages:', error);
    
    // More specific error handling
    if (error.code === 11000) {
      console.error('🔥 Duplicate key error - some pages may already exist');
    } else if (error.name === 'ValidationError') {
      console.error('📝 Validation error:', error.message);
    }
    
    throw error;
  }
}

// Export for use in other scripts
module.exports = {
  seedPages,
  defaultPages
};

// Run directly if this file is executed
if (require.main === module) {
  // Connect to MongoDB
  const connectDB = require('../config/database');
  
  async function runSeed() {
    try {
      await connectDB();
      await seedPages();
      process.exit(0);
    } catch (error) {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    }
  }
  
  runSeed();
}