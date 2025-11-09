import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { YoastSEOAnalyzer } from '../../components/admin/YoastSEOAnalyzer';
import { ToastContainer } from '../../components/admin/Toast';
import { FileUpload } from '../../components/admin/FileUpload';
import { useToast } from '../../hooks/useToast';
import { 
  Save,
  Globe,
  Search,
  Eye,
  Settings as SettingsIcon
} from 'lucide-react';

interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    logo: string;
    favicon: string;
    defaultImage: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeyphrase: string;
    separator: string;
    googleAnalytics: string;
    googleSearchConsole: string;
    facebookPixel: string;
    twitterHandle: string;
  };
  social: {
    ogImage: string;
    twitterImage: string;
    linkedinImage: string;
  };
}

export const AdminSiteSettings: React.FC = () => {
  const { toasts, removeToast, success } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [showSEOPreview, setShowSEOPreview] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'Shailendra Chaurasia Portfolio',
      tagline: 'Full-Stack Developer & Designer',
      description: 'Passionate full-stack developer with expertise in React, Node.js, and modern web technologies.',
      logo: '/logo.png',
      favicon: '/favicon.ico',
      defaultImage: '/og-image.jpg'
    },
    seo: {
      defaultTitle: 'Shailendra Chaurasia - Full-Stack Developer Portfolio',
      defaultDescription: 'Explore the portfolio of Shailendra Chaurasia, a skilled full-stack developer specializing in React, Node.js, and modern web development.',
      defaultKeyphrase: 'full-stack developer portfolio',
      separator: '|',
      googleAnalytics: 'G-XXXXXXXXXX',
      googleSearchConsole: 'google-site-verification=xxxxxxxxxxxx',
      facebookPixel: '',
      twitterHandle: '@shailendrac'
    },
    social: {
      ogImage: '/og-image.jpg',
      twitterImage: '/twitter-image.jpg',
      linkedinImage: '/linkedin-image.jpg'
    }
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  const handleInputChange = (section: keyof SiteSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };



  const handleSave = () => {
    // Save settings logic would go here
    success('Settings Saved', 'Site settings have been successfully updated.');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'seo', label: 'SEO & Analytics', icon: Search },
    { id: 'social', label: 'Social Media', icon: Globe }
  ];

  const generateSEOPreview = () => {
    const title = settings.seo.defaultTitle;
    const description = settings.seo.defaultDescription;
    const url = 'https://shailendrachaurasia.com';
    
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Search className="w-4 h-4 mr-2" />
          Google Search Preview
        </h4>
        <div className="bg-white p-4 rounded border">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {title}
          </div>
          <div className="text-green-700 text-sm mt-1">
            {url}
          </div>
          <div className="text-gray-600 text-sm mt-1 line-clamp-2">
            {description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
            <p className="mt-2 text-gray-600">
              Configure your site's general settings, SEO, and social media integration.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowSEOPreview(!showSEOPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              SEO Preview
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* SEO Preview */}
      {showSEOPreview && (
        <div className="mb-8">
          {generateSEOPreview()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.general.tagline}
                      onChange={(e) => handleInputChange('general', 'tagline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.general.description}
                    onChange={(e) => handleInputChange('general', 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Logo
                  </label>
                  <FileUpload
                    onFileSelect={(_, dataUrl) => {
                      setLogoPreview(dataUrl);
                      handleInputChange('general', 'logo', dataUrl);
                    }}
                    acceptedTypes="image/png,image/jpeg,image/svg+xml,image/webp"
                    maxSize={2}
                    preview={logoPreview || settings.general.logo}
                    placeholder="Upload your logo"
                    dimensions="Recommended: PNG or SVG, max 200x80px"
                  />
                </div>

                {/* Favicon Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <FileUpload
                    onFileSelect={(_, dataUrl) => {
                      setFaviconPreview(dataUrl);
                      handleInputChange('general', 'favicon', dataUrl);
                    }}
                    acceptedTypes="image/x-icon,image/png,image/svg+xml"
                    maxSize={1}
                    preview={faviconPreview || settings.general.favicon}
                    placeholder="Upload your favicon"
                    dimensions="Recommended: ICO or PNG, 32x32px or 16x16px"
                  />
                </div>

                {/* Default Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.general.defaultImage}
                    onChange={(e) => handleInputChange('general', 'defaultImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/default-image.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Used when no specific featured image is set for blog posts or portfolio items.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO & Analytics</h2>
                
                {/* Default SEO Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default SEO Title
                  </label>
                  <input
                    type="text"
                    value={settings.seo.defaultTitle}
                    onChange={(e) => handleInputChange('seo', 'defaultTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Length: {settings.seo.defaultTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.seo.defaultDescription}
                    onChange={(e) => handleInputChange('seo', 'defaultDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Length: {settings.seo.defaultDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Focus Keyphrase
                  </label>
                  <input
                    type="text"
                    value={settings.seo.defaultKeyphrase}
                    onChange={(e) => handleInputChange('seo', 'defaultKeyphrase', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Analytics */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics & Tracking</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={settings.seo.googleAnalytics}
                        onChange={(e) => handleInputChange('seo', 'googleAnalytics', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Search Console
                      </label>
                      <input
                        type="text"
                        value={settings.seo.googleSearchConsole}
                        onChange={(e) => handleInputChange('seo', 'googleSearchConsole', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="google-site-verification=xxxxxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Analysis */}
                <div className="border-t border-gray-200 pt-6">
                  <YoastSEOAnalyzer
                    title={settings.seo.defaultTitle}
                    description={settings.seo.defaultDescription}
                    keyphrase={settings.seo.defaultKeyphrase}
                    content={settings.general.description}
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={settings.seo.twitterHandle}
                    onChange={(e) => handleInputChange('seo', 'twitterHandle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.ogImage}
                    onChange={(e) => handleInputChange('social', 'ogImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended: 1200x630px for Facebook, LinkedIn
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Card Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.twitterImage}
                    onChange={(e) => handleInputChange('social', 'twitterImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended: 1200x600px for Twitter cards
                  </p>
                </div>

                {/* Social Preview */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Facebook/LinkedIn Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-3 text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Facebook/LinkedIn
                      </div>
                      {settings.social.ogImage && (
                        <img
                          src={settings.social.ogImage}
                          alt="OG Preview"
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {settings.seo.defaultTitle}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {settings.seo.defaultDescription}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          shailendrachaurasia.com
                        </div>
                      </div>
                    </div>

                    {/* Twitter Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-3 text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Twitter
                      </div>
                      {settings.social.twitterImage && (
                        <img
                          src={settings.social.twitterImage}
                          alt="Twitter Preview"
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {settings.seo.defaultTitle}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {settings.seo.defaultDescription}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          🔗 shailendrachaurasia.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AdminLayout>
  );
};