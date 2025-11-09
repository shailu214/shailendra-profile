import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Globe, 
  FileText, 
  TrendingUp,
  Home,
  BarChart3,
  ExternalLink,
  Save,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { YoastSEOAnalyzer } from '../../components/admin/YoastSEOAnalyzer';
import { useAuth } from '../../context/AuthContext';

interface Page {
  _id: string;
  name: string;
  slug: string;
  path: string;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
    focusKeyphrase: string;
    canonicalUrl?: string;
    robots: {
      index: boolean;
      follow: boolean;
    };
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
  content: {
    hero?: {
      title?: string;
      subtitle?: string;
      description?: string;
      ctaText?: string;
      ctaLink?: string;
      backgroundImage?: string;
    };
    sections: Array<{
      type: 'text' | 'image' | 'gallery' | 'testimonials' | 'features' | 'contact' | 'custom';
      title?: string;
      content?: string;
      data?: any;
      order: number;
    }>;
  };
  status: 'draft' | 'published' | 'archived';
  isHomepage: boolean;
  template: 'default' | 'landing' | 'blog' | 'portfolio' | 'contact' | 'about';
  analytics?: {
    views: number;
    lastViewed?: string;
    bounceRate?: number;
    avgTimeOnPage?: number;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminPages: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<Partial<Page>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'content' | 'analytics'>('basic');
  const [seoAnalysis, setSeoAnalysis] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Fetch pages on component mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pages?includeAnalytics=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPages(data.data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = () => {
    setEditingPage(null);
    setFormData({
      name: '',
      path: '',
      status: 'draft',
      template: 'default',
      isHomepage: false,
      seo: {
        title: '',
        metaDescription: '',
        keywords: [],
        focusKeyphrase: '',
        robots: { index: true, follow: true }
      },
      content: {
        sections: []
      }
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
    setFormData(page);
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleSavePage = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingPage ? `/api/pages/${editingPage._id}` : '/api/pages';
      const method = editingPage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchPages();
        setShowModal(false);
        setEditingPage(null);
        setFormData({});
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.seo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case 'landing': return <Home className="h-4 w-4" />;
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'portfolio': return <BarChart3 className="h-4 w-4" />;
      case 'contact': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Pages Management - Admin Dashboard</title>
        <meta name="description" content="Manage website pages with SEO optimization and content management tools" />
      </Helmet>
      
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
          <p className="text-gray-600 mt-2">Manage all pages with SEO optimization</p>
        </div>
        <button
          onClick={handleCreatePage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Page
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold">{pages.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {pages.filter(p => p.status === 'published').length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pages.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold">
                {pages.reduce((acc, p) => acc + (p.analytics?.views || 0), 0)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SEO Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTemplateIcon(page.template)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {page.name}
                          {page.isHomepage && (
                            <span title="Homepage">
                              <Home className="h-4 w-4 text-blue-600" />
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{page.path}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">
                          {page.seo.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {page.template}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">75%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {page.analytics?.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(page.path, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditPage(page)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Page"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Page"
                        disabled={page.isHomepage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit Page */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingPage ? 'Edit Page' : 'Create New Page'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex px-6">
                {[
                  { id: 'basic', label: 'Basic Info', icon: FileText },
                  { id: 'seo', label: 'SEO & Meta', icon: TrendingUp },
                  { id: 'content', label: 'Content', icon: Edit3 },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Home, About, Services"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Path *
                      </label>
                      <input
                        type="text"
                        value={formData.path || ''}
                        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., /, /about, /services"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status || 'draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template
                      </label>
                      <select
                        value={formData.template || 'default'}
                        onChange={(e) => setFormData({ ...formData, template: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="landing">Landing Page</option>
                        <option value="blog">Blog</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="contact">Contact</option>
                        <option value="about">About</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        checked={formData.isHomepage || false}
                        onChange={(e) => setFormData({ ...formData, isHomepage: e.target.checked })}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Set as Homepage
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Title *
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { ...formData.seo!, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter SEO title (50-60 characters)"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(formData.seo?.title || '').length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description *
                      </label>
                      <textarea
                        value={formData.seo?.metaDescription || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { ...formData.seo!, metaDescription: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter meta description (up to 160 characters)"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(formData.seo?.metaDescription || '').length}/160 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Keyphrase
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.focusKeyphrase || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { ...formData.seo!, focusKeyphrase: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter focus keyphrase for SEO"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.keywords?.join(', ') || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { 
                            ...formData.seo!, 
                            keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>

                  {/* SEO Analysis */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">SEO Analysis</h3>
                      <button
                        onClick={() => setSeoAnalysis(!seoAnalysis)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {seoAnalysis ? 'Hide Analysis' : 'Analyze SEO'}
                      </button>
                    </div>
                    
                    {seoAnalysis && (
                      <YoastSEOAnalyzer
                        title={formData.seo?.title || ''}
                        description={formData.seo?.metaDescription || ''}
                        keyphrase={formData.seo?.focusKeyphrase || ''}
                        content={formData.content?.sections?.map(s => s.content).join('\n') || ''}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Content management system coming soon...</p>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {editingPage?.analytics ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">Page Views</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {editingPage.analytics.views}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">Bounce Rate</h3>
                        <p className="text-2xl font-bold text-green-600">
                          {editingPage.analytics.bounceRate || 0}%
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">Avg. Time on Page</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {editingPage.analytics.avgTimeOnPage || 0}s
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No analytics data available yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingPage ? 'Update Page' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminPages;