import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  Github, 
  Linkedin, 
  Mail, 
  Code, 
  Database, 
  Server, 
  Smartphone,
  Globe,
  Search,
  Users,
  Award,
  Star,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Eye
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProfile } from '../context/ProfileContext';
import { SEOHelmet } from '../components/SEOHelmet';
import { pageSEO } from '../utils/metaTags';
import { testimonialsService, blogService, portfolioService } from '../services/api';

interface Testimonial {
  _id?: string;
  id?: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  projectType?: string;
  source?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

interface BlogPost {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category: string;
  publishedAt?: string;
  createdAt: string;
  readingTime?: number;
  views?: number;
}

export const Home: React.FC = () => {
  const { settings, loading } = useSettings();
  const { publicProfile, loading: profileLoading } = useProfile();
  const [typedText, setTypedText] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const titles = [
    publicProfile?.basicInfo?.title || settings?.personal?.title || 'Full Stack Developer',
    ...(publicProfile?.professional?.specializations?.map(spec => spec.name) || []),
    'React.js Specialist', 
    'Node.js Expert',
    'SEO Expert'
  ].filter(Boolean);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  // Typing animation effect
  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    let charIndex = 0;
    const typingTimer = setInterval(() => {
      setTypedText(currentTitle.substring(0, charIndex));
      charIndex++;
      if (charIndex > currentTitle.length) {
        setTimeout(() => {
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
          charIndex = 0;
        }, 2000);
        clearInterval(typingTimer);
      }
    }, 100);

    return () => clearInterval(typingTimer);
  }, [currentTitleIndex]);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        const response = await testimonialsService.getAll({ 
          featured: true, 
          limit: 6,
          minRating: 4 
        });
        setTestimonials(response.data.testimonials || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to empty array on error
        setTestimonials([]);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide testimonials based on the number of testimonials loaded
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const totalSlides = Math.ceil(testimonials.length / 2); // 2 testimonials per slide
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials]);

  // Fetch latest blog posts for homepage
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setBlogLoading(true);
        const response = await blogService.getAll({ 
          limit: 3, 
          sort: 'newest',
          featured: true 
        });
        setBlogPosts(response.data.blogs || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      } finally {
        setBlogLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  // Fetch featured portfolio projects for homepage
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setPortfolioLoading(true);
        const response = await portfolioService.getAll({ 
          limit: 3, 
          featured: true,
          sort: 'newest' 
        });
        setPortfolioProjects(response.data.projects || []);
      } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        setPortfolioProjects([]);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  const skills = [
    { name: 'React.js', level: 95, icon: Code, color: 'from-blue-500 to-cyan-500' },
    { name: 'Node.js', level: 90, icon: Server, color: 'from-green-500 to-emerald-500' },
    { name: 'MongoDB', level: 88, icon: Database, color: 'from-green-600 to-green-400' },
    { name: 'JavaScript', level: 95, icon: Code, color: 'from-yellow-500 to-orange-500' },
    { name: 'SEO', level: 92, icon: Search, color: 'from-purple-500 to-pink-500' },
    { name: 'Mobile Dev', level: 85, icon: Smartphone, color: 'from-indigo-500 to-blue-500' }
  ];

  const services = [
    {
      icon: Code,
      title: 'Full Stack Development',
      description: 'End-to-end web application development using modern technologies like React, Node.js, and cloud services.',
      features: ['Custom Web Apps', 'API Development', 'Database Design', 'Performance Optimization']
    },
    {
      icon: Search,
      title: 'SEO Optimization',
      description: 'Complete SEO strategy and implementation to boost your website\'s visibility and organic traffic.',
      features: ['Technical SEO', 'Content Optimization', 'Performance Audit', 'Analytics Setup']
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Responsive, mobile-first applications that provide excellent user experience across all devices.',
      features: ['Responsive Design', 'PWA Development', 'Cross-Platform', 'Touch Optimization']
    },
    {
      icon: Globe,
      title: 'E-Commerce Solutions',
      description: 'Complete e-commerce platforms with payment integration, inventory management, and admin panels.',
      features: ['Payment Integration', 'Inventory System', 'Admin Dashboard', 'Security Implementation']
    }
  ];



  return (
    <>
      <SEOHelmet config={pageSEO.home(publicProfile, settings)} />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden pt-20">
        {/* Animated Tech Icons Background */}
        <div className="absolute inset-0 opacity-10">
          {/* Floating Tech Icons */}
          <motion.div
            className="absolute top-20 left-20 text-blue-400"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Code className="w-12 h-12" />
          </motion.div>
          
          <motion.div
            className="absolute top-40 right-32 text-green-400"
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Database className="w-10 h-10" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-40 text-purple-400"
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 90, 180]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <Server className="w-14 h-14" />
          </motion.div>

          <motion.div
            className="absolute top-1/3 left-1/4 text-yellow-400"
            animate={{ 
              y: [0, 20, 0],
              x: [0, 15, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          >
            <Smartphone className="w-8 h-8" />
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-20 text-pink-400"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Globe className="w-16 h-16" />
          </motion.div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Updated Layout: Text Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-left"
              >
                {/* Main Heading */}
                <motion.div variants={itemVariants} className="mb-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    Hi, I'm{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
                      {publicProfile?.basicInfo?.firstName || 
                       settings?.personal?.name?.split(' ')[0] || 'Developer'}
                    </span>
                  </h1>
                  <div className="text-xl md:text-2xl lg:text-3xl text-blue-400 font-light h-12">
                    {typedText}<span className="animate-ping text-white">|</span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
                >
                  {publicProfile?.basicInfo?.bio || 
                   settings?.personal?.bio || 
                   `${publicProfile?.basicInfo?.title || settings?.personal?.title || 'Full Stack Developer'} with expertise in modern web technologies. 
                    Passionate about creating high-performance web applications and digital solutions.`}
                </motion.p>

                {/* Key Stats */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-6 mb-8"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white font-semibold">
                      {publicProfile?.professional?.yearsOfExperience || 10}+ Years
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white font-semibold">
                      {publicProfile?.stats?.projectsCompleted || 150}+ Projects
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-white font-semibold">
                      {publicProfile?.stats?.clientsSatisfied || 50}+ Clients
                    </span>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                  <Link
                    to="/portfolio"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    <span>View My Work</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-400 border-2 border-blue-400 rounded-full hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Get in Touch
                  </Link>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  variants={itemVariants}
                  className="flex space-x-4"
                >
                  {(publicProfile?.socialMedia?.github || settings?.social?.github) && (
                    <a
                      href={publicProfile?.socialMedia?.github || settings?.social?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800/30 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                  )}
                  {(publicProfile?.socialMedia?.linkedin || settings?.social?.linkedin) && (
                    <a
                      href={publicProfile?.socialMedia?.linkedin || settings?.social?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800/30 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  )}
                  {settings?.contact?.email?.primary && (
                    <a
                      href={`mailto:${settings.contact.email.primary}`}
                      className="p-3 bg-gray-800/30 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110"
                    >
                      <Mail className="h-6 w-6" />
                    </a>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Side - Profile Image */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative">
                  {/* Main Profile Image */}
                  <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border-4 border-blue-500/30 shadow-2xl shadow-blue-500/25 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face"
                      alt="Shailendra Chaurasia - Senior Full Stack Developer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Code className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                    animate={{ 
                      y: [0, 8, 0],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <Database className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Availability Badge */}
                  <motion.div
                    className="absolute top-4 left-4 inline-flex items-center px-4 py-2 rounded-full bg-green-900/80 border border-green-500/50 text-green-400 text-sm font-medium backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    Available
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Me</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A passionate technologist with a decade of experience building scalable web solutions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  With <span className="text-blue-400 font-semibold">10+ years</span> in the industry, I've had the privilege 
                  of working with startups, agencies, and enterprise clients to deliver exceptional web solutions. 
                  My expertise spans the entire development stack, from crafting intuitive user interfaces to 
                  architecting robust backend systems.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  I specialize in <span className="text-purple-400 font-semibold">React.js ecosystems</span>, 
                  <span className="text-green-400 font-semibold"> Node.js backend development</span>, and 
                  <span className="text-blue-400 font-semibold"> SEO optimization</span>. My approach combines 
                  technical excellence with business acumen to deliver solutions that drive real results.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                    India
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-5 w-5 text-green-400 mr-2" />
                    Available for Remote Work
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-5 w-5 text-purple-400 mr-2" />
                    +91 98765 43210
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Core Expertise</h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <skill.icon className="h-5 w-5 text-blue-400 mr-3" />
                          <span className="text-white font-medium">{skill.name}</span>
                        </div>
                        <span className="text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievement Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* 98% Client Satisfaction */}
            <motion.div
              className="group relative bg-gradient-to-br from-blue-500 to-blue-600 p-1 rounded-2xl hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 text-center h-full">
                <motion.div 
                  className="text-5xl md:text-6xl font-bold text-blue-400 mb-3 font-mono"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.6 }}
                  viewport={{ once: true }}
                >
                  98%
                </motion.div>
                <div className="text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Client Satisfaction
                </div>
              </div>
            </motion.div>

            {/* 150+ Projects Delivered */}
            <motion.div
              className="group relative bg-gradient-to-br from-green-500 to-emerald-600 p-1 rounded-2xl hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 text-center h-full">
                <motion.div 
                  className="text-5xl md:text-6xl font-bold text-green-400 mb-3 font-mono"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.6 }}
                  viewport={{ once: true }}
                >
                  150+
                </motion.div>
                <div className="text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Projects Delivered
                </div>
              </div>
            </motion.div>

            {/* 50+ Happy Clients */}
            <motion.div
              className="group relative bg-gradient-to-br from-purple-500 to-pink-600 p-1 rounded-2xl hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 text-center h-full">
                <motion.div 
                  className="text-5xl md:text-6xl font-bold text-purple-400 mb-3 font-mono"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.6 }}
                  viewport={{ once: true }}
                >
                  50+
                </motion.div>
                <div className="text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Happy Clients
                </div>
              </div>
            </motion.div>

            {/* 24/7 Support */}
            <motion.div
              className="group relative bg-gradient-to-br from-yellow-500 to-orange-600 p-1 rounded-2xl hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-8 text-center h-full">
                <motion.div 
                  className="text-5xl md:text-6xl font-bold text-yellow-400 mb-3 font-mono"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.6 }}
                  viewport={{ once: true }}
                >
                  24/7
                </motion.div>
                <div className="text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Support
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive development solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-blue-400 mb-6 group-hover:text-blue-300 transition-colors">
                  <service.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <Star className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Projects</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A showcase of my recent work and technical achievements
            </p>
          </motion.div>

          {/* Portfolio Projects Grid */}
          {portfolioLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 animate-pulse">
                  <div className="aspect-video bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="h-5 w-5 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : portfolioProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {portfolioProjects.map((project, index) => (
                <motion.div
                  key={project._id || project.id}
                  className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/portfolio/${project.slug || project._id}`}>
                    <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img 
                          src={project.images[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Code className="h-16 w-16 text-white/80" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                      {project.isFeatured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-full">
                          {project.category}
                        </span>
                        {project.status && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'Published' 
                              ? 'bg-green-900/30 text-green-400'
                              : project.status === 'Draft'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-blue-900/30 text-blue-400'
                          }`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies && project.technologies.slice(0, 2).map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies && project.technologies.length > 2 && (
                            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                              +{project.technologies.length - 2}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.liveUrl && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(project.liveUrl, '_blank');
                              }}
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                              title="View Live Project"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          )}
                          {project.githubUrl && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(project.githubUrl, '_blank');
                              }}
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                              title="View Source Code"
                            >
                              <Github className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">No Featured Projects</h3>
              <p className="text-gray-400 mb-8">Check back soon for new project showcases!</p>
            </motion.div>
          )}

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Sliding Carousel */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Testimonials</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              What clients say about working with me
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-7xl mx-auto">
            {testimonialsLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 animate-pulse">
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-5 h-5 bg-gray-700 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full mr-3"></div>
                      <div className="text-left">
                        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    className="flex transition-transform duration-500 ease-in-out"
                    animate={{ x: -currentTestimonial * 100 + "%" }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div key={testimonial._id || testimonial.id || index} className="w-1/2 flex-shrink-0 px-3">
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 text-center h-full">
                          {/* Stars */}
                          <div className="flex items-center justify-center mb-4">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current mx-1" />
                            ))}
                          </div>
                          
                          {/* Testimonial Content */}
                          <p className="text-lg text-gray-300 mb-6 leading-relaxed italic font-light">
                            "{testimonial.content}"
                          </p>
                          
                          {/* Project Type Tag */}
                          {testimonial.projectType && (
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-full">
                                {testimonial.projectType}
                              </span>
                            </div>
                          )}
                          
                          {/* Client Info */}
                          <div className="flex items-center justify-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                              {testimonial.avatar ? (
                                <img 
                                  src={testimonial.avatar} 
                                  alt={testimonial.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                testimonial.name?.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-white">{testimonial.name}</div>
                              <div className="text-gray-400 text-sm">
                                {testimonial.position}{testimonial.company && ` at ${testimonial.company}`}
                              </div>
                              {testimonial.source && testimonial.source !== 'direct' && (
                                <div className="text-gray-500 text-xs mt-1 capitalize">
                                  via {testimonial.source}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">No Testimonials Yet</h3>
                <p className="text-gray-400 mb-8">
                  Client testimonials will appear here once they're added to the system.
                </p>
              </motion.div>
            )}

            {/* Navigation and Indicators - Only show for non-empty testimonials */}
            {!testimonialsLoading && testimonials.length > 2 && (
              <>
                {/* Navigation Buttons */}
                <button
                  onClick={() => {
                    const totalSlides = Math.ceil(testimonials.length / 2);
                    setCurrentTestimonial(currentTestimonial === 0 ? totalSlides - 1 : currentTestimonial - 1);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all duration-300 z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <button
                  onClick={() => {
                    const totalSlides = Math.ceil(testimonials.length / 2);
                    setCurrentTestimonial(currentTestimonial === totalSlides - 1 ? 0 : currentTestimonial + 1);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all duration-300 z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {!testimonialsLoading && testimonials.length > 2 && (
              <div className="flex justify-center mt-8 space-x-3">
                {[...Array(Math.ceil(testimonials.length / 2))].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-blue-500 w-8' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Testimonials Summary */}
            {!testimonialsLoading && testimonials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <div className="flex items-center justify-center space-x-8 text-gray-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{testimonials.length}+</div>
                    <div className="text-sm">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '5.0'}
                    </div>
                    <div className="text-sm flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      Average Rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-sm">Satisfaction Rate</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Insights</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sharing knowledge and insights about web development and technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="aspect-video bg-gray-700 animate-pulse"></div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="h-5 w-16 bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-700 rounded animate-pulse ml-auto"></div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4 mb-4"></div>
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </motion.div>
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((blog, index) => (
                <motion.div
                  key={blog._id || blog.id}
                  className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/blog/${blog.slug}`} className="block">
                    <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                      {blog.featuredImage ? (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="w-12 h-12 text-white/70" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-gray-500 text-sm ml-auto">
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                          <span className="text-sm font-medium">Read More</span>
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="flex items-center text-gray-500 text-xs space-x-3">
                          {blog.readingTime && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {blog.readingTime}min
                            </span>
                          )}
                          {blog.views && (
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {blog.views}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              // No blog posts state
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Blog Posts Yet</h3>
                <p className="text-gray-400">Check back soon for the latest insights and articles!</p>
              </motion.div>
            )}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-400 border-2 border-blue-400 rounded-full hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Touch</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Contact Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-3xl font-bold text-white mb-8">Let's Start a Conversation</h3>
                <p className="text-gray-300 leading-relaxed mb-8">
                  I'm always excited to work on new projects and meet new people. Whether you have a question about my work or want to discuss a potential collaboration, don't hesitate to reach out.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <div className="text-gray-400">shailendra.chaurasia@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Phone</div>
                    <div className="text-gray-400">+91 98765 43210</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Location</div>
                    <div className="text-gray-400">India</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@example.com"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Project inquiry, collaboration..."
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell me about your project or how I can help you..."
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and turn your ideas into reality. 
              I'm available for freelance work, consulting, and full-time opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Start a Project
              </Link>
              <a
                href="/resume.pdf"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};