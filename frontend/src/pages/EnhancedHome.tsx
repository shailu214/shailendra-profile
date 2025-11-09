import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useAnimation, useInView } from 'framer-motion';
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
  Coffee,
  Star,
  ExternalLink,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Home: React.FC = () => {
  const { settings, loading } = useSettings();
  const [typedText, setTypedText] = useState('');
  const titles = [
    'Senior Full Stack Developer',
    'SEO Expert',
    'React.js Specialist', 
    'Node.js Expert',
    'MongoDB Specialist'
  ];
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
        ease: "easeOut"
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

  const stats = [
    { number: '10+', label: 'Years Experience', icon: Award },
    { number: '150+', label: 'Projects Completed', icon: Code },
    { number: '50+', label: 'Happy Clients', icon: Users },
    { number: '24/7', label: 'Support Available', icon: Coffee }
  ];

  return (
    <>
      <Helmet>
        <title>Shailendra Chaurasia - Senior Full Stack Developer & SEO Expert</title>
        <meta name="description" content="Shailendra Chaurasia - 10+ years experienced Senior Full Stack Developer specializing in React.js, Node.js, MongoDB, and SEO optimization. Available for consulting and development projects." />
        <meta name="keywords" content="Shailendra Chaurasia, Full Stack Developer, React.js, Node.js, MongoDB, SEO Expert, Web Development, JavaScript" />
      </Helmet>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Profile Image */}
              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <div className="relative mx-auto w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl shadow-blue-500/25">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    alt="Shailendra Chaurasia"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants} className="mb-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
                  Hi, I'm{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
                    Shailendra
                  </span>
                </h1>
                <div className="text-2xl md:text-3xl lg:text-4xl text-blue-400 font-light h-12">
                  {typedText}<span className="animate-ping">|</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
              >
                Passionate Senior Full Stack Developer with{' '}
                <span className="text-blue-400 font-semibold">10+ years</span> of experience crafting 
                high-performance web applications. Expert in React.js, Node.js, MongoDB, and SEO optimization.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link
                  to="/portfolio"
                  className="group relative inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  <span>View My Work</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-400 border-2 border-blue-400 rounded-full hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                </Link>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center space-x-6"
              >
                <a
                  href="https://github.com/shailendrachaurasia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                >
                  <Github className="h-8 w-8" />
                </a>
                <a
                  href="https://linkedin.com/in/shailendra-chaurasia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <Linkedin className="h-8 w-8" />
                </a>
                <a
                  href="mailto:shailendra.chaurasia@gmail.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <Mail className="h-8 w-8" />
                </a>
              </motion.div>

              {/* Availability Status */}
              <motion.div
                variants={itemVariants}
                className="mt-8"
              >
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-900/30 border border-green-500/30 text-green-400">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse"></div>
                  Available for new projects and consulting
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800 border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((project, index) => (
              <motion.div
                key={project}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code className="h-16 w-16 text-white/80" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Project {project}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Full-stack application built with React, Node.js, and MongoDB
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">React</span>
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">Node.js</span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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
            {[1, 2, 3].map((blog, index) => (
              <motion.div
                key={blog}
                className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">Tech</span>
                    <span className="text-gray-500 text-sm ml-auto">Dec 2024</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    Modern React Development Tips
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Discover the latest best practices and patterns for building scalable React applications...
                  </p>
                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
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