import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProfile } from '../context/ProfileContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { publicProfile } = useProfile();
  const currentYear = new Date().getFullYear();

  // Build social links dynamically based on profile and settings
  const socialLinks = [
    ...((publicProfile?.socialMedia?.github || settings?.social?.github) ? [{ 
      name: 'GitHub', 
      url: publicProfile?.socialMedia?.github || settings?.social?.github || '', 
      icon: Github,
      color: 'hover:bg-gray-700 hover:text-white'
    }] : []),
    ...((publicProfile?.socialMedia?.linkedin || settings?.social?.linkedin) ? [{ 
      name: 'LinkedIn', 
      url: publicProfile?.socialMedia?.linkedin || settings?.social?.linkedin || '', 
      icon: Linkedin,
      color: 'hover:bg-blue-600 hover:text-white'
    }] : []),
    ...((publicProfile?.socialMedia?.twitter || settings?.social?.twitter) ? [{ 
      name: 'Twitter', 
      url: publicProfile?.socialMedia?.twitter || settings?.social?.twitter || '', 
      icon: Twitter,
      color: 'hover:bg-blue-400 hover:text-white'
    }] : []),
    ...(settings?.contact?.email?.primary ? [{ 
      name: 'Email', 
      url: `mailto:${settings.contact.email.primary}`, 
      icon: Mail,
      color: 'hover:bg-red-600 hover:text-white'
    }] : [])
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Brand + About */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              {settings?.site?.logo?.url ? (
                <img 
                  src={settings.site.logo.url}
                  alt={settings.site.logo.alt || settings.site.name || 'Logo'}
                  className="w-10 h-10 rounded-md object-cover shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {(publicProfile?.basicInfo?.firstName?.charAt(0) || 
                    settings?.personal?.name?.charAt(0))?.toUpperCase() || 'P'}
                </div>
              )}
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {publicProfile?.basicInfo?.firstName || 
                   settings?.personal?.name?.split(' ')[0] || settings?.site?.name || 'Portfolio'}
                </h3>
                <div className="text-sm text-gray-400">
                  {publicProfile?.basicInfo?.title || 
                   settings?.personal?.title || settings?.site?.tagline || 'Full Stack Developer'}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">
              {settings?.personal?.bio || settings?.site?.description || 
               'Passionate Full Stack Developer creating amazing digital experiences and solutions.'}
            </p>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-3 font-medium">Connect with me:</p>
              <div className="flex items-center space-x-3">
                {socialLinks.map(s => (
                  <a 
                    key={s.name} 
                    href={s.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`group p-3 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 ${s.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                    title={s.name}
                  >
                    <s.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
              
              {/* Availability Status */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {settings?.personal?.availability?.status && (
                  <span className={`px-3 py-1 rounded-full border ${
                    settings.personal.availability.status === 'Available' 
                      ? 'bg-green-900/30 text-green-400 border-green-500/30' 
                      : settings.personal.availability.status === 'Busy'
                      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-900/30 text-red-400 border-red-500/30'
                  }`}>
                    {settings.personal.availability.status === 'Available' && '🟢'} 
                    {settings.personal.availability.status === 'Busy' && '🟡'} 
                    {settings.personal.availability.status === 'Not Available' && '🔴'} 
                    {settings.personal.availability.status} for Work
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full border border-blue-500/30">
                  💬 Quick Response
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>
                📍 Based in {settings?.personal?.location?.city || settings?.contact?.address?.city || 'Remote'} 
                • 🌍 Available Worldwide
              </p>
              <p className="mt-1">💼 Open for Remote Work & Consulting</p>
              {settings?.personal?.availability?.message && (
                <p className="mt-1 italic">"{settings.personal.availability.message}"</p>
              )}
            </div>
          </div>

          {/* Middle: Links & Services */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/portfolio" className="hover:text-white">Portfolio</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Full Stack Development</li>
                <li>React & Frontend Engineering</li>
                <li>Node.js & API Development</li>
                <li>SEO & Performance</li>
                <li>E-commerce Solutions</li>
              </ul>
            </div>
          </div>

          {/* Right: Contact / Newsletter */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
            <div className="text-sm text-gray-400 mb-6 space-y-2">
              {settings?.contact?.email?.primary && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <a href={`mailto:${settings.contact.email.primary}`} className="hover:text-white transition-colors">
                    {settings.contact.email.primary}
                  </a>
                </div>
              )}
              {settings?.contact?.phone?.primary && (
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-green-400">📞</span>
                  <a href={`tel:${settings.contact.phone.primary}`} className="hover:text-white transition-colors">
                    {settings.contact.phone.primary}
                  </a>
                </div>
              )}
              {(settings?.personal?.location?.city || settings?.contact?.address?.city) && (
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-purple-400">📍</span>
                  <span>{settings?.personal?.location?.city || settings?.contact?.address?.city}</span>
                </div>
              )}
            </div>

            <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
            <p className="text-xs text-gray-500 mb-3">Subscribe to get latest updates on new projects and blog posts</p>
            <form className="flex">
              <input 
                placeholder="Your email" 
                className="w-full px-3 py-2 rounded-l-md bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-400" 
              />
              <button 
                type="button" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-md text-white text-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-400">© {currentYear} {settings?.personal?.name || settings?.site?.name || 'Portfolio'}. All rights reserved.</div>
          <div className="text-sm text-gray-400 flex items-center gap-4">
            <div>Made with <Heart className="inline-block text-red-500" size={14} /></div>
            <div className="hidden sm:block">Built with React, Node.js & MongoDB</div>
          </div>
        </div>
      </div>
    </footer>
  );
};