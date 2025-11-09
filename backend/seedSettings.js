const mongoose = require('mongoose');
const { Settings } = require('./models');

async function seedSettings() {
  try {
    console.log('🌱 Seeding settings...');
    
    // Check if settings already exist
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings with required fields
      settings = await Settings.create({
        site: {
          name: 'Shailendra Chaurasia Portfolio',
          tagline: 'Senior Full Stack Developer & SEO Expert',
          description: 'Experienced Full Stack Developer specializing in React.js, Node.js, MongoDB, and SEO optimization.',
          url: 'http://localhost:5173'
        },
        personal: {
          name: 'Shailendra Chaurasia',
          title: 'Senior Full Stack Developer',
          bio: 'Passionate Senior Full Stack Developer with 10+ years of experience crafting high-performance web applications. Expert in React.js, Node.js, MongoDB, and SEO optimization.',
          location: {
            city: 'India',
            country: 'India',
            timezone: 'Asia/Kolkata'
          },
          availability: {
            status: 'Available',
            message: 'Open to new opportunities and consulting work'
          }
        },
        contact: {
          email: {
            primary: 'shailendra.chaurasia@gmail.com'
          },
          phone: {
            primary: '+91 98765 43210'
          }
        },
        social: {
          github: 'https://github.com/shailendrachaurasia',
          linkedin: 'https://linkedin.com/in/shailendra-chaurasia',
          twitter: 'https://twitter.com/shailendra_dev'
        }
      });
      
      console.log('✅ Settings created successfully!');
    } else {
      console.log('✅ Settings already exist');
    }
    
    console.log('📋 Settings data:');
    console.log('Name:', settings.personal.name);
    console.log('Title:', settings.personal.title);
    console.log('Email:', settings.contact.email.primary);
    
    return settings;
  } catch (error) {
    console.error('❌ Settings seed error:', error);
    throw error;
  }
}

// Only run this if called directly
if (require.main === module) {
  mongoose.connect('mongodb://localhost:27017/portfolio-test')
    .then(() => {
      console.log('📁 Connected to MongoDB');
      return seedSettings();
    })
    .then(() => {
      console.log('🎉 Settings seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedSettings;