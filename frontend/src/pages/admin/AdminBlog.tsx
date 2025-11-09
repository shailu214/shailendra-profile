import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { ToastContainer } from '../../components/admin/Toast';
import { YoastSEOAnalyzer } from '../../components/admin/YoastSEOAnalyzer';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useToast } from '../../hooks/useToast';
import { blogService, categoriesService } from '../../services/api';
import {
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Tag,
  Globe,
  FileText,
  ThumbsUp,
  MessageCircle,
  Share,
  X
} from 'lucide-react';interface BlogPost {
  _id?: string;
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured?: boolean;
  status?: 'Draft' | 'Published' | 'Scheduled'; // For UI display
  publishDate: string;
  views: number;
  likes: number;
  comments: any[];
  featuredImage?: string;
  images?: string[];
  readTime?: number;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    keyphrase?: string;
    altText?: string;
  };
}

export const AdminBlog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Dynamic state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [categories, setCategories] = useState<string[]>([]);
  
  const { toasts, removeToast, success, error } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchBlogData();
    fetchMetadata();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllAdmin();
      console.log('Blog data:', response);
      
      // Transform API data to match component interface
      const transformedPosts = response.data?.map((post: any) => ({
        ...post,
        id: post.id || post._id,
        status: post.isPublished ? 'Published' : 'Draft',
        comments: post.comments || [],
        featuredImage: post.featuredImage || post.images?.[0] || '',
        readTime: post.readTime || 5
      })) || [];

      setBlogPosts(transformedPosts);
      
      // Calculate stats
      const totalPosts = transformedPosts.length;
      const publishedCount = transformedPosts.filter((p: any) => p.isPublished).length;
      const totalViews = transformedPosts.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
      const totalLikes = transformedPosts.reduce((sum: number, p: any) => sum + (p.likes || 0), 0);
      
      setStats({
        total: totalPosts,
        published: publishedCount,
        totalViews,
        totalLikes
      });

    } catch (err: any) {
      console.error('Error fetching blog data:', err);
      error('Load Error', 'Failed to load blog data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      // Use the new categories service instead
      const categoriesRes = await categoriesService.getAll();
      
      setCategories(categoriesRes.data?.map((cat: any) => cat.name) || []);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    author: 'Shailendra Chaurasia',
    category: '',
    tags: [],
    status: 'Draft',
    publishDate: '',
    featuredImage: '',
    readTime: 5,
    seo: {
      title: '',
      description: '',
      keyphrase: '',
      altText: ''
    }
  });

  // Static data removed - using dynamic data from API

  // CRUD Functions
  const handleAddPost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: 'Shailendra Chaurasia',
      category: '',
      tags: [],
      status: 'Draft',
      publishDate: new Date().toISOString().split('T')[0],
      featuredImage: '',
      readTime: 5
    });
    setShowModal(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setShowModal(true);
  };

  const handleDeletePost = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      const postId = postToDelete._id || postToDelete.id?.toString() || '';
      await blogService.delete(postId);
      
      success('Post Deleted', `"${postToDelete.title}" has been successfully deleted.`);
      setShowDeleteModal(false);
      setPostToDelete(null);
      
      // Refresh the blog list
      await fetchBlogData();
    } catch (err) {
      console.error('Error deleting post:', err);
      error('Delete Failed', 'There was an error deleting the post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author || 'Shailendra Chaurasia',
        category: formData.category,
        tags: formData.tags || [],
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured || false,
        images: formData.featuredImage ? [formData.featuredImage] : [],
        readTime: formData.readTime || 5,
        seo: formData.seo || {}
      };

      if (editingPost) {
        // Update existing post
        await blogService.update(editingPost._id || editingPost.id?.toString() || '', postData);
        success('Post Updated', `"${formData.title}" has been successfully updated.`);
      } else {
        // Add new post
        await blogService.create(postData);
        success('Post Created', `"${formData.title}" has been successfully created.`);
      }
      
      // Refresh the blog list
      await fetchBlogData();
      setShowModal(false);
      setEditingPost(null);
    } catch (err: any) {
      console.error('Error saving post:', err);
      error('Save Failed', 'There was an error saving the post. Please try again.');
    }
  };

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (tagString: string) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const postStatus = post.isPublished ? 'published' : 'draft';
    const matchesStatus = statusFilter === 'all' || postStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category?.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="mt-2 text-gray-600">
              Create, edit, and manage your blog posts and articles.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button 
              onClick={() => navigate('/admin/blog/categories')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Tag className="w-4 h-4 mr-2" />
              Manage Categories
            </button>
            <button 
              onClick={handleAddPost}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.total || blogPosts.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.published || blogPosts.filter(p => p.isPublished).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalViews?.toLocaleString() || blogPosts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft Posts</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : (stats.total - stats.published) || blogPosts.filter(p => !p.isPublished).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Blog Posts</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{post.author}</span>
                          <Clock className="w-3 h-3 text-gray-400 ml-2" />
                          <span className="text-xs text-gray-500">{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.isPublished ? 'published' : 'draft')}`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview Post"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Share className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination would go here */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredPosts.length} of {blogPosts.length} posts
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Blog Post Modal/Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt * (Rich Text with H2/H3 Support)
                </label>
                <RichTextEditor
                  value={formData.excerpt || ''}
                  onChange={(value) => handleInputChange('excerpt', value)}
                  placeholder="Brief description of the post with headings and formatting..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content * (Rich Text Editor)
                </label>
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={(value) => handleInputChange('content', value)}
                  placeholder="Write your blog post content here with full rich text formatting..."
                  rows={10}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, JavaScript, Web Development (comma separated)"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.isPublished ? 'Published' : 'Draft'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.value === 'Published' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate || ''}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readTime || 5}
                    onChange={(e) => handleInputChange('readTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  SEO Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.title || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo!, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Custom SEO title (leave blank to use post title)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Length: {(formData.seo?.title || '').length}/60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seo?.description || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo!, description: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Custom SEO description (leave blank to use excerpt)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Length: {(formData.seo?.description || '').length}/160 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Keyphrase
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.keyphrase || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo!, keyphrase: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Main keyword for this post"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.altText || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo!, altText: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descriptive alt text for featured image"
                      />
                    </div>
                  </div>

                  {/* SEO Analysis */}
                  {(formData.title || formData.seo?.title) && (
                    <div className="mt-4">
                      <YoastSEOAnalyzer
                        title={formData.seo?.title || formData.title || ''}
                        description={formData.seo?.description || formData.excerpt || ''}
                        keyphrase={formData.seo?.keyphrase || ''}
                        content={formData.content || ''}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePost}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete Post"
        cancelText="Cancel"
        loading={isDeleting}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AdminLayout>
  );
};