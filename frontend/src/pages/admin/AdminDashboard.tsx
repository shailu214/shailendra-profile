import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  MessageSquare, 
  Code, 
  Settings, 
  Star,
  LogOut,
  BarChart3,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  console.log('🔐 AdminDashboard: Auth state:', { isAuthenticated, isAdmin, user });
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroBio: '',
    stats: [
      { label: 'Client Satisfaction', value: '98%', color: 'blue' },
      { label: 'Projects Delivered', value: '150+', color: 'green' },
      { label: 'Happy Clients', value: '50+', color: 'purple' },
      { label: 'Support', value: '24/7', color: 'yellow' }
    ],
    skills: [
      { name: 'React.js', level: 95, icon: 'Code' },
      { name: 'Node.js', level: 90, icon: 'Server' },
      { name: 'MongoDB', level: 88, icon: 'Database' },
      { name: 'JavaScript', level: 95, icon: 'Code' },
      { name: 'SEO', level: 92, icon: 'Search' },
      { name: 'Mobile Dev', level: 85, icon: 'Smartphone' }
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'CEO, TechStartup Inc.',
        content: 'Shailendra delivered an exceptional e-commerce platform that exceeded our expectations.',
        rating: 5
      },
      {
        name: 'Michael Chen',
        role: 'Product Manager, Digital Solutions',
        content: 'Working with Shailendra was a game-changer for our project.',
        rating: 5
      }
    ],
    socialMedia: {
      github: 'https://github.com/shailendrachaurasia',
      linkedin: 'https://linkedin.com/in/shailendra-chaurasia',
      twitter: 'https://twitter.com/shailendra_dev',
      email: 'shailendra.chaurasia@gmail.com'
    },
    contactInfo: {
      email: 'shailendra.chaurasia@gmail.com',
      phone: '+91 98765 43210',
      location: 'India'
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        heroTitle: settings.personal?.name || 'Shailendra Chaurasia',
        heroSubtitle: 'Senior Full Stack Developer',
        heroBio: settings.personal?.bio || '',
        stats: formData.stats,
        skills: formData.skills,
        testimonials: formData.testimonials,
        socialMedia: settings.social || formData.socialMedia,
        contactInfo: settings.contact?.email ? {
          email: settings.contact.email.primary,
          phone: settings.contact.phone?.primary || '+91 98765 43210',
          location: settings.personal?.location?.city || 'India'
        } : formData.contactInfo
      });
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: User },
    { id: 'stats', label: 'Stats', icon: Star },
    { id: 'skills', label: 'Core Expertise', icon: Code },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'contact', label: 'Contact Info', icon: MessageSquare },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'seo', label: 'SEO Settings', icon: Search }
  ];

  const handleSave = async () => {
    try {
      // Here you would call your API to save the data
      console.log('Saving data:', formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Portfolio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {user?.name}! Manage your portfolio content dynamically.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Content Management
                  </h3>
                </div>
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg mx-2 transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Save Button */}
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save All Changes
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'hero' && <HeroTab formData={formData} setFormData={setFormData} />}
                {activeTab === 'stats' && <StatsTab formData={formData} setFormData={setFormData} />}
                {activeTab === 'skills' && <SkillsTab formData={formData} setFormData={setFormData} />}
                {activeTab === 'testimonials' && <TestimonialsTab formData={formData} setFormData={setFormData} />}
                {activeTab === 'contact' && <ContactTab formData={formData} setFormData={setFormData} />}
                {activeTab === 'social' && <SocialTab formData={formData} setFormData={setFormData} />}
                {activeTab === 'seo' && <SEOTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Overview Tab Component
const OverviewTab = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Content Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <User className="h-8 w-8" />
          <div className="ml-4">
            <p className="text-blue-100">Hero Section</p>
            <p className="text-2xl font-bold">Active</p>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <Star className="h-8 w-8" />
          <div className="ml-4">
            <p className="text-green-100">Stats</p>
            <p className="text-2xl font-bold">4 Items</p>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <Quote className="h-8 w-8" />
          <div className="ml-4">
            <p className="text-purple-100">Testimonials</p>
            <p className="text-2xl font-bold">4 Active</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Hero Tab Component
const HeroTab = ({ formData, setFormData }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hero Section Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Main Title
        </label>
        <input
          type="text"
          value={formData.heroTitle}
          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={formData.heroSubtitle}
          onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Your Title/Role"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio Description
        </label>
        <textarea
          value={formData.heroBio}
          onChange={(e) => setFormData({ ...formData, heroBio: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Brief description about yourself..."
        />
      </div>
    </div>
  </div>
);

// Stats Tab Component
const StatsTab = ({ formData, setFormData }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Stats Management</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {formData.stats.map((stat, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              value={stat.label}
              onChange={(e) => {
                const newStats = [...formData.stats];
                newStats[index].label = e.target.value;
                setFormData({ ...formData, stats: newStats });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Stat Label"
            />
            <input
              type="text"
              value={stat.value}
              onChange={(e) => {
                const newStats = [...formData.stats];
                newStats[index].value = e.target.value;
                setFormData({ ...formData, stats: newStats });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Stat Value"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Skills Tab Component
const SkillsTab = ({ formData, setFormData }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Core Expertise</h2>
    <div className="space-y-4">
      {formData.skills.map((skill, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => {
                const newSkills = [...formData.skills];
                newSkills[index].name = e.target.value;
                setFormData({ ...formData, skills: newSkills });
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Skill Name"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => {
                const newSkills = [...formData.skills];
                newSkills[index].level = parseInt(e.target.value);
                setFormData({ ...formData, skills: newSkills });
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Level (0-100)"
            />
            <button
              onClick={() => {
                const newSkills = formData.skills.filter((_, i) => i !== index);
                setFormData({ ...formData, skills: newSkills });
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const newSkills = [...formData.skills, { name: '', level: 0, icon: 'Code' }];
          setFormData({ ...formData, skills: newSkills });
        }}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Skill
      </button>
    </div>
  </div>
);

// Testimonials Tab Component
const TestimonialsTab = ({ formData, setFormData }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Testimonials Management</h2>
    <div className="space-y-6">
      {formData.testimonials.map((testimonial, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => {
                  const newTestimonials = [...formData.testimonials];
                  newTestimonials[index].name = e.target.value;
                  setFormData({ ...formData, testimonials: newTestimonials });
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                placeholder="Client Name"
              />
              <input
                type="text"
                value={testimonial.role}
                onChange={(e) => {
                  const newTestimonials = [...formData.testimonials];
                  newTestimonials[index].role = e.target.value;
                  setFormData({ ...formData, testimonials: newTestimonials });
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                placeholder="Client Role"
              />
            </div>
            <textarea
              value={testimonial.content}
              onChange={(e) => {
                const newTestimonials = [...formData.testimonials];
                newTestimonials[index].content = e.target.value;
                setFormData({ ...formData, testimonials: newTestimonials });
              }}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Testimonial content..."
            />
            <div className="flex items-center justify-between">
              <select
                value={testimonial.rating}
                onChange={(e) => {
                  const newTestimonials = [...formData.testimonials];
                  newTestimonials[index].rating = parseInt(e.target.value);
                  setFormData({ ...formData, testimonials: newTestimonials });
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
              <button
                onClick={() => {
                  const newTestimonials = formData.testimonials.filter((_, i) => i !== index);
                  setFormData({ ...formData, testimonials: newTestimonials });
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const newTestimonials = [...formData.testimonials, { name: '', role: '', content: '', rating: 5 }];
          setFormData({ ...formData, testimonials: newTestimonials });
        }}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Testimonial
      </button>
    </div>
  </div>
);

// Contact Tab Component
const ContactTab = ({ formData, setFormData }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.contactInfo.email}
          onChange={(e) => setFormData({ 
            ...formData, 
            contactInfo: { ...formData.contactInfo, email: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.contactInfo.phone}
          onChange={(e) => setFormData({ 
            ...formData, 
            contactInfo: { ...formData.contactInfo, phone: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.contactInfo.location}
          onChange={(e) => setFormData({ 
            ...formData, 
            contactInfo: { ...formData.contactInfo, location: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  </div>
);

// Social Media Tab Component
const SocialTab = ({ formData, setFormData }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Social Media Links</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          GitHub URL
        </label>
        <input
          type="url"
          value={formData.socialMedia.github}
          onChange={(e) => setFormData({ 
            ...formData, 
            socialMedia: { ...formData.socialMedia, github: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          LinkedIn URL
        </label>
        <input
          type="url"
          value={formData.socialMedia.linkedin}
          onChange={(e) => setFormData({ 
            ...formData, 
            socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Twitter URL
        </label>
        <input
          type="url"
          value={formData.socialMedia.twitter}
          onChange={(e) => setFormData({ 
            ...formData, 
            socialMedia: { ...formData.socialMedia, twitter: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  </div>
);

// SEO Tab Component
const SEOTab = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">SEO Settings</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Site Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Portfolio - Shailendra Chaurasia"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meta Description
        </label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Brief description for search engines..."
        />
      </div>
    </div>
  </div>
);