import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHelmet } from '../components/SEOHelmet';
import { generateBlogPostSEO } from '../utils/metaTags';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Tag, 
  ArrowLeft, 
  Share2,
  User,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { blogService } from '../services/api';

interface BlogPost {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  readingTime?: number;
  views?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getBySlug(slug!);
      setPost(response.data);
      
      // Fetch related posts
      if (response.data.category) {
        const relatedResponse = await blogService.getAll({
          category: response.data.category,
          limit: 3,
          exclude: response.data._id || response.data.id
        });
        setRelatedPosts(relatedResponse.data.blogs || []);
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      setError(error.response?.data?.message || 'Failed to load blog post');
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-32"></div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Post Not Found'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet config={generateBlogPostSEO(post, settings)} />

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Navigation */}
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white">{post.title}</span>
            </nav>

            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Article Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                  {post.author && (
                    <div className="flex items-center">
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {post.author.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time dateTime={post.publishedAt || post.createdAt}>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                  {post.readingTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}
                  {post.views && (
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      <span>{post.views} views</span>
                    </div>
                  )}
                  <button
                    onClick={sharePost}
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Related Articles
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.article
                      key={relatedPost._id || relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/blog/${relatedPost.slug}`} className="block">
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                            {relatedPost.featuredImage ? (
                              <img
                                src={relatedPost.featuredImage}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <FileText className="w-8 h-8 text-white/70" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 block">
                              {relatedPost.category}
                            </span>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        </div>
      </div>
    </>
  );
};