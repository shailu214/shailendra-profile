import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Github,
  Linkedin,
  Twitter,
  ExternalLink
} from 'lucide-react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Portfolio Admin</h3>
                <p className="text-sm text-gray-600">Content Management System</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Manage your portfolio content, blog posts, testimonials, and more from this centralized admin panel. 
              Keep your website updated and engaging for visitors.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com/shailendrachaurasia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="https://linkedin.com/in/shailendrachaurasia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="https://twitter.com/shailendrachaurasia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/pages"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>Manage Pages</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/portfolio"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>Add New Project</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/blog"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>Write Blog Post</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/testimonials"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>Manage Reviews</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/settings"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>Site Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/seo-test"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>SEO Testing</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>admin@portfolio.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <a 
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Visit Portfolio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Shailendra Chaurasia</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© 2024 Portfolio Admin Panel</span>
              <Link to="/admin/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/admin/terms" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">System Status: All Services Operational</span>
            </div>
            <div className="text-xs text-green-600">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};