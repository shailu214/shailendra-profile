import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart, MapPin, Phone, Calendar, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/shailendrachaurasia',
      icon: Github,
      color: 'hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/shailendra-chaurasia',
      icon: Linkedin,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/shailendra_dev',
      icon: Twitter,
      color: 'hover:text-blue-300'
    },
    {
      name: 'Email',
      url: 'mailto:shailendra.chaurasia@gmail.com',
      icon: Mail,
      color: 'hover:text-red-400'
    },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    'Full Stack Development',
    'React.js Development',
    'Node.js Backend',
    'SEO Optimization',
    'E-commerce Solutions',
    'API Development'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-t border-gray-800/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-pink-500 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Shailendra Chaurasia
              </h3>
              <p className="text-blue-400 font-medium mb-4">Senior Full Stack Developer & SEO Expert</p>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Transforming ideas into powerful digital solutions with 10+ years of expertise in 
                modern web technologies. Let's build something amazing together.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <a href="mailto:shailendra.chaurasia@gmail.com" className="hover:text-white transition-colors">
                  shailendra.chaurasia@gmail.com
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 text-green-400" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                <span>India (Remote Available)</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="w-5 h-5 mr-3 text-yellow-400" />
                <span>Available for New Projects</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-gray-800/50 rounded-lg text-gray-400 ${link.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700/50`}
                  aria-label={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={item.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-3"></span>
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li 
                  key={service}
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 cursor-default flex items-center group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="mt-16 pt-12 border-t border-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-gray-700/50">
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold text-white mb-4">Ready to Start Your Project?</h4>
              <p className="text-gray-300 mb-6">
                Let's discuss your requirements and turn your ideas into reality. 
                I'm always excited to work on innovative projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Start a Project
                </a>
                <a
                  href="/resume.pdf"
                  className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-medium hover:border-blue-500 hover:text-white transition-all duration-300"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-800/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Shailendra Chaurasia. All rights reserved. | Crafted with precision and passion.
            </p>
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm flex items-center">
                Made with <Heart size={16} className="mx-2 text-red-500 animate-pulse" /> using React & Node.js
              </p>
              <button
                onClick={scrollToTop}
                className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll to top"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};