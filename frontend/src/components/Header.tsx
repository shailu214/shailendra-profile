import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Code, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { useProfile } from '../context/ProfileContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true); // Default to dark theme
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { publicProfile } = useProfile();

  // Update theme based on settings
  useEffect(() => {
    if (settings?.theme?.colorScheme) {
      const prefersDark = settings.theme.colorScheme === 'dark' || 
        (settings.theme.colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings?.theme?.colorScheme]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Use dynamic navigation items from settings or fallback to defaults
  const navigationItems = settings?.navigation?.menuItems?.length > 0 
    ? settings.navigation.menuItems
        .filter(item => item.isActive)
        .sort((a, b) => a.order - b.order)
        .map(item => ({ name: item.label, path: item.path }))
    : [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
      ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' 
        : 'bg-gray-900/90 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {settings?.site?.logo?.url ? (
              <img 
                src={settings.site.logo.url}
                alt={settings.site.logo.alt || settings.site.name || 'Logo'}
                className="w-12 h-12 rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {settings?.personal?.name?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
            )}
            <div className="hidden sm:block">
              <div className="text-white font-bold text-lg">
                {publicProfile?.basicInfo?.firstName || 
                 settings?.personal?.name?.split(' ')[0] || 'Portfolio'}
              </div>
              <div className="text-gray-400 text-sm">
                {publicProfile?.basicInfo?.title || 
                 settings?.personal?.title || settings?.site?.tagline || 'Developer'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-gray-800/50 rounded-full px-2 py-2 backdrop-blur-sm">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-white bg-blue-600 shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* GitHub Icon */}
            {(publicProfile?.socialMedia?.github || settings?.social?.github) && (
              <a
                href={publicProfile?.socialMedia?.github || settings?.social?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Code size={20} />
              </a>
            )}

            {/* LinkedIn Icon */}
            {(publicProfile?.socialMedia?.linkedin || settings?.social?.linkedin) && (
              <a
                href={publicProfile?.socialMedia?.linkedin || settings?.social?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                </svg>
              </a>
            )}

            {/* Resume Download Button */}
            <a
              href="/resume.pdf"
              download
              className="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Download size={16} className="mr-2" />
              Resume
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-6 bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
          >
            <nav className="space-y-2 px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-full text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-6 pt-6 px-4 border-t border-gray-800">
              <a
                href={settings?.social?.github || 'https://github.com/shailendrachaurasia'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Code size={20} />
              </a>
              
              <a
                href={settings?.social?.linkedin || 'https://linkedin.com/in/shailendra-chaurasia'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                </svg>
              </a>
              
              <a
                href="/resume.pdf"
                download
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <Download size={16} className="mr-2" />
                Resume
              </a>
              
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};