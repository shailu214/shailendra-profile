import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Profile Section - Left Side */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                S
              </div>
              <h3 className="text-2xl font-bold text-white">
                Shailendra Chaurasia
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Passionate Senior Full Stack Developer and SEO Expert creating amazing 
              digital experiences. Specializing in modern web technologies and 
              user-centered design solutions with 10+ years of experience.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-blue-400">shailendra.chaurasia@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                <span>India</span>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/shailendrachaurasia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/shailendra-chaurasia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/shailendra_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/shailendra.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Section - Middle */}
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Section - Right Side */}
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                Web Development
              </li>
              <li className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                Mobile Development
              </li>
              <li className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                UI/UX Design
              </li>
              <li className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                E-commerce Solutions
              </li>
              <li className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                SEO Optimization
              </li>
              <li className="text-gray-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                Digital Marketing
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Shailendra Chaurasia. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};