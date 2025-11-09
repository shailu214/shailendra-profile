import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHelmet } from '../components/SEOHelmet';
import { pageSEO } from '../utils/metaTags';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ExternalLink, 
  Github, 
  Calendar, 
  Eye, 
  Heart,
  Code,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { portfolioService } from '../services/api';

interface Portfolio {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  images: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  createdAt: string;
  views?: number;
  likes?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export const Portfolio: React.FC = () => {
  const { settings } = useSettings();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const projectsPerPage = 9;

  // Fetch portfolio projects
  useEffect(() => {
    fetchPortfolios();
    fetchCategories();
    fetchTechnologies();
  }, [currentPage, selectedCategory, selectedTechnology, searchTerm]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getAll({
        page: currentPage,
        limit: projectsPerPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        technology: selectedTechnology !== 'all' ? selectedTechnology : undefined,
        search: searchTerm || undefined,
        sort: 'newest'
      });
      setPortfolios(response.data.projects || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching portfolio projects:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await portfolioService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const response = await portfolioService.getTechnologies();
      setTechnologies(response.data || []);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPortfolios();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTechnologyChange = (technology: string) => {
    setSelectedTechnology(technology);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTechnology('all');
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHelmet config={pageSEO.portfolio(settings)} />

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                My Portfolio
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Here's a collection of projects I've worked on. Each project represents a unique 
                challenge and learning experience.
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
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

                  {/* Technology Filter */}
                  <select
                    value={selectedTechnology}
                    onChange={(e) => handleTechnologyChange(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Technologies</option>
                    {technologies.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-l-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-r-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedCategory !== 'all' || selectedTechnology !== 'all') && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {searchTerm && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-sm rounded-full">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedTechnology !== 'all' && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm rounded-full">
                      Tech: {selectedTechnology}
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Portfolio Grid/List */}
            {loading ? (
              <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'} mb-12`}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                    <div className={`${viewMode === 'grid' ? 'aspect-video' : 'h-48'} bg-gray-300 dark:bg-gray-700`}></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-20"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : portfolios.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'
                  : 'space-y-6 mb-12'
                }>
                  {portfolios.map((project, index) => (
                    <motion.article
                      key={project._id || project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`group ${viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105'
                        : 'bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex'
                      }`}
                    >
                      <Link to={`/portfolio/${project.slug || project._id}`} className="block">
                        <div className={`${viewMode === 'grid' 
                          ? 'aspect-video' 
                          : 'w-80 h-48 flex-shrink-0'
                        } bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden`}>
                          {project.images && project.images.length > 0 ? (
                            <img 
                              src={project.images[0]} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Code className="w-12 h-12 text-white/70" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                          {project.isFeatured && (
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-full flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                              {project.category}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {project.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies && project.technologies.slice(0, 4).map((tech, techIndex) => (
                              <span 
                                key={techIndex} 
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies && project.technologies.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                                +{project.technologies.length - 4} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm">
                              {project.views && (
                                <span className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {project.views}
                                </span>
                              )}
                              {project.likes && (
                                <span className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1" />
                                  {project.likes}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {project.liveUrl && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(project.liveUrl, '_blank');
                                  }}
                                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                  title="View Live Project"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              )}
                              {project.githubUrl && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(project.githubUrl, '_blank');
                                  }}
                                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                  title="View Source Code"
                                >
                                  <Github className="h-4 w-4" />
                                </button>
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
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Projects Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {searchTerm || selectedCategory !== 'all' || selectedTechnology !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Check back soon for new projects!'}
                </p>
                {(searchTerm || selectedCategory !== 'all' || selectedTechnology !== 'all') && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
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