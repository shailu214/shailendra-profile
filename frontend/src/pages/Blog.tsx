import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHelmet } from '../components/SEOHelmet';
import { pageSEO } from '../utils/metaTags';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Eye, 
  ArrowRight,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { blogService } from '../services/api';

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

export const Blog: React.FC = () => {
  const { settings } = useSettings();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  // Fetch blog posts
  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAll({
        page: currentPage,
        limit: postsPerPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sort: 'newest'
      });
      setBlogPosts(response.data.blogs || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogPosts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHelmet config={pageSEO.blog(settings)} />

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Blog
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Thoughts, tutorials, and insights about web development, technology, and my journey as a developer.
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>

                {/* Category Filter */}
                <div className="flex items-center space-x-3">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-20"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {blogPosts.map((post, index) => (
                    <motion.article
                      key={post._id || post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                    >
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                          {post.featuredImage ? (
                            <img 
                              src={post.featuredImage} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FileText className="w-12 h-12 text-white/70" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                              {post.category}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {post.excerpt || post.content?.substring(0, 150) + '...'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                              <span className="text-sm font-medium">Read More</span>
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm">
                              {post.readingTime && (
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {post.readingTime}min
                                </span>
                              )}
                              {post.views && (
                                <span className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {post.views}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Posts Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Check back soon for new blog posts!'}
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};